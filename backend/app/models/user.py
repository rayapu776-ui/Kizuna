from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, default="youth")  # "youth", "caregiver", "clinician"
    age = Column(Integer, default=19)
    is_minor = Column(Boolean, default=False)
    population_type = Column(String, default="youth_hikikomori")  # "youth_hikikomori" or "elderly_isolation"
    avatar_url = Column(String, nullable=True)
    linked_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # caregiver linked to youth
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    telemetry_logs = relationship("TelemetryDaily", back_populates="user", cascade="all, delete-orphan")
    ema_checkins = relationship("EMACheckin", back_populates="user", cascade="all, delete-orphan")
    risk_assessments = relationship("RiskAssessment", back_populates="user", cascade="all, delete-orphan")
    nudges = relationship("BehavioralNudge", back_populates="user", cascade="all, delete-orphan")
    prosody_logs = relationship("VoiceProsody", back_populates="user", cascade="all, delete-orphan")

