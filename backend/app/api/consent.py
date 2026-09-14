from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models.user import User
from backend.app.models.consent import ConsentSetting
from backend.app.models.risk import RiskAssessment
from backend.app.models.nudge import BehavioralNudge
from backend.app.schemas.consent import ConsentSettingUpdate, ConsentSettingResponse, WhatCaregiverSeesPreview
from backend.app.api.auth import get_current_user

router = APIRouter(prefix="/api/consent", tags=["Consent Architecture & Relational Trust"])

@router.get("/settings", response_model=ConsentSettingResponse)
def get_user_consent_settings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieves the youth's granular opt-in permissions for passive data sharing.
    """
    settings = db.query(ConsentSetting).filter(ConsentSetting.youth_id == current_user.id).first()
    if not settings:
        settings = ConsentSetting(youth_id=current_user.id, caregiver_id=current_user.linked_user_id)
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings

@router.put("/settings", response_model=ConsentSettingResponse)
def update_consent_settings(
    update: ConsentSettingUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Enables granular control over each passive behavioral stream.
    Youth maintains complete autonomy over what is shared with caregivers.
    """
    settings = db.query(ConsentSetting).filter(ConsentSetting.youth_id == current_user.id).first()
    if not settings:
        settings = ConsentSetting(youth_id=current_user.id, caregiver_id=current_user.linked_user_id)
        db.add(settings)

    for field, val in update.dict().items():
        setattr(settings, field, val)

    db.commit()
    db.refresh(settings)
    return settings

@router.get("/caregiver-preview", response_model=WhatCaregiverSeesPreview)
def get_what_caregiver_sees_preview(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Live Transparency Engine: Renders an exact mirror of what the caregiver's portal displays.
    Directly addresses PDF Page 3: Prevents covert monitoring and preserves relational trust.
    """
    settings = db.query(ConsentSetting).filter(ConsentSetting.youth_id == current_user.id).first()
    if not settings:
        settings = ConsentSetting(youth_id=current_user.id)
        db.add(settings)
        db.commit()

    assessment = db.query(RiskAssessment).filter(
        RiskAssessment.user_id == current_user.id
    ).order_by(RiskAssessment.assessment_date.desc()).first()

    completed_nudges_count = db.query(BehavioralNudge).filter(
        BehavioralNudge.user_id == current_user.id,
        BehavioralNudge.status == "completed"
    ).count()

    redacted = []
    if not settings.share_risk_level:
        redacted.append("Overall Risk Tier")
    if not settings.share_subscores:
        redacted.append("Domain Subscores (Mobility, Sleep, Social, Digital numbers)")
    if not settings.share_plain_language_summary:
        redacted.append("Plain-Language Explanations")
    if not settings.share_exact_screen_time:
        redacted.append("Exact Screen Time & App Usage")
    if not settings.share_location_entropy:
        redacted.append("GPS Location Variety & Map Coordinates")
    if not settings.share_sleep_timing:
        redacted.append("Sleep Schedule & Wake Midpoint")
    if not settings.share_social_counts:
        redacted.append("Call & Message Counts")
    if not settings.share_voice_prosody:
        redacted.append("Voice Prosody Affect Metrics")

    return WhatCaregiverSeesPreview(
        youth_name=current_user.full_name,
        risk_level_visible=assessment.risk_tier.capitalize() if (settings.share_risk_level and assessment) else None,
        plain_summary_visible=assessment.plain_language_summary if (settings.share_plain_language_summary and assessment) else None,
        subscores_visible={
            "mobility": assessment.mobility_subscore,
            "circadian": assessment.circadian_subscore,
            "social": assessment.social_subscore,
            "digital": assessment.digital_subscore
        } if (settings.share_subscores and assessment) else None,
        screen_time_visible=None,  # Consistently redacted unless specifically requested
        mobility_entropy_visible=None,
        sleep_timing_visible=None,
        social_counts_visible=None,
        prosody_visible=None,
        nudges_completed_count=completed_nudges_count if settings.share_nudge_completions else None,
        redacted_streams=redacted,
        trust_index_message=f"Transparent Sharing Active: {len(redacted)} sensitive telemetry stream(s) are strictly shielded from caregiver view."
    )

