from datetime import date, datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models.user import User
from backend.app.models.prosody import VoiceProsody
from backend.app.schemas.prosody import ProsodyResponse, ProsodySimulateRequest
from backend.app.api.auth import get_current_user
from backend.app.ml.prosody_analyzer import prosody_analyzer

router = APIRouter(prefix="/api/prosody", tags=["Paralinguistic Voice Affect"])

@router.get("/latest", response_model=ProsodyResponse)
def get_latest_prosody(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieves the most recent acoustic prosody analysis.
    Guaranteed zero audio transcription or content storage.
    """
    record = db.query(VoiceProsody).filter(
        VoiceProsody.user_id == current_user.id
    ).order_by(VoiceProsody.sample_date.desc()).first()
    
    if not record:
        # Create a baseline record
        analysis = prosody_analyzer.analyze_acoustic_metadata(
            pitch_variance_hz=28.5,
            speech_rate_wpm=118.0,
            pause_length_ratio=0.25,
            vocal_energy_db=-21.0
        )
        record = VoiceProsody(
            user_id=current_user.id,
            sample_date=date.today(),
            pitch_variance_hz=analysis["pitch_variance_hz"],
            speech_rate_wpm=analysis["speech_rate_wpm"],
            pause_length_ratio=analysis["pause_length_ratio"],
            vocal_energy_db=analysis["vocal_energy_db"],
            affect_flatness_score=analysis["affect_flatness_score"],
            zero_content_guarantee=True,
            call_duration_seconds=180
        )
        db.add(record)
        db.commit()
        db.refresh(record)

    analysis = prosody_analyzer.analyze_acoustic_metadata(
        pitch_variance_hz=record.pitch_variance_hz,
        speech_rate_wpm=record.speech_rate_wpm,
        pause_length_ratio=record.pause_length_ratio,
        vocal_energy_db=record.vocal_energy_db
    )

    return ProsodyResponse(
        id=record.id,
        user_id=record.user_id,
        sample_date=record.sample_date,
        pitch_variance_hz=record.pitch_variance_hz,
        speech_rate_wpm=record.speech_rate_wpm,
        pause_length_ratio=record.pause_length_ratio,
        vocal_energy_db=record.vocal_energy_db,
        affect_flatness_score=record.affect_flatness_score,
        zero_content_guarantee=record.zero_content_guarantee,
        call_duration_seconds=record.call_duration_seconds,
        prosody_interpretation=analysis["prosody_interpretation"],
        created_at=record.created_at
    )

@router.post("/simulate")
def simulate_prosody_extraction(req: ProsodySimulateRequest):
    """
    Interactive Prosody Studio: Evaluates acoustic prosody features in real time.
    Shows clinical affect categorization and verifies zero spoken content retention.
    """
    analysis = prosody_analyzer.analyze_acoustic_metadata(
        pitch_variance_hz=req.pitch_variance_hz,
        speech_rate_wpm=req.speech_rate_wpm,
        pause_length_ratio=req.pause_length_ratio,
        vocal_energy_db=req.vocal_energy_db
    )
    return analysis

