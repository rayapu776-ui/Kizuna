from datetime import datetime, date
from sqlalchemy import Column, Integer, Float, String, Date, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from backend.app.database import Base

class RiskAssessment(Base):
    __tablename__ = "risk_assessments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    assessment_date = Column(Date, nullable=False, index=True)
    
    # Composite Interpretable Risk
    overall_risk_score = Column(Float, nullable=False)  # 0.0 to 100.0
    risk_tier = Column(String, default="low")  # "low", "emerging", "moderate", "elevated"
    
    # Subscores
    mobility_subscore = Column(Float, default=20.0)  # 0-100 risk contribution
    circadian_subscore = Column(Float, default=20.0)
    social_subscore = Column(Float, default=20.0)
    digital_subscore = Column(Float, default=20.0)

    # Interpretable SHAP & Plain Language (PDF Layer 2)
    shap_attributions_json = Column(Text, nullable=True)  # JSON string of feature weights/deltas
    plain_language_summary = Column(Text, nullable=False)  # e.g., "Mobility dropped 40% and social contact down over 2 weeks"
    key_drivers = Column(Text, nullable=True)  # JSON array of bullet points
    
    recommended_action_tier = Column(String, default="self_reflection")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="risk_assessments")

