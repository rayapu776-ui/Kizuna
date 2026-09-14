"""
Paralinguistic Voice / Affect Prosody Analyzer.
Implements the published "affect-from-prosody" paradigm (acoustic paralinguistics).
Analyzes ONLY acoustic metadata (pitch variance, speech tempo, pause duration, vocal energy).
STRICT PRIVACY ENFORCEMENT: Never transcribes or stores spoken content.
"We analyze how something is said, never what is said."
"""

from typing import Dict, Any

class ParalinguisticProsodyAnalyzer:
    """
    Evaluates vocal markers of depressive flattening and social withdrawal
    using acoustic parameters extracted from speech prosody.
    """

    # Normative healthy baselines for conversational speech prosody
    NORMATIVE_PROSODY = {
        "pitch_variance_hz": 34.0,     # Normal emotional inflection: 28 - 45 Hz
        "speech_rate_wpm": 130.0,      # Normal conversational pace: 120 - 150 wpm
        "pause_length_ratio": 0.20,    # Normal silence ratio: 0.15 - 0.25
        "vocal_energy_db": -18.0       # Normal conversational acoustic power: -15 to -22 dB
    }

    def analyze_acoustic_metadata(
        self,
        pitch_variance_hz: float,
        speech_rate_wpm: float,
        pause_length_ratio: float,
        vocal_energy_db: float,
        call_duration_seconds: int = 180
    ) -> Dict[str, Any]:
        """
        Processes acoustic features and calculates an affect flatness / withdrawal indicator.
        Zero content transcription or audio storage guarantee.
        """
        # 1. Pitch Variance Indicator (Flatter/monotone pitch indicates psychomotor/affective blunting)
        # Healthy: ~34 Hz; Monotone: < 18 Hz
        pitch_loss = max(0.0, min((self.NORMATIVE_PROSODY["pitch_variance_hz"] - pitch_variance_hz) / 22.0, 1.0)) * 35.0
        
        # 2. Speech Rate (Psychomotor slowing: < 95 wpm)
        tempo_slow = max(0.0, min((self.NORMATIVE_PROSODY["speech_rate_wpm"] - speech_rate_wpm) / 50.0, 1.0)) * 25.0
        
        # 3. Pause Length Ratio (Hesitation / latency > 0.35)
        pause_excess = max(0.0, min((pause_length_ratio - self.NORMATIVE_PROSODY["pause_length_ratio"]) / 0.30, 1.0)) * 25.0
        
        # 4. Vocal Energy Decay (Soft, subdued vocal projection < -25 dB)
        energy_subdued = max(0.0, min((abs(vocal_energy_db) - abs(self.NORMATIVE_PROSODY["vocal_energy_db"])) / 12.0, 1.0)) * 15.0
        
        affect_flatness_score = pitch_loss + tempo_slow + pause_excess + energy_subdued
        affect_flatness_score = round(min(max(affect_flatness_score, 0.0), 100.0), 1)
        
        # Interpretive plain-language clinical summary
        if affect_flatness_score < 25.0:
            interpretation = "Natural emotional inflection, dynamic vocal range, and healthy conversational cadence."
            clinical_affect = "Broad / Euthymic"
        elif affect_flatness_score < 50.0:
            interpretation = "Mild vocal prosodic attenuation with slight increase in inter-turn latency."
            clinical_affect = "Mildly Restricted"
        elif affect_flatness_score < 75.0:
            interpretation = "Noticeable reduction in pitch variability (monotone tendency) and slowed speech tempo."
            clinical_affect = "Moderately Constricted"
        else:
            interpretation = "Marked prosodic flattening with high pause ratios and subdued vocal energy (blunted affect indicator)."
            clinical_affect = "Blunted / Monotone"

        return {
            "pitch_variance_hz": round(pitch_variance_hz, 1),
            "speech_rate_wpm": round(speech_rate_wpm, 1),
            "pause_length_ratio": round(pause_length_ratio, 3),
            "vocal_energy_db": round(vocal_energy_db, 1),
            "affect_flatness_score": affect_flatness_score,
            "clinical_affect": clinical_affect,
            "prosody_interpretation": interpretation,
            "zero_content_guarantee": True,
            "transcription_performed": False,
            "privacy_certification": "ISO/IEC 27701 Aligned: Zero Acoustic Content Stored"
        }

prosody_analyzer = ParalinguisticProsodyAnalyzer()

