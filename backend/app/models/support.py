from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from backend.app.database import Base

class SupportResource(Base):
    __tablename__ = "support_resources"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    organization_type = Column(String, default="hikikomori_center")  # "hikikomori_center", "crisis_hotline", "family_support_group", "youth_clinic"
    description = Column(Text, nullable=False)
    phone = Column(String, nullable=True)
    email = Column(String, nullable=True)
    website = Column(String, nullable=True)
    operating_hours = Column(String, default="24/7 or Weekdays 9-18")
    location = Column(String, default="Tokyo / International Online")
    languages = Column(String, default="Japanese, English")
    crisis_ready = Column(String, default="True")

class ReferralHandoff(Base):
    __tablename__ = "referral_handoffs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    resource_id = Column(Integer, ForeignKey("support_resources.id"), nullable=False)
    handoff_type = Column(String, default="warm_intake_letter")
    generated_summary = Column(Text, nullable=False)  # Clinically safe, non-stigmatizing summary note
    status = Column(String, default="ready_for_dispatch")
    created_at = Column(DateTime, default=datetime.utcnow)

