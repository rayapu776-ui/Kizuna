from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ConsentSettingBase(BaseModel):
    share_risk_level: bool = True
    share_plain_language_summary: bool = True
    share_subscores: bool = False
    share_exact_screen_time: bool = False
    share_location_entropy: bool = False
    share_sleep_timing: bool = False
    share_social_counts: bool = False
    share_voice_prosody: bool = False
    share_nudge_completions: bool = True
    allow_caregiver_nudge_invites: bool = True

class ConsentSettingUpdate(ConsentSettingBase):
    pass

class ConsentSettingResponse(ConsentSettingBase):
    id: int
    youth_id: int
    caregiver_id: Optional[int] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class WhatCaregiverSeesPreview(BaseModel):
    youth_name: str
    risk_level_visible: Optional[str] = None
    plain_summary_visible: Optional[str] = None
    subscores_visible: Optional[dict] = None
    screen_time_visible: Optional[float] = None
    mobility_entropy_visible: Optional[float] = None
    sleep_timing_visible: Optional[str] = None
    social_counts_visible: Optional[dict] = None
    prosody_visible: Optional[dict] = None
    nudges_completed_count: Optional[int] = None
    redacted_streams: List[str]
    trust_index_message: str

