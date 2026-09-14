from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional

class TelemetryCreate(BaseModel):
    log_date: Optional[date] = None
    location_entropy: float = 0.85
    radius_of_gyration_km: float = 4.5
    time_spent_home_ratio: float = 0.60
    total_screen_time_hours: float = 5.0
    late_night_screen_hours: float = 1.0
    app_switching_frequency: float = 15.0
    sleep_duration_hours: float = 7.5
    sleep_midpoint_hour: float = 4.0
    sleep_quality_score: float = 80.0
    step_count: int = 5000
    outgoing_call_count: int = 2
    incoming_call_count: int = 3
    sms_or_message_count: int = 18
    distinct_contacts_interacted: int = 4

class TelemetryResponse(TelemetryCreate):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class TelemetryDifferential(BaseModel):
    metric_name: str
    current_avg: float
    previous_avg: float
    percentage_change: float
    plain_description: str
    risk_direction: str  # "worsening", "improving", "stable"

