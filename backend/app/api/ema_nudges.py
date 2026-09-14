from datetime import date, datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models.user import User
from backend.app.models.ema import EMACheckin
from backend.app.models.nudge import BehavioralNudge
from backend.app.schemas.ema import EMACheckinCreate, EMACheckinResponse
from backend.app.schemas.nudge import BehavioralNudgeResponse, NudgeActionUpdate
from backend.app.api.auth import get_current_user

router = APIRouter(prefix="/api/ema", tags=["EMA & Nudge Engine"])

# Catalog of evidence-based, grounded, non-virtual behavioral activation interventions
# Strictly avoids virtual companionship, roleplay, or AI conversational friends
GROUNDED_NUDGE_CATALOG = [
    {
        "title": "Open Window & Deep Sensory Breath",
        "category": "sensory",
        "description": "Open your window or step onto a balcony for 2 full minutes. Notice three distant outdoor sounds and feel the outside temperature on your skin.",
        "rationale": "Breaks sensory deprivation and domestic room confinement safely without pressure.",
        "difficulty": 1,
        "minutes": 3
    },
    {
        "title": "10-Minute Neighborhood Stroll",
        "category": "physical",
        "description": "Put on shoes and walk around your residential block once, without checking social media. Return whenever you choose.",
        "rationale": "Gentle physical activation and spatial entropy expansion.",
        "difficulty": 2,
        "minutes": 10
    },
    {
        "title": "Low-Stakes Message to One Friend",
        "category": "social_micro",
        "description": "Send a simple zero-pressure text to one acquaintance or family member (e.g. sharing a photo of something you cooked, a funny meme, or saying hi).",
        "rationale": "Counters social friction with a microscopic low-stakes touchpoint.",
        "difficulty": 2,
        "minutes": 5
    },
    {
        "title": "Tangible Non-Screen Hobby Task",
        "category": "hobby",
        "description": "Engage in an analog activity for 15 minutes: sketch something in your room, water a plant, organize one shelf, or brew loose-leaf tea.",
        "rationale": "Substitutes passive digital escape with tangible tactile agency.",
        "difficulty": 1,
        "minutes": 15
    },
    {
        "title": "Convenience Store Micro-Mission",
        "category": "physical",
        "description": "Walk to the nearest local konbini/store to pick up a favorite beverage. Exchange a brief nod or 'thank you' at the register.",
        "rationale": "Graduated exposure to shared human spaces with structured commercial interaction.",
        "difficulty": 3,
        "minutes": 15
    }
]

@router.post("/checkin", response_model=EMACheckinResponse)
def submit_ema_checkin(
    data: EMACheckinCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Submits a rapid 10-second Ecological Momentary Assessment (EMA) check-in.
    Actionable daily levers: mood, social contact today, internet use nature.
    """
    check_date = data.checkin_date or date.today()
    
    checkin = EMACheckin(
        user_id=current_user.id,
        checkin_date=check_date,
        checkin_time_slot=data.checkin_time_slot,
        mood_score=data.mood_score,
        had_social_contact=data.had_social_contact,
        social_enjoyment_score=data.social_enjoyment_score,
        internet_use_nature=data.internet_use_nature,
        internet_enjoyment_score=data.internet_enjoyment_score,
        quick_note=data.quick_note
    )
    db.add(checkin)
    db.commit()
    db.refresh(checkin)
    
    # Pattern check: e.g. low mood (<=2) or lack of social contact triggers behavioral activation
    _evaluate_and_trigger_nudges(current_user.id, data, db)
    
    return checkin

def _evaluate_and_trigger_nudges(user_id: int, recent_checkin: EMACheckinCreate, db: Session):
    """
    Trigger grounded micro-interventions if withdrawal patterns emerge:
    e.g., low mood plus lack of social contact or high avoidance internet use.
    """
    # Check if there is already an active pending nudge
    pending = db.query(BehavioralNudge).filter(
        BehavioralNudge.user_id == user_id,
        BehavioralNudge.status == "pending"
    ).first()
    
    if pending:
        return  # Don't overwhelm user with multiple pending tasks
        
    # Pattern detection
    if recent_checkin.mood_score <= 2 and not recent_checkin.had_social_contact:
        template = GROUNDED_NUDGE_CATALOG[2]  # Low-stakes message
        rationale = "Pattern noticed: Lower mood and zero direct social contact today. A micro-touchpoint can gently restore connection."
    elif recent_checkin.internet_use_nature == "passive_escape" and recent_checkin.mood_score <= 3:
        template = GROUNDED_NUDGE_CATALOG[1]  # 10-minute walk
        rationale = "Pattern noticed: Extended screen immersion as escape. A brief fresh-air reset helps ground your nervous system."
    elif not recent_checkin.had_social_contact:
        template = GROUNDED_NUDGE_CATALOG[0]  # Open window
        rationale = "Daily routine reset: Gentle sensory stimulation to stay anchored to the outside world."
    else:
        template = GROUNDED_NUDGE_CATALOG[3]  # Hobby task
        rationale = "Daily behavioral activation: Fostering tangible agency and calm focus."

    nudge = BehavioralNudge(
        user_id=user_id,
        title=template["title"],
        category=template["category"],
        description=template["description"],
        rationale=rationale,
        graduated_difficulty=template["difficulty"],
        estimated_minutes=template["minutes"],
        status="pending"
    )
    db.add(nudge)
    db.commit()

@router.get("/nudges", response_model=List[BehavioralNudgeResponse])
def get_user_nudges(
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Returns the user's active and historical behavioral activation micro-tasks.
    """
    query = db.query(BehavioralNudge).filter(BehavioralNudge.user_id == current_user.id)
    if status_filter:
        query = query.filter(BehavioralNudge.status == status_filter)
    return query.order_by(BehavioralNudge.created_at.desc()).all()

@router.patch("/nudges/{nudge_id}", response_model=BehavioralNudgeResponse)
def update_nudge_status(
    nudge_id: int,
    update: NudgeActionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Updates the status of a behavioral nudge (completed or skipped with reflection).
    """
    nudge = db.query(BehavioralNudge).filter(
        BehavioralNudge.id == nudge_id,
        BehavioralNudge.user_id == current_user.id
    ).first()
    
    if not nudge:
        raise HTTPException(status_code=404, detail="Nudge not found")
        
    nudge.status = update.status
    if update.user_reflection:
        nudge.user_reflection = update.user_reflection
    if update.status == "completed":
        nudge.completed_at = datetime.utcnow()
        
    db.commit()
    db.refresh(nudge)
    return nudge

@router.get("/history", response_model=List[EMACheckinResponse])
def get_ema_history(
    days: int = 14,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieves the user's recent EMA check-in timeline.
    """
    records = db.query(EMACheckin).filter(
        EMACheckin.user_id == current_user.id
    ).order_by(EMACheckin.checkin_date.desc()).limit(days).all()
    return records

