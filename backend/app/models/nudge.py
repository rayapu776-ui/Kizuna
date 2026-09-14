from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.database import Base

class BehavioralNudge(Base):
    __tablename__ = "behavioral_nudges"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    title = Column(String, nullable=False)
    category = Column(String, default="physical")  # "physical", "social_micro", "sensory", "hobby"
    description = Column(Text, nullable=False)  # Grounded non-virtual action
    rationale = Column(String, nullable=False)  # e.g., "Triggered by low mood + high internet use 2 days running"
    graduated_difficulty = Column(Integer, default=1)  # 1 (tiny: open window) to 3 (message friend)
    estimated_minutes = Column(Integer, default=10)
    
    status = Column(String, default="pending")  # "pending", "completed", "skipped"
    user_reflection = Column(Text, nullable=True)  # How did it feel?
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="nudges")

