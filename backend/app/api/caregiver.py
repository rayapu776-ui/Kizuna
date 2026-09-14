from datetime import datetime, date
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models.user import User
from backend.app.models.consent import ConsentSetting
from backend.app.models.risk import RiskAssessment
from backend.app.models.nudge import BehavioralNudge
from backend.app.models.telemetry import TelemetryDaily
from backend.app.api.auth import get_current_user

router = APIRouter(prefix="/api/caregiver", tags=["Caregiver CRAFT & MHFA Bridge"])

# CRAFT/MHFA 5-Pillar Guidelines and "Say This, Not That" scripts
CRAFT_FRAMEWORK_DATA = {
    "framework_overview": {
        "title": "CRAFT & Mental Health First Aid (MHFA) Caregiver Protocol",
        "description": "Evidence-backed approach designed to prevent confrontational burnout and parental panic. Research shows demanding an isolated youth 'get out of their room' increases defensive withdrawal. CRAFT replaces confrontation with positive reinforcement and non-judgmental presence.",
        "core_pillars": [
            {
                "stage": 1,
                "name": "Assess Without Alarm",
                "purpose": "Understand the behavioral trend objectively without panicking or viewing it as rebellion or laziness.",
                "action_steps": [
                    "View the trend as a coping mechanism for underlying overwhelm, not personal defiance.",
                    "Observe sleep timing shifts and mobility quietly without sudden inquisitions.",
                    "Ensure your own emotional regulation before initiating contact."
                ]
            },
            {
                "stage": 2,
                "name": "Listen Non-Judgmentally",
                "purpose": "Provide a psychologically safe harbor where the individual doesn't feel ambushed or interrogated.",
                "action_steps": [
                    "Sit comfortably without blocking doorways or standing over them.",
                    "Reflect feeling rather than fact ('It sounds like everything felt exhausting today').",
                    "Tolerate silence without rushing to fill it with lectures or advice."
                ]
            },
            {
                "stage": 3,
                "name": "Give Factual Information",
                "purpose": "Destigmatize the condition using evidence-based psychoeducation.",
                "action_steps": [
                    "Acknowledge that social exhaustion and sensory burnout are biologically real.",
                    "Dispel family blame: hikikomori is not caused by poor parenting or moral failure.",
                    "Explain that recovery is graduated and non-linear."
                ]
            },
            {
                "stage": 4,
                "name": "Encourage Help Gently",
                "purpose": "Introduce external resources without forcing ultimatums.",
                "action_steps": [
                    "Offer low-friction options: anonymous text consultation before face-to-face clinics.",
                    "Ask permission: 'Would you be open to me reaching out to a support counselor just to ask questions for us?'",
                    "Respect autonomy: Avoid forced scheduling without their consent."
                ]
            },
            {
                "stage": 5,
                "name": "Encourage Support & Caregiver Self-Care",
                "purpose": "Sustain caregiver resilience and model healthy adult functioning.",
                "action_steps": [
                    "Maintain your own social life, hobbies, and routines outside the home.",
                    "Set compassionate boundaries: support without enabling total paralysis.",
                    "Join a caregiver peer group (e.g. KHJ Family Association)."
                ]
            }
        ]
    },
    "dialogue_coaching": [
        {
            "scenario": "Addressing Day/Night Circadian Inversion (Sleeping all day, active all night)",
            "avoid_saying": "Why are you wasting your life sleeping all day? You're ruining your future on that computer.",
            "avoid_rationale": "Triggers intense shame, defensiveness, and deeper retreat into nocturnal isolation.",
            "recommended_saying": "I noticed your sleep schedule has shifted late. It's easy for sleep to drift when feeling stressed. I left some dinner in the fridge for whenever you're hungry tonight.",
            "recommended_rationale": "Validates the physiological strain without blame and preserves warm parental presence without pressure."
        },
        {
            "scenario": "Noticing Prolonged Room Confinement & Dropping Mobility",
            "avoid_saying": "You haven't stepped outside this house in two weeks! If you don't go out today, I'm turning off the Wi-Fi.",
            "avoid_rationale": "Ultimatums and threats of severance provoke acute crisis, hostility, and total communication breakdown.",
            "recommended_saying": "I'm going to water the plants on the porch / pick up bread from the bakery. You don't have to talk to anyone, but you're very welcome to step out with me for five minutes if you'd like.",
            "recommended_rationale": "Low-stakes invitation with an easy exit ramp. Normalizes outdoor presence without demanding social performance."
        },
        {
            "scenario": "When the Youth Finally Steps Out or Completes a Micro-Nudge",
            "avoid_saying": "Finally! Look who decided to rejoin the human race! Why can't you do this every day?",
            "avoid_rationale": "Sarcasm and retroactive guilt punish the exact positive behavior you want to encourage.",
            "recommended_saying": "It was really nice seeing you in the kitchen. That tea smelled great. Let me know if you need anything from the market.",
            "recommended_rationale": "Subtle, positive reinforcement that keeps the interaction relaxed, respectful, and safe to repeat."
        },
        {
            "scenario": "Suggesting Professional Help or Support Centers",
            "avoid_saying": "There is something wrong with you. You need to see a psychiatrist immediately.",
            "avoid_rationale": "Pathologizing creates acute stigma and fear of institutionalization.",
            "recommended_saying": "Many young people experience this kind of burnout and find it helpful to talk to someone neutral. There's a peer support hotline where you can even just text anonymously. Would you like me to leave the link on your desk?",
            "recommended_rationale": "Emphasizes neutrality, low stakes, and autonomy over when and how to engage."
        }
    ]
}

