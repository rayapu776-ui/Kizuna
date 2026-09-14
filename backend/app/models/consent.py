from datetime import datetime
from sqlalchemy import Column, Integer, Boolean, DateTime, ForeignKey
from backend.app.database import Base

class ConsentSetting(Base):
    __tablename__ = "consent_settings"

    id = Column(Integer, primary_key=True, index=True)
    youth_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True, index=True)
    caregiver_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    
    # Granular stream sharing flags
    share_risk_level = Column(Boolean, default=True)  # Low/Emerging/Moderate band
    share_plain_language_summary = Column(Boolean, default=True)  # High-level constructive takeaway
    share_subscores = Column(Boolean, default=False)  # Breakdown numbers
    share_exact_screen_time = Column(Boolean, default=False)  # Raw hours
    share_location_entropy = Column(Boolean, default=False)  # Raw GPS entropy
    share_sleep_timing = Column(Boolean, default=False)  # Sleep/wake hours
    share_social_counts = Column(Boolean, default=False)  # Call/text count
    share_voice_prosody = Column(Boolean, default=False)  # Prosody affect metrics
    share_nudge_completions = Column(Boolean, default=True)  # Shows positive forward steps
    
    allow_caregiver_nudge_invites = Column(Boolean, default=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

