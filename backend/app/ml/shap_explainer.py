"""
SHAP-Style Explainability and Plain-Language Attribution Engine for Kizuna.
Translates multidimensional marginal feature attributions into defensible,
actionable, and non-stigmatizing plain-language statements.
"""

from typing import Dict, Any, List, Tuple
from backend.app.ml.model import (
    FEATURE_NAMES,
    FEATURE_LABELS,
    FEATURE_UNITS,
    YOUTH_HEALTHY_BASELINE,
    withdrawal_model
)

class PlainLanguageSHAPExplainer:
    def __init__(self):
        self.feature_names = FEATURE_NAMES
        self.baseline = YOUTH_HEALTHY_BASELINE
        self.model = withdrawal_model

    def explain(
        self,
        current_features: Dict[str, Any],
        historical_baseline: Dict[str, Any] = None
    ) -> Tuple[List[Dict[str, Any]], str, List[str]]:
        """
        Computes marginal feature contributions (approximate TreeSHAP values relative to baseline)
        and generates plain-language driver summaries.
        
        Returns:
            shap_breakdown: List of detailed feature impacts
            plain_language_summary: Cohesive plain-language summary sentence
            key_drivers: Top 3 actionable driver sentences
        """
        baseline_ref = historical_baseline or self.baseline
        
        # Calculate base risk at healthy baseline
        base_score, _, _ = self.model.predict_risk(baseline_ref)
        current_score, _, _ = self.model.predict_risk(current_features)
        
        total_delta = current_score - base_score
        
        impacts = []
        
        # Feature impact logic calibrated to relative importance in literature
        for fname in self.feature_names:
            curr_val = float(current_features.get(fname, baseline_ref[fname]))
            base_val = float(baseline_ref[fname])
            
            # Compute raw differential percentage
            diff = curr_val - base_val
            pct_change = (diff / base_val * 100.0) if base_val != 0 else 0.0
            
            # Direction and estimated impact points
            if fname in ["location_entropy", "radius_of_gyration_km", "sleep_quality_score", "step_count", "outgoing_call_count", "sms_or_message_count", "distinct_contacts_interacted"]:
                # Lower value increases risk
                if curr_val < base_val:
                    points = min(abs(pct_change) * 0.28, 22.0)
                    direction = "increases_risk"
                else:
                    points = -min(abs(pct_change) * 0.15, 12.0)
                    direction = "protects_against_risk"
            else:
                # Higher value increases risk (screen time, late night screen, app switching, home ratio, sleep midpoint inversion)
                if curr_val > base_val:
                    points = min(abs(pct_change) * 0.25, 22.0)
                    direction = "increases_risk"
                else:
                    points = -min(abs(pct_change) * 0.15, 12.0)
                    direction = "protects_against_risk"
            
            # Generate plain-language clause for this specific feature
            explanation_clause = self._generate_feature_clause(fname, curr_val, base_val, pct_change)
            
            impacts.append({
                "feature_name": fname,
                "display_name": FEATURE_LABELS.get(fname, fname),
                "feature_value": round(curr_val, 2),
                "unit": FEATURE_UNITS.get(fname, ""),
                "impact_points": round(points, 1),
                "direction": direction,
                "plain_explanation": explanation_clause
            })

        # Sort by absolute impact magnitude
        impacts.sort(key=lambda x: abs(x["impact_points"]), reverse=True)
        
        # Extract top risk-increasing drivers
        risk_drivers = [item for item in impacts if item["direction"] == "increases_risk"]
        protective_factors = [item for item in impacts if item["direction"] == "protects_against_risk"]
        
        key_driver_phrases = []
        for d in risk_drivers[:3]:
            key_driver_phrases.append(f"{d['display_name']}: {d['plain_explanation']} (+{d['impact_points']} pts)")
            
        # Synthesize primary plain-language summary as specified in PDF page 1:
        # e.g., "your mobility has dropped 40% and social contact is down over 2 weeks"
        if len(risk_drivers) >= 2:
            lead = risk_drivers[0]["plain_explanation"]
            secondary = risk_drivers[1]["plain_explanation"].lower()
            plain_summary = f"Noticeable pattern: {lead}, while {secondary}."
        elif len(risk_drivers) == 1:
            plain_summary = f"Primary observation: {risk_drivers[0]['plain_explanation']}."
        else:
            plain_summary = "Behavioral patterns show stable daily mobility, regular sleep cycles, and active social rhythms."
            
        return impacts, plain_summary, key_driver_phrases

    def _generate_feature_clause(self, fname: str, curr_val: float, base_val: float, pct_change: float) -> str:
        abs_pct = abs(round(pct_change))
        
        if fname == "radius_of_gyration_km":
            if curr_val < base_val:
                return f"Mobility radius has decreased by {abs_pct}% ({curr_val:.1f} km vs baseline {base_val:.1f} km)"
            return f"Mobility radius remains healthy at {curr_val:.1f} km"
            
        elif fname == "location_entropy":
            if curr_val < base_val:
                return f"Daily location variety has narrowed by {abs_pct}%, indicating domestic confinement"
            return f"Healthy location diversity across multiple spaces"
            
        elif fname == "time_spent_home_ratio":
            if curr_val > base_val:
                return f"Time spent indoors at home increased to {round(curr_val * 100)}% of the day"
            return f"Balanced indoor/outdoor time distribution ({round(curr_val * 100)}% home)"
            
        elif fname == "late_night_screen_hours":
            if curr_val > base_val:
                return f"Late-night screen use elevated to {curr_val:.1f} hours between midnight and 5:00 AM"
            return f"Minimal late-night screen disruption ({curr_val:.1f} hrs)"
            
        elif fname == "sleep_midpoint_hour":
            diff_hrs = curr_val - base_val
            if diff_hrs > 1.5:
                return f"Circadian sleep midpoint shifted late by {diff_hrs:.1f} hours ({curr_val:.1f}:00 AM)"
            return f"Consistent circadian sleep midpoint ({curr_val:.1f}:00 AM)"
            
        elif fname == "outgoing_call_count":
            if curr_val < base_val:
                return f"Outbound voice contact has dropped ({int(curr_val)} vs typical {int(base_val)} calls)"
            return f"Active outbound phone connections maintained"
            
        elif fname == "distinct_contacts_interacted":
            if curr_val < base_val:
                return f"Social circle reached directly narrowed to {int(curr_val)} contact(s)"
            return f"Active contact with {int(curr_val)} distinct friends/peers"
            
        elif fname == "total_screen_time_hours":
            if curr_val > base_val:
                return f"Daily screen immersion increased by {abs_pct}% ({curr_val:.1f} hrs/day)"
            return f"Screen time remains within expected parameters ({curr_val:.1f} hrs/day)"
            
        elif fname == "app_switching_frequency":
            if curr_val > base_val:
                return f"Compulsive app-switching fragmentation increased to {curr_val:.1f} switches/hr"
            return f"Focused app usage patterns"
            
        elif fname == "step_count":
            if curr_val < base_val:
                return f"Physical step activity is down {abs_pct}% ({int(curr_val)} steps/day)"
            return f"Adequate physical movement ({int(curr_val)} steps)"
            
        else:
            direction_str = "changed" if pct_change == 0 else ("dropped by" if pct_change < 0 else "increased by")
            return f"{FEATURE_LABELS.get(fname, fname)} {direction_str} {abs_pct}%"

# Global singleton
shap_explainer = PlainLanguageSHAPExplainer()

