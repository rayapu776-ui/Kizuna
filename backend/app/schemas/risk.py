from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional, List, Dict, Any

class SHAPFeatureImpact(BaseModel):
    feature_name: str
    display_name: str
    feature_value: float
    unit: str
    impact_points: float  # e.g., +14.2 or -8.5
    direction: str  # "increases_risk" or "protects_against_risk"
    plain_explanation: str  # e.g., "Mobility radius dropped 42% over 14 days"

class RiskAssessmentResponse(BaseModel):
    id: int
    user_id: int
    assessment_date: date
    overall_risk_score: float  # 0 to 100
    risk_tier: str  # "low", "emerging", "moderate", "elevated"
    mobility_subscore: float
    circadian_subscore: float
    social_subscore: float
    digital_subscore: float
    plain_language_summary: str
    key_drivers: List[str]
    shap_breakdown: List[SHAPFeatureImpact]
    recommended_action_tier: str
    created_at: datetime

    class Config:
        from_attributes = True

class RiskSimulateRequest(BaseModel):
    location_entropy: float = 0.50
    radius_of_gyration_km: float = 1.2
    time_spent_home_ratio: float = 0.88
    total_screen_time_hours: float = 9.5
    late_night_screen_hours: float = 3.8
    app_switching_frequency: float = 28.0
    sleep_duration_hours: float = 6.2
    sleep_midpoint_hour: float = 7.5
    sleep_quality_score: float = 55.0
    step_count: int = 1200
    outgoing_call_count: int = 0
    incoming_call_count: int = 1
    sms_or_message_count: int = 4
    distinct_contacts_interacted: int = 1
    population_type: str = "youth_hikikomori"  # or "elderly_isolation"

