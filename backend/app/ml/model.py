"""
Interpretable Machine Learning Model for Social Withdrawal Risk (Hikikomori & Isolation).
Uses a Random Forest Classifier trained on evidence-based multidimensional behavioral signals.
Deliberately avoids black-box neural networks to maintain full clinical transparency and interpretability.
"""

import numpy as np
from sklearn.ensemble import RandomForestClassifier
from typing import Dict, Any, Tuple, List

# Feature names in exact order of model ingestion
FEATURE_NAMES = [
    "location_entropy",          # 0: lower = higher withdrawal (confined to single room/home)
    "radius_of_gyration_km",     # 1: lower = restricted mobility space
    "time_spent_home_ratio",     # 2: higher = continuous domestic confinement
    "total_screen_time_hours",   # 3: higher = high digital immersion
    "late_night_screen_hours",   # 4: higher = circadian inversion / nighttime screen use
    "app_switching_frequency",   # 5: higher = compulsive digital fragmentation
    "sleep_duration_hours",      # 6: extreme high or low indicates circadian disruption
    "sleep_midpoint_hour",       # 7: shift from 04:00 to 09:00+ indicates severe day/night inversion
    "sleep_quality_score",       # 8: lower = non-restorative sleep
    "step_count",                # 9: lower = physical inactivity
    "outgoing_call_count",       # 10: lower = active social reach-out collapse
    "sms_or_message_count",      # 11: lower = text communication decline
    "distinct_contacts_interacted" # 12: lower = shrinking social sphere
]

FEATURE_LABELS = {
    "location_entropy": "Location Entropy (Spatial Variety)",
    "radius_of_gyration_km": "Mobility Radius (km)",
    "time_spent_home_ratio": "Home Confinement Ratio",
    "total_screen_time_hours": "Total Daily Screen Time",
    "late_night_screen_hours": "Late-Night Screen Hours (00:00-05:00)",
    "app_switching_frequency": "App-Switching Fragmentation Rate",
    "sleep_duration_hours": "Sleep Duration",
    "sleep_midpoint_hour": "Sleep Midpoint (Circadian Phase)",
    "sleep_quality_score": "Sleep Quality Index",
    "step_count": "Daily Step Count",
    "outgoing_call_count": "Outbound Voice Calls",
    "sms_or_message_count": "Digital Text Interactions",
    "distinct_contacts_interacted": "Distinct Contacts Reached"
}

FEATURE_UNITS = {
    "location_entropy": "pts",
    "radius_of_gyration_km": "km",
    "time_spent_home_ratio": "%",
    "total_screen_time_hours": "hrs/day",
    "late_night_screen_hours": "hrs/night",
    "app_switching_frequency": "switches/hr",
    "sleep_duration_hours": "hrs",
    "sleep_midpoint_hour": ":00 hrs",
    "sleep_quality_score": "/100",
    "step_count": "steps",
    "outgoing_call_count": "calls",
    "sms_or_message_count": "msgs",
    "distinct_contacts_interacted": "contacts"
}

# Healthy baseline references (typical healthy young adult)
YOUTH_HEALTHY_BASELINE = {
    "location_entropy": 0.85,
    "radius_of_gyration_km": 5.2,
    "time_spent_home_ratio": 0.55,
    "total_screen_time_hours": 4.8,
    "late_night_screen_hours": 0.8,
    "app_switching_frequency": 14.0,
    "sleep_duration_hours": 7.5,
    "sleep_midpoint_hour": 4.0,
    "sleep_quality_score": 82.0,
    "step_count": 6800,
    "outgoing_call_count": 3,
    "sms_or_message_count": 25,
    "distinct_contacts_interacted": 5
}