@router.get("/dashboard-view")
def get_caregiver_dashboard_view(
    youth_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Caregiver portal view calibrated strictly by youth's consent settings.
    Avoids panic alerts: frames status through CRAFT constructive guidance.
    """
    # Find linked youth
    if current_user.role == "caregiver" and current_user.linked_user_id:
        target_youth_id = current_user.linked_user_id
    elif youth_id:
        target_youth_id = youth_id
    else:
        # Default to Ren Sato
        ren = db.query(User).filter(User.username == "ren_sato").first()
        target_youth_id = ren.id if ren else 1

    youth = db.query(User).filter(User.id == target_youth_id).first()
    if not youth:
        raise HTTPException(status_code=404, detail="Linked youth not found")

    consent = db.query(ConsentSetting).filter(ConsentSetting.youth_id == target_youth_id).first()
    if not consent:
        consent = ConsentSetting(youth_id=target_youth_id, caregiver_id=current_user.id)
        db.add(consent)
        db.commit()

    # Get latest risk assessment
    assessment = db.query(RiskAssessment).filter(
        RiskAssessment.user_id == target_youth_id
    ).order_by(RiskAssessment.assessment_date.desc()).first()

    # Get completed nudges to highlight forward momentum
    completed_nudges = db.query(BehavioralNudge).filter(
        BehavioralNudge.user_id == target_youth_id,
        BehavioralNudge.status == "completed"
    ).all()

    # Construct de-escalated, non-alarmist status based on consent
    risk_level_display = "Stable / Protected"
    caregiver_guidance_lead = "Behavioral signals remain within comfortable home boundaries."
    
    if assessment and consent.share_risk_level:
        if assessment.risk_tier == "low":
            risk_level_display = "Connected & Active"
            caregiver_guidance_lead = "Routines and social engagement are currently steady. Continue regular, warm interactions."
        elif assessment.risk_tier == "emerging":
            risk_level_display = "Early Rest Phase (Emerging Withdrawal)"
            caregiver_guidance_lead = "Behavioral cues suggest tiredness or retreating into private space. Focus on gentle, non-demanding presence."
        elif assessment.risk_tier == "moderate":
            risk_level_display = "Elevated Retreat Pattern"
            caregiver_guidance_lead = "Significant home confinement and late hours detected. Adopt CRAFT Stage 2 (Listen Non-Judgmentally) and avoid ultimatums."
        else:
            risk_level_display = "Intensive Retreat (Caregiver Support Recommended)"
            caregiver_guidance_lead = "Extended withdrawal observed. Consult a caregiver peer group or support specialist for guidance on gradual reconnecting."

    # Consented telemetry insights (filtered)
    consented_insights = {}
    if consent.share_plain_language_summary and assessment:
        consented_insights["summary"] = assessment.plain_language_summary
    if consent.share_subscores and assessment:
        consented_insights["subscores"] = {
            "mobility": assessment.mobility_subscore,
            "circadian": assessment.circadian_subscore,
            "social": assessment.social_subscore,
            "digital": assessment.digital_subscore
        }

    return {
        "youth_name": youth.full_name,
        "youth_age": youth.age,
        "is_minor": youth.is_minor,
        "relationship": "Parent / Family Caregiver",
        "consented_status": {
            "risk_band": risk_level_display if consent.share_risk_level else "Shared status withheld by youth",
            "guidance_lead": caregiver_guidance_lead,
            "consented_insights": consented_insights,
            "completed_forward_steps": len(completed_nudges) if consent.share_nudge_completions else None,
            "recent_completed_tasks": [n.title for n in completed_nudges[-3:]] if consent.share_nudge_completions else []
        },
        "craft_protocol": CRAFT_FRAMEWORK_DATA,
        "consent_transparency_note": "To protect relational trust, this dashboard only displays data streams your family member has explicitly consented to share. The system will never conduct covert surveillance."
    }

@router.post("/send-gentle-invite")
def send_gentle_caregiver_invite(
    invite_type: str,
    custom_message: Optional[str] = None,
    youth_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Caregiver sends a pre-formatted, non-pressuring CRAFT invitation to the youth:
    e.g. 'Left fresh fruit on counter', 'Making family meal at 7:00, no pressure to talk'.
    """
    invites = {
        "food_shared": "I prepared a meal and left a plate warm on the stove for whenever you want it tonight.",
        "low_stakes_outing": "I'm heading out for a 15-minute grocery run. If you'd like to ride along in the car just for fresh air, the door's open.",
        "quiet_presence": "Just wanted to let you know I'm working in the living room if you ever want some tea. No need to chat if you're resting."
    }
    msg = custom_message or invites.get(invite_type, invites["food_shared"])
    
    return {
        "status": "delivered",
        "delivery_mode": "Silent non-intrusive card on youth sanctuary dashboard",
        "message": msg,
        "craft_tip": "Do not follow up immediately asking if they received it. Let the safe invitation sit patiently without expectation."
    }

