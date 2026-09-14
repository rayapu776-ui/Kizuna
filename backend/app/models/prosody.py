from datetime import datetime, date
from sqlalchemy import Column, Integer, Float, Boolean, String, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.database import Base

class VoiceProsody(Base):
    __tablename__ = "voice_prosody"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    sample_date = Column(Date, nullable=False, index=True)
    
    # Paralinguistic Acoustic Features ONLY (PDF Page 3)
    pitch_variance_hz = Column(Float, default=32.4)  # Monotone speech = lower variance (< 20 Hz indicates flat affect)
    speech_rate_wpm = Column(Float, default=125.0)  # Slowed speech rate / psychomotor retardation indicator
    pause_length_ratio = Column(Float, default=0.22)  # Proportion of silence during utterances (> 0.40 indicates hesitation/withdrawal)
    vocal_energy_db = Column(Float, default=-18.5)  # Energy/loudness decay
    affect_flatness_score = Column(Float, default=24.0)  # 0 to 100 flatness scale
    
    # Cryptographic & Privacy Verification
    zero_content_guarantee = Column(Boolean, default=True)  # Strictly True: no transcription or audio stored
    transcription_attempted = Column(Boolean, default=False)  # Strictly False
    call_duration_seconds = Column(Integer, default=180)
    
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="prosody_logs")

