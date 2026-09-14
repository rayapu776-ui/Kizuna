from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class BehavioralNudgeResponse(BaseModel):
    id: int
    user_id: int
    title: str
    category: str  # "physical", "social_micro", "sensory", "hobby"
    description: str
    rationale: str
    graduated_difficulty: int
    estimated_minutes: int
    status: str  # "pending", "completed", "skipped"
    user_reflection: Optional[str] = None
    completed_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True

class NudgeActionUpdate(BaseModel):
    status: str  # "completed" or "skipped"
    user_reflection: Optional[str] = None