class WithdrawalRiskModel:
    def __init__(self):
        self.feature_names = FEATURE_NAMES
        self.model = RandomForestClassifier(
            n_estimators=100,
            max_depth=5,
            min_samples_split=4,
            random_state=42
        )
        self._train_interpretable_ensemble()

    def _train_interpretable_ensemble(self):
        """
        Synthesizes a clinically grounded training cohort reflecting the literature on
        hikikomori behavioral sensing (e.g., Tateno et al., Kato et al., Teo et al.).
        """
        np.random.seed(42)
        n_samples = 1200
        
        # 0: Low Risk (Connected, active routine)
        # 1: Emerging Risk (Early warning, slipping routine, increasing screen time)
        # 2: Moderate Risk (Significant home confinement, day/night inversion)
        # 3: Elevated Risk (Acute hikikomori, severe withdrawal, minimal contacts)
        
        X = []
        y = []
        
        for _ in range(n_samples):
            tier = np.random.choice([0, 1, 2, 3], p=[0.40, 0.25, 0.20, 0.15])
            if tier == 0:  # Healthy
                entropy = np.clip(np.random.normal(0.85, 0.10), 0.65, 1.2)
                radius = np.clip(np.random.normal(5.5, 1.5), 2.5, 15.0)
                home_ratio = np.clip(np.random.normal(0.55, 0.08), 0.35, 0.70)
                screen = np.clip(np.random.normal(4.5, 1.0), 2.0, 7.0)
                late_screen = np.clip(np.random.normal(0.6, 0.4), 0.0, 1.5)
                switching = np.clip(np.random.normal(12.0, 3.0), 5.0, 20.0)
                sleep_dur = np.clip(np.random.normal(7.8, 0.8), 6.5, 9.5)
                sleep_mid = np.clip(np.random.normal(4.0, 0.6), 3.0, 5.0)
                sleep_qual = np.clip(np.random.normal(82.0, 6.0), 70.0, 98.0)
                steps = int(np.clip(np.random.normal(7000, 1500), 4000, 14000))
                out_calls = int(np.clip(np.random.normal(3.5, 1.2), 1, 8))
                sms = int(np.clip(np.random.normal(30, 10), 10, 70))
                contacts = int(np.clip(np.random.normal(6, 2), 3, 15))
            elif tier == 1:  # Emerging
                entropy = np.clip(np.random.normal(0.62, 0.08), 0.45, 0.75)
                radius = np.clip(np.random.normal(2.8, 0.8), 1.2, 4.0)
                home_ratio = np.clip(np.random.normal(0.72, 0.06), 0.60, 0.82)
                screen = np.clip(np.random.normal(7.0, 1.2), 5.0, 9.5)
                late_screen = np.clip(np.random.normal(2.2, 0.6), 1.2, 3.5)
                switching = np.clip(np.random.normal(22.0, 4.0), 14.0, 30.0)
                sleep_dur = np.clip(np.random.normal(6.8, 1.0), 5.0, 8.5)
                sleep_mid = np.clip(np.random.normal(5.8, 0.8), 4.8, 7.0)
                sleep_qual = np.clip(np.random.normal(68.0, 7.0), 50.0, 80.0)
                steps = int(np.clip(np.random.normal(3500, 800), 2000, 5500))
                out_calls = int(np.clip(np.random.normal(1.2, 0.7), 0, 3))
                sms = int(np.clip(np.random.normal(14, 5), 5, 25))
                contacts = int(np.clip(np.random.normal(2.8, 1.0), 1, 5))
            elif tier == 2:  # Moderate
                entropy = np.clip(np.random.normal(0.38, 0.07), 0.20, 0.50)
                radius = np.clip(np.random.normal(1.2, 0.5), 0.4, 2.0)
                home_ratio = np.clip(np.random.normal(0.86, 0.05), 0.75, 0.94)
                screen = np.clip(np.random.normal(9.8, 1.4), 7.5, 13.0)
                late_screen = np.clip(np.random.normal(4.0, 0.8), 2.5, 5.5)
                switching = np.clip(np.random.normal(32.0, 5.0), 22.0, 45.0)
                sleep_dur = np.clip(np.random.normal(6.0, 1.4), 4.0, 9.0)
                sleep_mid = np.clip(np.random.normal(7.8, 1.0), 6.5, 9.5)
                sleep_qual = np.clip(np.random.normal(52.0, 8.0), 35.0, 68.0)
                steps = int(np.clip(np.random.normal(1600, 500), 800, 2800))
                out_calls = int(np.clip(np.random.normal(0.4, 0.5), 0, 1))
                sms = int(np.clip(np.random.normal(6, 3), 1, 12))
                contacts = int(np.clip(np.random.normal(1.4, 0.6), 1, 3))
            else:  # Elevated
                entropy = np.clip(np.random.normal(0.15, 0.06), 0.02, 0.28)
                radius = np.clip(np.random.normal(0.3, 0.2), 0.05, 0.8)
                home_ratio = np.clip(np.random.normal(0.96, 0.03), 0.90, 1.0)
                screen = np.clip(np.random.normal(12.5, 1.8), 9.0, 16.0)
                late_screen = np.clip(np.random.normal(5.8, 1.0), 4.0, 7.5)
                switching = np.clip(np.random.normal(42.0, 6.0), 30.0, 60.0)
                sleep_dur = np.clip(np.random.normal(5.2, 1.5), 3.5, 8.0)
                sleep_mid = np.clip(np.random.normal(9.6, 1.2), 8.0, 12.0)
                sleep_qual = np.clip(np.random.normal(38.0, 8.0), 20.0, 55.0)
                steps = int(np.clip(np.random.normal(650, 250), 150, 1200))
                out_calls = 0
                sms = int(np.clip(np.random.normal(2, 1.5), 0, 5))
                contacts = int(np.clip(np.random.normal(0.6, 0.5), 0, 1))
            
            row = [
                entropy, radius, home_ratio, screen, late_screen, switching,
                sleep_dur, sleep_mid, sleep_qual, steps, out_calls, sms, contacts
            ]
            X.append(row)
            y.append(tier)
            
        self.model.fit(X, y)

    def predict_risk(self, feature_dict: Dict[str, Any]) -> Tuple[float, str, Dict[str, float]]:
        """
        Runs interpretable inference and calculates domain subscores.
        Returns:
            overall_score: 0.0 to 100.0
            tier: "low" | "emerging" | "moderate" | "elevated"
            subscores: {"mobility": ..., "circadian": ..., "social": ..., "digital": ...}
        """
        features_vector = [float(feature_dict.get(fname, YOUTH_HEALTHY_BASELINE[fname])) for fname in self.feature_names]
        probabilities = self.model.predict_proba([features_vector])[0]
        
        # Weighted expectation of risk tier (0 = 10, 1 = 38, 2 = 68, 3 = 92)
        tier_weights = np.array([10.0, 38.0, 68.0, 92.0])
        overall_score = float(np.dot(probabilities, tier_weights))
        overall_score = float(np.clip(overall_score, 0.0, 100.0))
        
        if overall_score < 28.0:
            tier = "low"
        elif overall_score < 55.0:
            tier = "emerging"
        elif overall_score < 78.0:
            tier = "moderate"
        else:
            tier = "elevated"
            
        # Domain subscores (0-100 scale)
        # 1. Mobility Subscore
        ent = feature_dict.get("location_entropy", 0.85)
        rad = feature_dict.get("radius_of_gyration_km", 4.5)
        home = feature_dict.get("time_spent_home_ratio", 0.6)
        mob_risk = (
            (1.0 - min(ent / 0.85, 1.0)) * 40.0 +
            (1.0 - min(rad / 4.5, 1.0)) * 30.0 +
            max(0.0, (home - 0.50) / 0.50) * 30.0
        )
        mobility_subscore = float(np.clip(mob_risk, 0.0, 100.0))

        # 2. Circadian Subscore
        smid = feature_dict.get("sleep_midpoint_hour", 4.0)
        squal = feature_dict.get("sleep_quality_score", 80.0)
        steps = feature_dict.get("step_count", 5000)
        circ_risk = (
            max(0.0, min((smid - 4.0) / 6.0, 1.0)) * 50.0 +
            (1.0 - min(squal / 85.0, 1.0)) * 30.0 +
            (1.0 - min(steps / 6000.0, 1.0)) * 20.0
        )
        circadian_subscore = float(np.clip(circ_risk, 0.0, 100.0))

        # 3. Social Subscore
        calls = feature_dict.get("outgoing_call_count", 2)
        sms = feature_dict.get("sms_or_message_count", 20)
        contacts = feature_dict.get("distinct_contacts_interacted", 4)
        soc_risk = (
            (1.0 - min(calls / 3.0, 1.0)) * 40.0 +
            (1.0 - min(sms / 25.0, 1.0)) * 30.0 +
            (1.0 - min(contacts / 4.0, 1.0)) * 30.0
        )
        social_subscore = float(np.clip(soc_risk, 0.0, 100.0))

        # 4. Digital Subscore
        screen = feature_dict.get("total_screen_time_hours", 5.0)
        late = feature_dict.get("late_night_screen_hours", 1.0)
        switches = feature_dict.get("app_switching_frequency", 15.0)
        dig_risk = (
            max(0.0, min((screen - 4.5) / 8.0, 1.0)) * 40.0 +
            max(0.0, min(late / 5.0, 1.0)) * 35.0 +
            max(0.0, min((switches - 15.0) / 30.0, 1.0)) * 25.0
        )
        digital_subscore = float(np.clip(dig_risk, 0.0, 100.0))

        subscores = {
            "mobility": round(mobility_subscore, 1),
            "circadian": round(circadian_subscore, 1),
            "social": round(social_subscore, 1),
            "digital": round(digital_subscore, 1)
        }

        return round(overall_score, 1), tier, subscores

# Global singleton
withdrawal_model = WithdrawalRiskModel()

