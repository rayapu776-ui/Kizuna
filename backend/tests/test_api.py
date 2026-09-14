import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"

def test_auth_switch_role():
    res = client.get("/api/auth/switch-demo-role/caregiver")
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["user"]["role"] == "caregiver"

def test_telemetry_differentials():
    res = client.get("/api/telemetry/differentials")
    assert res.status_code == 200
    diffs = res.json()
    assert isinstance(diffs, list)
    assert len(diffs) > 0

def test_risk_latest():
    res = client.get("/api/risk/latest")
    assert res.status_code == 200
    data = res.json()
    assert "overall_risk_score" in data
    assert "shap_breakdown" in data
    assert "plain_language_summary" in data

def test_risk_simulate_youth():
    payload = {
        "location_entropy": 0.35,
        "radius_of_gyration_km": 0.9,
        "time_spent_home_ratio": 0.92,
        "total_screen_time_hours": 12.0,
        "late_night_screen_hours": 5.0,
        "app_switching_frequency": 35.0,
        "sleep_duration_hours": 6.0,
        "sleep_midpoint_hour": 8.0,
        "sleep_quality_score": 45.0,
        "step_count": 900,
        "outgoing_call_count": 0,
        "incoming_call_count": 1,
        "sms_or_message_count": 2,
        "distinct_contacts_interacted": 1,
        "population_type": "youth_hikikomori"
    }
    res = client.post("/api/risk/simulate", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["overall_risk_score"] > 50.0
    assert "shap_breakdown" in data
    assert "plain_language_summary" in data

def test_risk_simulate_elderly():
    payload = {
        "location_entropy": 0.20,
        "radius_of_gyration_km": 0.5,
        "time_spent_home_ratio": 0.95,
        "total_screen_time_hours": 1.0,
        "late_night_screen_hours": 0.0,
        "app_switching_frequency": 2.0,
        "sleep_duration_hours": 6.0,
        "sleep_midpoint_hour": 2.0,
        "sleep_quality_score": 60.0,
        "step_count": 600,
        "outgoing_call_count": 0,
        "incoming_call_count": 1,
        "sms_or_message_count": 1,
        "distinct_contacts_interacted": 0,
        "population_type": "elderly_isolation"
    }
    res = client.post("/api/risk/simulate", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["population"] == "elderly_isolation"
    assert "elderly_breakdown" in data

def test_caregiver_dashboard_view():
    res = client.get("/api/caregiver/dashboard-view")
    assert res.status_code == 200
    data = res.json()
    assert "craft_protocol" in data
    assert "dialogue_coaching" in data["craft_protocol"]
    assert "consented_status" in data

def test_consent_caregiver_preview():
    res = client.get("/api/consent/caregiver-preview")
    assert res.status_code == 200
    data = res.json()
    assert "trust_index_message" in data
    assert "redacted_streams" in data

def test_prosody_latest():
    res = client.get("/api/prosody/latest")
    assert res.status_code == 200
    data = res.json()
    assert data["zero_content_guarantee"] is True
    assert "affect_flatness_score" in data

def test_support_resources_and_warm_handoff():
    res = client.get("/api/resources/")
    assert res.status_code == 200
    resources = res.json()
    assert len(resources) > 0
    
    # Test creating warm handoff
    first_id = resources[0]["id"]
    handoff_res = client.post("/api/resources/warm-handoff", json={
        "resource_id": first_id,
        "user_id": 1,
        "notes_from_user_or_caregiver": "Needs gradual approach"
    })
    assert handoff_res.status_code == 200
    handoff_data = handoff_res.json()
    assert "KIZUNA CONFIDENTIAL CLINICAL WARM HAND-OFF BRIEF" in handoff_data["generated_summary"]

