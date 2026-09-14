import json
from datetime import date, datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models.user import User
from backend.app.models.telemetry import TelemetryDaily
from backend.app.models.risk import RiskAssessment
from backend.app.schemas.risk import RiskAssessmentResponse, RiskSimulateRequest, SHAPFeatureImpact
from backend.app.api.auth import get_current_user
from backend.app.ml.model import withdrawal_model, YOUTH_HEALTHY_BASELINE
from backend.app.ml.shap_explainer import shap_explainer
from backend.app.ml.elderly_mode import elderly_model

router = APIRouter(prefix="/api/risk", tags=["Interpretable Risk & SHAP Engine"])

@router.get("/latest", response_model=RiskAssessmentResponse)
def get_latest_risk_assessment(
    user_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieves the most recent explainable risk assessment for the target user.
    """
    target_user_id = user_id or current_user.id
    assessment = db.query(RiskAssessment).filter(
        RiskAssessment.user_id == target_user_id
    ).order_by(RiskAssessment.assessment_date.desc()).first()

    if not assessment:
        # Generate on the fly from latest telemetry
        return evaluate_current_user_risk(target_user_id, db)

    # Parse stored JSON fields
    shap_list = []
    if assessment.shap_attributions_json:
        try:
            raw_shap = json.loads(assessment.shap_attributions_json)
            shap_list = [SHAPFeatureImpact(**item) for item in raw_shap]
        except Exception:
            shap_list = []
            
    drivers_list = []
    if assessment.key_drivers:
        try:
            drivers_list = json.loads(assessment.key_drivers)
        except Exception:
            drivers_list = [assessment.plain_language_summary]

    return RiskAssessmentResponse(
        id=assessment.id,
        user_id=assessment.user_id,
        assessment_date=assessment.assessment_date,
        overall_risk_score=assessment.overall_risk_score,
        risk_tier=assessment.risk_tier,
        mobility_subscore=assessment.mobility_subscore,
        circadian_subscore=assessment.circadian_subscore,
        social_subscore=assessment.social_subscore,
        digital_subscore=assessment.digital_subscore,
        plain_language_summary=assessment.plain_language_summary,
        key_drivers=drivers_list,
        shap_breakdown=shap_list,
        recommended_action_tier=assessment.recommended_action_tier,
        created_at=assessment.created_at
    )

@router.post("/evaluate", response_model=RiskAssessmentResponse)
def evaluate_current_user_risk(
    user_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    """
    Runs the interpretable Random Forest and SHAP explainer on the user's latest telemetry window.
    """
    target_id = user_id or (current_user.id if current_user else 1)
    
    # Retrieve user's most recent telemetry entry
    latest_tel = db.query(TelemetryDaily).filter(
        TelemetryDaily.user_id == target_id
    ).order_by(TelemetryDaily.log_date.desc()).first()
    
    feature_dict = {}
    if latest_tel:
        for attr in withdrawal_model.feature_names:
            feature_dict[attr] = getattr(latest_tel, attr, YOUTH_HEALTHY_BASELINE[attr])
    else:
        feature_dict = YOUTH_HEALTHY_BASELINE.copy()

    # Predict with Random Forest
    overall_score, tier, subscores = withdrawal_model.predict_risk(feature_dict)
    
    # Generate SHAP attributions and plain-language summary
    shap_impacts, plain_summary, key_drivers = shap_explainer.explain(feature_dict)
    
    # Determine action tier
    if tier == "low":
        action_tier = "positive_reinforcement"
    elif tier == "emerging":
        action_tier = "graduated_micro_nudge"
    elif tier == "moderate":
        action_tier = "gentle_caregiver_bridge"
    else:
        action_tier = "warm_professional_handoff"

    # Save assessment record
    assessment = RiskAssessment(
        user_id=target_id,
        assessment_date=latest_tel.log_date if latest_tel else date.today(),
        overall_risk_score=overall_score,
        risk_tier=tier,
        mobility_subscore=subscores["mobility"],
        circadian_subscore=subscores["circadian"],
        social_subscore=subscores["social"],
        digital_subscore=subscores["digital"],
        shap_attributions_json=json.dumps(shap_impacts),
        plain_language_summary=plain_summary,
        key_drivers=json.dumps(key_drivers),
        recommended_action_tier=action_tier
    )
    db.add(assessment)
    db.commit()
    db.refresh(assessment)

    return RiskAssessmentResponse(
        id=assessment.id,
        user_id=assessment.user_id,
        assessment_date=assessment.assessment_date,
        overall_risk_score=assessment.overall_risk_score,
        risk_tier=assessment.risk_tier,
        mobility_subscore=assessment.mobility_subscore,
        circadian_subscore=assessment.circadian_subscore,
        social_subscore=assessment.social_subscore,
        digital_subscore=assessment.digital_subscore,
        plain_language_summary=assessment.plain_language_summary,
        key_drivers=key_drivers,
        shap_breakdown=[SHAPFeatureImpact(**item) for item in shap_impacts],
        recommended_action_tier=assessment.recommended_action_tier,
        created_at=assessment.created_at
    )

@router.post("/simulate")
def simulate_behavioral_risk(req: RiskSimulateRequest):
    """
    Live Interactive Sandbox: Allows sliders in UI to dynamically compute
    interpretable Random Forest risk and SHAP attributions in real time.
    Supports both 'youth_hikikomori' and 'elderly_isolation' population models!
    """
    features = req.dict()
    population = features.pop("population_type", "youth_hikikomori")

    if population == "elderly_isolation":
        score, tier, breakdown, summary = elderly_model.evaluate_elderly_isolation(features)
        return {
            "population": "elderly_isolation",
            "overall_risk_score": score,
            "risk_tier": tier,
            "plain_language_summary": summary,
            "elderly_breakdown": breakdown,
            "model_type": "Adapted Geriatric Isolation Baseline (Physical mobility & communication decay weighted)"
        }
    else:
        score, tier, subscores = withdrawal_model.predict_risk(features)
        shap_impacts, plain_summary, key_drivers = shap_explainer.explain(features)
        return {
            "population": "youth_hikikomori",
            "overall_risk_score": score,
            "risk_tier": tier,
            "subscores": subscores,
            "plain_language_summary": plain_summary,
            "key_drivers": key_drivers,
            "shap_breakdown": shap_impacts,
            "model_type": "Interpretable Random Forest (Circadian day/night inversion & digital immersion weighted)"
        }

