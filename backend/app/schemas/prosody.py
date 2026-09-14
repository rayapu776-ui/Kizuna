from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional

class ProsodyResponse(BaseModel):
    id: int
    user_id: int
    sample_date: date
    pitch_variance_hz: float
    speech_rate_wpm: float
    pause_length_ratio: float
    vocal_energy_db: float
    affect_flatness_score: float
    zero_content_guarantee: bool
    call_duration_seconds: int
    prosody_interpretation: str
    created_at: datetime

    class Config:
        from_attributes = True

class ProsodySimulateRequest(BaseModel):
    pitch_variance_hz: float = 22.0
    speech_rate_wpm: float = 105.0
    pause_length_ratio: float = 0.35
    vocal_energy_db: float = -24.0

