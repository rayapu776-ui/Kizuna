from datetime import datetime, date
from sqlalchemy import Column, Integer, Float, Date, DateTime, ForeignKey, String
from sqlalchemy.orm import relationship
from backend.app.database import Base

class TelemetryDaily(Base):
    __tablename__ = "telemetry_daily"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    log_date = Column(Date, nullable=False, index=True)
    
    # 1. Mobility & GPS features
    location_entropy = Column(Float, default=0.85)  # Shannon entropy of visited clusters (0 = isolated at home, 1+ = distributed)
    radius_of_gyration_km = Column(Float, default=4.5)  # Spatial radius covered
    time_spent_home_ratio = Column(Float, default=0.6)  # 0.0 to 1.0
    
    # 2. Digital behavior & screen dynamics
    total_screen_time_hours = Column(Float, default=5.0)
    late_night_screen_hours = Column(Float, default=1.0)  # Screen time between 00:00 - 05:00
    app_switching_frequency = Column(Float, default=15.0)  # Switches per active hour (fragmentation indicator)
    
    # 3. Circadian rhythm & sleep (wearable or phone inference)
    sleep_duration_hours = Column(Float, default=7.5)
    sleep_midpoint_hour = Column(Float, default=4.0)  # e.g., 04:00 AM midpoint indicates normal cycle; 09:00 indicates day/night inversion
    sleep_quality_score = Column(Float, default=80.0)  # 0 to 100
    step_count = Column(Integer, default=5000)
    
    # 4. Social contact metrics (passive counts, never content)
    outgoing_call_count = Column(Integer, default=2)
    incoming_call_count = Column(Integer, default=3)
    sms_or_message_count = Column(Integer, default=18)
    distinct_contacts_interacted = Column(Integer, default=4)
    
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="telemetry_logs")

