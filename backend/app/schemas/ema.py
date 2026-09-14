from pydantic import BaseModel, Field
from datetime import date, datetime
from typing import Optional

class EMACheckinCreate(BaseModel):
    checkin_date: Optional[date] = None
    checkin_time_slot: str = "evening"
    mood_score: int = Field(ge=1, le=5, default=3)
    had_social_contact: bool = True
    social_enjoyment_score: int = Field(ge=1, le=5, default=3)
    internet_use_nature: str = "mixed"
    internet_enjoyment_score: int = Field(ge=1, le=5, default=3)
    quick_note: Optional[str] = None

class EMACheckinResponse(EMACheckinCreate):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

