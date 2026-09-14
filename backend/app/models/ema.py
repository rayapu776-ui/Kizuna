from datetime import datetime, date
from sqlalchemy import Column, Integer, Float, Boolean, String, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.database import Base

class EMACheckin(Base):
    __tablename__ = "ema_checkins"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    checkin_date = Column(Date, nullable=False, index=True)
    checkin_time_slot = Column(String, default="evening")  # "morning" or "evening"

    # Actionable daily levers (PDF Layer 3)
    mood_score = Column(Integer, default=3)  # 1 (very low) to 5 (great)
    had_social_contact = Column(Boolean, default=True)  # "Did you have social contact today?"
    social_enjoyment_score = Column(Integer, default=3)  # 1 (draining) to 5 (energizing)
    internet_use_nature = Column(String, default="mixed")  # "creative_hobby", "passive_escape", "connecting", "avoidance"
    internet_enjoyment_score = Column(Integer, default=3)  # 1 to 5
    quick_note = Column(String, nullable=True)  # optional grounded self-reflection

    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="ema_checkins")

