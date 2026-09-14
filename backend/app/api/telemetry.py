from datetime import date, datetime, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc

from backend.app.database import get_db
from backend.app.models.user import User
from backend.app.models.telemetry import TelemetryDaily
from backend.app.schemas.telemetry import TelemetryCreate, TelemetryResponse, TelemetryDifferential
from backend.app.api.auth import get_current_user
from backend.app.ml.shap_explainer import shap_explainer

router = APIRouter(prefix="/api/telemetry", tags=["Passive Telemetry Signals"])

@router.post("/log", response_model=TelemetryResponse)
def log_daily_telemetry(
    data: TelemetryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Ingests a daily passive sensor summary record.
    On-device processing model: raw GPS/screen events are pre-aggregated on device;
    only privacy-preserving statistical features are received.
    """
    log_date = data.log_date or date.today()
    
    # Check if record for today already exists
    existing = db.query(TelemetryDaily).filter(
        TelemetryDaily.user_id == current_user.id,
        TelemetryDaily.log_date == log_date
    ).first()
    
    if existing:
        for field, value in data.dict(exclude_unset=True).items():
            if field != "log_date":
                setattr(existing, field, value)
        db.commit()
        db.refresh(existing)
        return existing

    record = TelemetryDaily(
        user_id=current_user.id,
        log_date=log_date,
        **data.dict(exclude={"log_date"})
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

@router.get("/history", response_model=List[TelemetryResponse])
def get_telemetry_history(
    days: int = 30,
    user_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Returns time-series telemetry data for charts and analysis.
    """
    target_user_id = user_id or current_user.id
    records = db.query(TelemetryDaily).filter(
        TelemetryDaily.user_id == target_user_id
    ).order_by(TelemetryDaily.log_date.asc()).limit(days).all()
    return records

@router.get("/differentials", response_model=List[TelemetryDifferential])
def get_longitudinal_differentials(
    user_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Calculates 14-day vs prior 14-day longitudinal shifts as cited in PDF Page 1.
    e.g., 'your mobility has dropped 40% and social contact is down over 2 weeks'.
    """
    target_user_id = user_id or current_user.id
    records = db.query(TelemetryDaily).filter(
        TelemetryDaily.user_id == target_user_id
    ).order_by(TelemetryDaily.log_date.desc()).limit(28).all()
    
    if len(records) < 7:
        return []

    # Split into current window (recent 7-14 days) and baseline window (prior 7-14 days)
    mid = len(records) // 2
    recent_cohort = records[:mid]
    prior_cohort = records[mid:]
    
    diffs = []
    metrics = [
        ("radius_of_gyration_km", "Mobility Radius", "km", True),
        ("location_entropy", "Location Variety (Entropy)", "pts", True),
        ("time_spent_home_ratio", "Time Spent Indoors", "%", False),
        ("total_screen_time_hours", "Daily Screen Time", "hrs", False),
        ("late_night_screen_hours", "Late-Night Screen (00:00-05:00)", "hrs", False),
        ("app_switching_frequency", "App-Switching Fragmentation", "switches/hr", False),
        ("sleep_midpoint_hour", "Sleep Midpoint (Phase)", ":00 AM", False),
        ("step_count", "Daily Steps", "steps", True),
        ("outgoing_call_count", "Outbound Phone Calls", "calls", True),
        ("distinct_contacts_interacted", "Social Circle Interacted", "contacts", True)
    ]
    
    for attr, name, unit, higher_is_better in metrics:
        rec_avg = sum(getattr(r, attr) for r in recent_cohort) / len(recent_cohort)
        pri_avg = sum(getattr(r, attr) for r in prior_cohort) / len(prior_cohort)
        
        pct_change = ((rec_avg - pri_avg) / pri_avg * 100.0) if pri_avg != 0 else 0.0
        abs_pct = abs(round(pct_change))
        
        if higher_is_better:
            if pct_change < -10.0:
                direction = "worsening"
                desc = f"Dropped by {abs_pct}% over the past 2 weeks ({rec_avg:.1f} vs {pri_avg:.1f} {unit})"
            elif pct_change > 10.0:
                direction = "improving"
                desc = f"Increased by {abs_pct}% ({rec_avg:.1f} vs {pri_avg:.1f} {unit})"
            else:
                direction = "stable"
                desc = f"Stable at {rec_avg:.1f} {unit}"
        else:
            if pct_change > 15.0:
                direction = "worsening"
                desc = f"Increased by {abs_pct}% over the past 2 weeks ({rec_avg:.1f} vs {pri_avg:.1f} {unit})"
            elif pct_change < -15.0:
                direction = "improving"
                desc = f"Decreased by {abs_pct}% ({rec_avg:.1f} vs {pri_avg:.1f} {unit})"
            else:
                direction = "stable"
                desc = f"Consistent at {rec_avg:.1f} {unit}"

        diffs.append(TelemetryDifferential(
            metric_name=name,
            current_avg=round(rec_avg, 2),
            previous_avg=round(pri_avg, 2),
            percentage_change=round(pct_change, 1),
            plain_description=desc,
            risk_direction=direction
        ))
        
    return diffs

