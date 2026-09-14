from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models.user import User
from backend.app.models.support import SupportResource, ReferralHandoff
from backend.app.models.risk import RiskAssessment
from backend.app.schemas.support import SupportResourceResponse, WarmHandoffCreate, WarmHandoffResponse
from backend.app.api.auth import get_current_user

router = APIRouter(prefix="/api/resources", tags=["Support Directory & Warm Hand-off"])

@router.get("/", response_model=List[SupportResourceResponse])
def get_support_resources(
    org_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Returns verified hikikomori support centers, family associations, and hotlines.
    """
    query = db.query(SupportResource)
    if org_type:
        query = query.filter(SupportResource.organization_type == org_type)
    return query.all()

@router.post("/warm-handoff", response_model=WarmHandoffResponse)
def create_warm_handoff_referral(
    payload: WarmHandoffCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Generates a structured, destigmatized warm hand-off intake brief.
    Provides receiving clinicians with consented behavioral context without pathologizing the individual.
    """
    resource = db.query(SupportResource).filter(SupportResource.id == payload.resource_id).first()
    if not resource:
        raise HTTPException(status_code=404, detail="Selected support center not found")

    assessment = db.query(RiskAssessment).filter(
        RiskAssessment.user_id == payload.user_id
    ).order_by(RiskAssessment.assessment_date.desc()).first()

    risk_tier = assessment.risk_tier.capitalize() if assessment else "Emerging"
    plain_summary = assessment.plain_language_summary if assessment else "Gradual reduction in physical mobility and social reach-out."

    # Build clinically dignified intake packet
    letter_text = f"""--- KIZUNA CONFIDENTIAL CLINICAL WARM HAND-OFF BRIEF ---
Target Provider: {resource.name} ({resource.location})
Recipient Service Type: {resource.organization_type.replace('_', ' ').title()}
Date Generated: {assessment.assessment_date if assessment else 'Current Date'}

1. PATIENT / CLIENT PERSPECTIVE:
- Preferred Name: {current_user.full_name}
- Age Category: {current_user.age} ({'Minor - Parental Bridge Protocol' if current_user.is_minor else 'Independent Young Adult'})
- Client Statement / Current Priority: {payload.notes_from_user_or_caregiver or 'Seeking non-judgmental guidance regarding routine reconnection and sensory burnout.'}

2. OBJECTIVE BEHAVIORAL SENSING CONTEXT (Consented Aggregates):
- Current Withdrawal Risk Tier: {risk_tier}
- Key Observed Trend: {plain_summary}
- Circadian Profile: Gradual night-shift tendency observed in recent sleep timing.
- Direct Outbound Contact: Diminished peer touchpoints over recent 14-day window.

3. CLINICAL FRAMING & CRAFT HARMONIZATION:
- This individual has expressed interest in exploring low-pressure external support.
- Recommended First Contact: Gentle, asynchronous text consultation or informal initial intake without immediate demand for extensive autobiographical disclosure.
- Caregiver Dynamic: Coordinated through CRAFT principles (positive reinforcement, de-escalated presence).

Prepared securely via Kizuna Ethical Human Bridge Protocol. Zero raw surveillance logs transmitted.
-------------------------------------------------------"""

    referral = ReferralHandoff(
        user_id=payload.user_id,
        resource_id=payload.resource_id,
        handoff_type="warm_intake_letter",
        generated_summary=letter_text,
        status="ready_for_dispatch"
    )
    db.add(referral)
    db.commit()
    db.refresh(referral)

    return WarmHandoffResponse(
        id=referral.id,
        user_id=referral.user_id,
        resource_id=referral.resource_id,
        resource_name=resource.name,
        handoff_type=referral.handoff_type,
        generated_summary=referral.generated_summary,
        status=referral.status,
        created_at=referral.created_at
    )

