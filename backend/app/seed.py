"""
Rich Longitudinal Seed Data Generator for Kizuna Platform.
Generates 30 days of realistic behavioral sensor streams, EMA entries,
interpretable risk evaluations, CRAFT prompts, and support resources.
"""

import json
from datetime import date, datetime, timedelta
import numpy as np
from sqlalchemy.orm import Session

from backend.app.database import SessionLocal, Base, engine
from backend.app.models.user import User
from backend.app.models.telemetry import TelemetryDaily
from backend.app.models.ema import EMACheckin
from backend.app.models.risk import RiskAssessment
from backend.app.models.nudge import BehavioralNudge
from backend.app.models.consent import ConsentSetting
from backend.app.models.prosody import VoiceProsody
from backend.app.models.support import SupportResource
from backend.app.api.auth import get_password_hash
from backend.app.ml.model import withdrawal_model
from backend.app.ml.shap_explainer import shap_explainer

def seed_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    print("Seeding Kizuna database...")

    # 1. Users
    ren = User(
        username="ren_sato",
        email="ren.sato@kizuna.health",
        hashed_password=get_password_hash("kizuna2026"),
        full_name="Ren Sato",
        role="youth",
        age=19,
        is_minor=False,
        population_type="youth_hikikomori",
        avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    )
    db.add(ren)
    db.commit()
    db.refresh(ren)

    keiko = User(
        username="keiko_sato",
        email="keiko.sato@kizuna.health",
        hashed_password=get_password_hash("kizuna2026"),
        full_name="Keiko Sato",
        role="caregiver",
        age=48,
        is_minor=False,
        population_type="youth_hikikomori",
        linked_user_id=ren.id,
        avatar_url="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
    )
    db.add(keiko)

    dr_takahashi = User(
        username="dr_takahashi",
        email="takahashi@kizuna.health",
        hashed_password=get_password_hash("kizuna2026"),
        full_name="Dr. Kenji Takahashi",
        role="clinician",
        age=52,
        is_minor=False,
        population_type="youth_hikikomori",
        avatar_url="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80"
    )
    db.add(dr_takahashi)

    mrs_tanaka = User(
        username="mrs_tanaka",
        email="tanaka.chiyo@kizuna.health",
        hashed_password=get_password_hash("kizuna2026"),
        full_name="Chiyo Tanaka",
        role="youth",  # Target individual
        age=74,
        is_minor=False,
        population_type="elderly_isolation",
        avatar_url="https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=150&auto=format&fit=crop&q=80"
    )
    db.add(mrs_tanaka)
    db.commit()

    # Link Ren to Keiko
    ren.linked_user_id = keiko.id
    db.commit()

    # 2. Consent Settings for Ren
    ren_consent = ConsentSetting(
        youth_id=ren.id,
        caregiver_id=keiko.id,
        share_risk_level=True,
        share_plain_language_summary=True,
        share_subscores=False,  # Protected
        share_exact_screen_time=False,  # Protected
        share_location_entropy=False,  # Protected
        share_sleep_timing=False,  # Protected
        share_social_counts=False,  # Protected
        share_voice_prosody=False,  # Protected
        share_nudge_completions=True,
        allow_caregiver_nudge_invites=True
    )
    db.add(ren_consent)
    db.commit()

    # 3. Longitudinal 30-day Telemetry for Ren Sato (Demonstrates Emerging Hikikomori trajectory)
    # Days 30 to 18: Normal baseline
    # Days 17 to 8: Emerging withdrawal (mobility drops, night screen increases, day/night shift)
    # Days 7 to 0: Current state (recovering slightly after micro-nudges)
    today = date.today()

    for d in range(30, -1, -1):
        cur_date = today - timedelta(days=d)
        
        if d > 18:  # Baseline
            entropy = float(np.random.normal(0.82, 0.05))
            radius = float(np.random.normal(5.2, 0.6))
            home_ratio = float(np.random.normal(0.55, 0.04))
            screen = float(np.random.normal(4.8, 0.5))
            late_screen = float(np.random.normal(0.6, 0.2))
            switching = float(np.random.normal(14.0, 2.0))
            sleep_mid = float(np.random.normal(4.0, 0.3))
            steps = int(np.random.normal(6800, 700))
            calls = int(np.random.normal(3, 1))
            sms = int(np.random.normal(25, 5))
            contacts = int(np.random.normal(5, 1))
        elif d > 7:  # Withdrawal escalating
            progress = (18 - d) / 11.0  # 0 to 1
            entropy = float(np.interp(progress, [0, 1], [0.80, 0.40])) + float(np.random.normal(0, 0.03))
            radius = float(np.interp(progress, [0, 1], [4.8, 1.2])) + float(np.random.normal(0, 0.2))
            home_ratio = float(np.interp(progress, [0, 1], [0.58, 0.88])) + float(np.random.normal(0, 0.02))
            screen = float(np.interp(progress, [0, 1], [5.0, 9.8])) + float(np.random.normal(0, 0.4))
            late_screen = float(np.interp(progress, [0, 1], [0.8, 3.8])) + float(np.random.normal(0, 0.2))
            switching = float(np.interp(progress, [0, 1], [15.0, 32.0])) + float(np.random.normal(0, 1.5))
            sleep_mid = float(np.interp(progress, [0, 1], [4.2, 7.8])) + float(np.random.normal(0, 0.3))
            steps = int(np.interp(progress, [0, 1], [6500, 1600]))
            calls = max(0, int(np.interp(progress, [0, 1], [3, 0])))
            sms = int(np.interp(progress, [0, 1], [22, 6]))
            contacts = max(1, int(np.interp(progress, [0, 1], [5, 1])))
        else:  # Recent days: stabilized, slight recovery with nudges
            entropy = float(np.random.normal(0.48, 0.04))
            radius = float(np.random.normal(1.8, 0.3))
            home_ratio = float(np.random.normal(0.82, 0.03))
            screen = float(np.random.normal(8.2, 0.5))
            late_screen = float(np.random.normal(2.6, 0.3))
            switching = float(np.random.normal(24.0, 2.0))
            sleep_mid = float(np.random.normal(6.5, 0.4))
            steps = int(np.random.normal(2600, 400))
            calls = 1
            sms = 10
            contacts = 2

        tel = TelemetryDaily(
            user_id=ren.id,
            log_date=cur_date,
            location_entropy=round(max(entropy, 0.05), 3),
            radius_of_gyration_km=round(max(radius, 0.1), 2),
            time_spent_home_ratio=round(min(max(home_ratio, 0.1), 1.0), 2),
            total_screen_time_hours=round(max(screen, 0.5), 1),
            late_night_screen_hours=round(max(late_screen, 0.0), 1),
            app_switching_frequency=round(max(switching, 2.0), 1),
            sleep_duration_hours=round(float(np.random.normal(6.8, 0.6)), 1),
            sleep_midpoint_hour=round(sleep_mid, 1),
            sleep_quality_score=round(float(np.random.normal(65, 8)), 1),
            step_count=steps,
            outgoing_call_count=calls,
            incoming_call_count=calls + 1,
            sms_or_message_count=sms,
            distinct_contacts_interacted=contacts
        )
        db.add(tel)

        # Periodic Risk Assessment for every 3 days
        if d % 3 == 0:
            feat_dict = {
                "location_entropy": tel.location_entropy,
                "radius_of_gyration_km": tel.radius_of_gyration_km,
                "time_spent_home_ratio": tel.time_spent_home_ratio,
                "total_screen_time_hours": tel.total_screen_time_hours,
                "late_night_screen_hours": tel.late_night_screen_hours,
                "app_switching_frequency": tel.app_switching_frequency,
                "sleep_duration_hours": tel.sleep_duration_hours,
                "sleep_midpoint_hour": tel.sleep_midpoint_hour,
                "sleep_quality_score": tel.sleep_quality_score,
                "step_count": tel.step_count,
                "outgoing_call_count": tel.outgoing_call_count,
                "sms_or_message_count": tel.sms_or_message_count,
                "distinct_contacts_interacted": tel.distinct_contacts_interacted
            }
            score, tier, subscores = withdrawal_model.predict_risk(feat_dict)
            shap_impacts, summary, drivers = shap_explainer.explain(feat_dict)
            
            risk_rec = RiskAssessment(
                user_id=ren.id,
                assessment_date=cur_date,
                overall_risk_score=score,
                risk_tier=tier,
                mobility_subscore=subscores["mobility"],
                circadian_subscore=subscores["circadian"],
                social_subscore=subscores["social"],
                digital_subscore=subscores["digital"],
                shap_attributions_json=json.dumps(shap_impacts),
                plain_language_summary=summary,
                key_drivers=json.dumps(drivers),
                recommended_action_tier="graduated_micro_nudge" if score > 35 else "self_reflection"
            )
            db.add(risk_rec)

    # 4. EMA Daily Check-ins (Recent 7 days for Ren)
    for d in range(7, -1, -1):
        c_date = today - timedelta(days=d)
        ema = EMACheckin(
            user_id=ren.id,
            checkin_date=c_date,
            checkin_time_slot="evening",
            mood_score=2 if d in [3, 4] else 3,
            had_social_contact=d in [0, 2],
            social_enjoyment_score=3,
            internet_use_nature="passive_escape" if d in [3, 4] else "mixed",
            internet_enjoyment_score=2 if d in [3, 4] else 3,
            quick_note="Felt tired in the afternoon. Sat by the window for a while." if d == 1 else "Listened to music."
        )
        db.add(ema)

    # 5. Behavioral Nudges for Ren Sato
    nudge1 = BehavioralNudge(
        user_id=ren.id,
        title="Open Window & 3-Minute Sensory Reset",
        category="sensory",
        description="Open your bedroom window for 3 minutes. Focus on feeling the cool evening air and hearing three distinct outdoor sounds.",
        rationale="Triggered by high indoor confinement. Restores sensory contact without pressure to interact.",
        graduated_difficulty=1,
        estimated_minutes=3,
        status="completed",
        user_reflection="The night breeze felt refreshing. Didn't feel overwhelming.",
        completed_at=datetime.utcnow() - timedelta(days=2)
    )
    db.add(nudge1)

    nudge2 = BehavioralNudge(
        user_id=ren.id,
        title="10-Minute Quiet Neighborhood Walk",
        category="physical",
        description="Put on comfortable shoes and walk around your residential block once at your own pace without checking your phone.",
        rationale="Graduated mobility activation: expands spatial entropy gently.",
        graduated_difficulty=2,
        estimated_minutes=10,
        status="completed",
        user_reflection="Walked to the corner mailbox and back. Felt good to stretch my legs.",
        completed_at=datetime.utcnow() - timedelta(days=1)
    )
    db.add(nudge2)

    nudge3 = BehavioralNudge(
        user_id=ren.id,
        title="Share One Photo with One Friend",
        category="social_micro",
        description="Send one low-stakes photo or link (a snack, a pet, or an anime scene) to one former classmate or friend with zero obligation for a long chat.",
        rationale="Pattern noticed: Social reach-out has dropped. Micro-touchpoints maintain fragile social bridges without exhaustion.",
        graduated_difficulty=2,
        estimated_minutes=5,
        status="pending"
    )
    db.add(nudge3)

    # 6. Voice Prosody Acoustic Logs (Zero audio content stored)
    prosody1 = VoiceProsody(
        user_id=ren.id,
        sample_date=today - timedelta(days=2),
        pitch_variance_hz=21.4,  # Monotone trend
        speech_rate_wpm=108.0,
        pause_length_ratio=0.34,
        vocal_energy_db=-23.8,
        affect_flatness_score=48.5,
        zero_content_guarantee=True,
        call_duration_seconds=145
    )
    db.add(prosody1)

    # 7. Support Resources & Centers (PDF Page 2 Warm hand-off)
    resources = [
        SupportResource(
            name="Tokyo Hikikomori Regional Support Center (Shinken)",
            organization_type="hikikomori_center",
            description="Official metropolitan specialized support center providing confidential family consultations, peer gathering spaces, and gradual societal reintegration programs.",
            phone="+81-3-3263-4336",
            email="support@shinken-tokyo.jp",
            website="https://www.fukushihoken.metro.tokyo.lg.jp",
            operating_hours="Monday - Friday 9:00 - 17:00 JST",
            location="Shinjuku, Tokyo / Online Consultations Available",
            languages="Japanese, English",
            crisis_ready="True"
        ),
        SupportResource(
            name="KHJ National Hikikomori Family Association",
            organization_type="family_support_group",
            description="Nationwide network established by families of individuals experiencing hikikomori. Offers CRAFT-aligned caregiver peer workshops, self-care guidance, and mutual support groups.",
            phone="+81-3-5839-5204",
            email="info@khj-h.com",
            website="https://www.khj-h.com",
            operating_hours="Tuesday - Saturday 10:00 - 18:00 JST",
            location="Branches across all 47 Prefectures in Japan",
            languages="Japanese",
            crisis_ready="False"
        ),
        SupportResource(
            name="TELL Japan Lifeline & Youth Text Counseling",
            organization_type="crisis_hotline",
            description="Dedicated anonymous mental health and crisis support providing both phone lifeline and low-barrier text chat services for young people experiencing severe isolation.",
            phone="+81-3-5774-0992",
            email="lifeline@telljp.com",
            website="https://telljp.com",
            operating_hours="Lifeline: Daily 9:00 - 23:00 JST; Text Chat: Fri/Sat/Sun Evenings",
            location="Nationwide & Global Online",
            languages="English, Japanese",
            crisis_ready="True"
        ),
        SupportResource(
            name="Kakehashi Youth Community Space",
            organization_type="youth_clinic",
            description="Non-judgmental 'Third Space' (Ibasho) where individuals experiencing social anxiety or withdrawal can visit without registering or speaking until they feel ready.",
            phone="+81-422-29-7031",
            email="connect@kakehashi-space.org",
            website="https://kakehashi-space.org",
            operating_hours="Wednesday - Sunday 13:00 - 19:00 JST",
            location="Kichijoji, Tokyo",
            languages="Japanese, English",
            crisis_ready="False"
        )
    ]
    for r in resources:
        db.add(r)

    # 8. Seed Elderly Person (Mrs. Tanaka) Telemetry
    for d in range(14, -1, -1):
        c_date = today - timedelta(days=d)
        tel_e = TelemetryDaily(
            user_id=mrs_tanaka.id,
            log_date=c_date,
            location_entropy=0.32 if d < 5 else 0.58,
            radius_of_gyration_km=0.8 if d < 5 else 2.2,
            time_spent_home_ratio=0.92 if d < 5 else 0.74,
            total_screen_time_hours=1.2,
            late_night_screen_hours=0.1,
            app_switching_frequency=4.0,
            sleep_duration_hours=6.5,
            sleep_midpoint_hour=2.5,
            sleep_quality_score=70.0,
            step_count=1100 if d < 5 else 3400,
            outgoing_call_count=0 if d < 5 else 2,
            incoming_call_count=1,
            sms_or_message_count=3,
            distinct_contacts_interacted=1 if d < 5 else 3
        )
        db.add(tel_e)

    db.commit()
    print("Database successfully seeded with realistic personas, telemetry, and support centers.")

if __name__ == "__main__":
    seed_database()

