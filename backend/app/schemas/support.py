from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class SupportResourceResponse(BaseModel):
    id: int
    name: str
    organization_type: str
    description: str
    phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None
    operating_hours: str
    location: str
    languages: str
    crisis_ready: str

    class Config:
        from_attributes = True

class WarmHandoffCreate(BaseModel):
    resource_id: int
    user_id: int
    include_recent_risk_tier: bool = True
    include_shap_mobility_trend: bool = True
    notes_from_user_or_caregiver: Optional[str] = None

class WarmHandoffResponse(BaseModel):
    id: int
    user_id: int
    resource_id: int
    resource_name: str
    handoff_type: str
    generated_summary: str
    status: str
    created_at: datetime

