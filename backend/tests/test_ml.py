import pytest
from backend.app.ml.model import withdrawal_model, YOUTH_HEALTHY_BASELINE
from backend.app.ml.shap_explainer import shap_explainer
from backend.app.ml.prosody_analyzer import prosody_analyzer
from backend.app.ml.elderly_mode import elderly_model

def test_healthy_baseline_risk_score():
    score, tier, subscores = withdrawal_model.predict_risk(YOUTH_HEALTHY_BASELINE)
    assert score < 30.0
    assert tier == "low"
    assert subscores["mobility"] < 35.0
    assert subscores["circadian"] < 35.0

def test_emerging_hikikomori_risk_and_shap():
    emerging_profile = YOUTH_HEALTHY_BASELINE.copy()
    emerging_profile["location_entropy"] = 0.35  # Confined to room
    emerging_profile["radius_of_gyration_km"] = 1.1  # Down from 5.2 km
    emerging_profile["time_spent_home_ratio"] = 0.90
    emerging_profile["total_screen_time_hours"] = 11.0
    emerging_profile["late_night_screen_hours"] = 4.5
    emerging_profile["sleep_midpoint_hour"] = 8.5  # Circadian inversion
    emerging_profile["outgoing_call_count"] = 0
    emerging_profile["distinct_contacts_interacted"] = 1

    score, tier, subscores = withdrawal_model.predict_risk(emerging_profile)
    assert score > 50.0
    assert tier in ["moderate", "elevated"]
    
    # Test SHAP explanation
    shap_impacts, plain_summary, drivers = shap_explainer.explain(emerging_profile)
    assert len(shap_impacts) == len(withdrawal_model.feature_names)
    assert len(drivers) > 0
    # Must contain plain-language statement explaining mobility or sleep
    assert any("Mobility" in d or "screen" in d.lower() or "Circadian" in d for d in drivers)

def test_prosody_zero_content_verification():
    res = prosody_analyzer.analyze_acoustic_metadata(
        pitch_variance_hz=16.5,
        speech_rate_wpm=92.0,
        pause_length_ratio=0.42,
        vocal_energy_db=-27.0
    )
    assert res["zero_content_guarantee"] is True
    assert res["transcription_performed"] is False
    assert res["affect_flatness_score"] > 50.0

def test_elderly_isolation_model_adaptation():
    elderly_features = {
        "location_entropy": 0.20,
        "radius_of_gyration_km": 0.4,
        "step_count": 800,
        "time_spent_home_ratio": 0.98,
        "outgoing_call_count": 0,
        "distinct_contacts_interacted": 0,
        "total_screen_time_hours": 0.2
    }
    score, tier, breakdown, summary = elderly_model.evaluate_elderly_isolation(elderly_features)
    assert score > 60.0
    assert tier in ["moderate", "elevated"]
    assert "mobility_decline_points" in breakdown

