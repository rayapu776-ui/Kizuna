"""
Elderly Isolation Population Adaptation Engine.
Implements distinct feature weightings, healthy baselines, and caregiver dynamics
as specified in PDF Page 4 ("Elderly Isolation as a Second Population").

Key Divergences from Youth Hikikomori:
1. Signal Patterns:
   - Youth: High screen time, nocturnal internet immersion, reversed circadian rhythm.
   - Elderly: Reduced digital activity, health-linked physical mobility collapse, early morning waking.
2. Caregiver Dynamics:
   - Youth: Parents with practical/relational authority (CRAFT de-escalation).
   - Elderly: Adult children, sometimes holding medical power of attorney (supportive check-in).
"""

from typing import Dict, Any, Tuple

ELDERLY_HEALTHY_BASELINE = {
    "location_entropy": 0.65,        # Older adults typically have narrower home radii
    "radius_of_gyration_km": 2.5,     # Neighborhood grocery / community center
    "time_spent_home_ratio": 0.70,
    "total_screen_time_hours": 2.0,   # Lower digital immersion is normal
    "late_night_screen_hours": 0.2,   # Rarely late-night internet
    "app_switching_frequency": 6.0,
    "sleep_duration_hours": 6.8,
    "sleep_midpoint_hour": 2.5,       # Earlier chronotype (e.g. 10 PM to 5 AM -> midpoint 1:30-2:30 AM)
    "sleep_quality_score": 75.0,
    "step_count": 4200,               # Adjusted for age-appropriate mobility
    "outgoing_call_count": 2,
    "sms_or_message_count": 8,
    "distinct_contacts_interacted": 3
}

class ElderlyIsolationModel:
    def __init__(self):
        self.baseline = ELDERLY_HEALTHY_BASELINE

    def evaluate_elderly_isolation(self, features: Dict[str, Any]) -> Tuple[float, str, Dict[str, Any], str]:
        """
        Calculates elderly isolation risk using population-specific weighting:
        Prioritizes physical mobility decay, drop in all communication, and home stagnation.
        De-emphasizes excessive screen time.
        """
        entropy = features.get("location_entropy", 0.65)
        radius = features.get("radius_of_gyration_km", 2.5)
        steps = features.get("step_count", 4200)
        home_ratio = features.get("time_spent_home_ratio", 0.70)
        calls = features.get("outgoing_call_count", 2)
        contacts = features.get("distinct_contacts_interacted", 3)
        screen = features.get("total_screen_time_hours", 2.0)
        
        # 1. Mobility Decline (Highest weighting in elderly: 45%)
        # Complete confinement to home apartment
        mob_risk = (
            (1.0 - min(entropy / 0.65, 1.0)) * 40.0 +
            (1.0 - min(radius / 2.0, 1.0)) * 30.0 +
            (1.0 - min(steps / 3500.0, 1.0)) * 30.0
        )
        
        # 2. Social Isolation / Contact Severance (35% weighting)
        # Drop in outgoing calls or zero contacts for days
        soc_risk = (
            (1.0 - min(calls / 2.0, 1.0)) * 50.0 +
            (1.0 - min(contacts / 3.0, 1.0)) * 50.0
        )
        
        # 3. Digital Silence Indicator (10% weighting)
        # In elderly, total cessation of phone usage often signals immobility or cognitive/physical distress
        dig_risk = (1.0 - min(screen / 1.5, 1.0)) * 100.0 if screen < 1.0 else 0.0

        # 4. Daily Home Confinement (10% weighting)
        confine_risk = max(0.0, (home_ratio - 0.70) / 0.30) * 100.0
        
        composite_score = (mob_risk * 0.45) + (soc_risk * 0.35) + (dig_risk * 0.10) + (confine_risk * 0.10)
        composite_score = round(min(max(composite_score, 0.0), 100.0), 1)

        if composite_score < 30.0:
            tier = "low"
            summary = "Active neighborhood routine, regular family contact, and steady step mobility."
        elif composite_score < 55.0:
            tier = "emerging"
            summary = "Neighborhood travel radius has contracted; step count down 35% with reduced outbound calls."
        elif composite_score < 75.0:
            tier = "moderate"
            summary = "Zero outdoor mobility recorded over 48 hours; phone activity reduced to passive incoming only."
        else:
            tier = "elevated"
            summary = "Severe isolation indicator: prolonged room confinement, zero outbound communication, and acute physical inactivity."

        breakdown = {
            "mobility_decline_points": round(mob_risk * 0.45, 1),
            "social_silence_points": round(soc_risk * 0.35, 1),
            "digital_cessation_points": round(dig_risk * 0.10, 1),
            "home_confinement_points": round(confine_risk * 0.10, 1)
        }

        return composite_score, tier, breakdown, summary

elderly_model = ElderlyIsolationModel()

