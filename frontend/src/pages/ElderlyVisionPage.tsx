import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  ShieldCheck,
  Activity,
  HeartHandshake,
  Compass,
  PhoneCall,
  Clock,
  Footprints,
  Sliders,
  CheckCircle2,
  Info,
} from "lucide-react";
import { api } from "../utils/api";

export const ElderlyVisionPage: React.FC = () => {
  const [entropy, setEntropy] = useState<number>(0.25);
  const [radius, setRadius] = useState<number>(0.6);
  const [steps, setSteps] = useState<number>(950);
  const [screen, setScreen] = useState<number>(0.5);
  const [calls, setCalls] = useState<number>(0);
  const [evalResult, setEvalResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const res = await api.simulateRisk({
        location_entropy: entropy,
        radius_of_gyration_km: radius,
        step_count: steps,
        total_screen_time_hours: screen,
        outgoing_call_count: calls,
        distinct_contacts_interacted: calls,
        population_type: "elderly_isolation",
      });
      setEvalResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pb-14"
    >
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-borderSoft pb-5">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-[30px] sm:text-[34px] font-bold tracking-tight text-primaryText font-sans">
              Elderly Isolation Population Adaptation (見守り)
            </h1>
            <span className="hanko-seal text-[12px] px-2.5 py-0.5">
              高齢者孤立
            </span>
          </div>
          <p className="text-[14.5px] text-secondaryText mt-1.5 font-sans">
            Generalization Principle: Transferring passive sensing,
            interpretable ML, and family bridges to prevent elderly loneliness
            and health decline
          </p>
        </div>
        <div className="flex items-center space-x-2 text-[13px] text-matchaGreen font-medium bg-softMint/70 px-3.5 py-1.5 rounded-full border border-borderSoft">
          <HeartHandshake className="w-4 h-4 text-matchaGreen" />
          <span className="font-jp">Mimamori • Respectful Care</span>
        </div>
      </div>

      {/* Comparative Architecture Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Youth Column */}
        <div className="calm-surface rounded-2xl p-6 bg-white border border-borderSoft space-y-4 shadow-calm">
          <div className="flex items-center justify-between border-b border-borderSoft/60 pb-3">
            <div className="flex items-center space-x-2">
              <Compass className="w-4 h-4 text-mizuTeal" />
              <span className="text-[14px] font-bold text-mizuTeal uppercase tracking-wider font-sans">
                Cohort 1: Youth Hikikomori (若年ひきこもり)
              </span>
            </div>
            <span className="text-[11px] bg-softMint border border-borderSoft text-mizuTeal px-2.5 py-0.5 rounded-full font-mono font-semibold">
              Core Baseline
            </span>
          </div>
          <ul className="space-y-3.5 text-[14px] text-primaryText leading-relaxed">
            <li className="flex items-start space-x-2.5">
              <span className="text-mizuTeal font-bold text-base">•</span>
              <span>
                <strong className="text-primaryText font-semibold">
                  Signal Patterns:
                </strong>{" "}
                Nocturnal internet immersion, day/night circadian reversal,
                compulsive app-switching.
              </span>
            </li>
            <li className="flex items-start space-x-2.5">
              <span className="text-mizuTeal font-bold text-base">•</span>
              <span>
                <strong className="text-primaryText font-semibold">
                  Caregiver Dynamic:
                </strong>{" "}
                Parents with relational authority; high risk of confrontation;
                CRAFT de-escalation protocol vital.
              </span>
            </li>
            <li className="flex items-start space-x-2.5">
              <span className="text-mizuTeal font-bold text-base">•</span>
              <span>
                <strong className="text-primaryText font-semibold">
                  Ethical Safeguard:
                </strong>{" "}
                Explicitly refuses avoidance-enabling AI friend chatbots to
                protect real-world connection.
              </span>
            </li>
          </ul>
        </div>

        {/* Elderly Column */}
        <div className="calm-surface rounded-2xl p-6 bg-white border border-borderSoft space-y-4 shadow-calm">
          <div className="flex items-center justify-between border-b border-borderSoft/60 pb-3">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-matchaGreen" />
              <span className="text-[14px] font-bold text-matchaGreen uppercase tracking-wider font-sans">
                Cohort 2: Elderly Isolation (高齢者孤立)
              </span>
            </div>
            <span className="text-[11px] bg-[#EAF5EC] border border-[#CDE5D3] text-matchaGreen px-2.5 py-0.5 rounded-full font-mono font-semibold">
              Adapted Weights
            </span>
          </div>
          <ul className="space-y-3.5 text-[14px] text-primaryText leading-relaxed">
            <li className="flex items-start space-x-2.5">
              <span className="text-matchaGreen font-bold text-base">•</span>
              <span>
                <strong className="text-primaryText font-semibold">
                  Signal Patterns:
                </strong>{" "}
                Physical mobility decay and digital cessation (phone inactivity
                signals acute distress or health decline).
              </span>
            </li>
            <li className="flex items-start space-x-2.5">
              <span className="text-matchaGreen font-bold text-base">•</span>
              <span>
                <strong className="text-primaryText font-semibold">
                  Caregiver Dynamic:
                </strong>{" "}
                Adult children, sometimes holding medical power of attorney;
                respectful adult-to-adult framing.
              </span>
            </li>
            <li className="flex items-start space-x-2.5">
              <span className="text-matchaGreen font-bold text-base">•</span>
              <span>
                <strong className="text-primaryText font-semibold">
                  Re-tuned Model:
                </strong>{" "}
                De-emphasizes screen hours; weights mobility decay (45%) and
                communication silence (35%).
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Interactive Geriatric Model Demo */}
      <div className="calm-surface rounded-2xl p-6 bg-white border border-borderSoft shadow-calm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-borderSoft/60 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-softMint flex items-center justify-center text-mizuTeal">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-[17px] sm:text-[18px] font-bold text-primaryText font-sans">
                Interactive Geriatric Model Demonstration (Chiyo Tanaka, 74)
              </h3>
              <p className="text-[13px] text-secondaryText mt-0.5">
                Simulating subtle mobility patterns and contact frequencies
                under geriatric re-weighting
              </p>
            </div>
          </div>
          <span className="text-[12px] text-mizuTeal font-semibold bg-softMint px-3 py-1 rounded-full border border-borderSoft">
            Re-calibrated Inference
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-4 rounded-xl bg-[#FAF9F5] border border-borderSoft">
            <div className="flex items-center justify-between text-[13.5px] mb-2">
              <span className="text-secondaryText font-medium flex items-center space-x-1.5">
                <Compass className="w-3.5 h-3.5 text-mizuTeal" />
                <span>Location Entropy</span>
              </span>
              <span className="font-mono font-bold text-primaryText text-[14px]">
                {entropy}
              </span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.80"
              step="0.05"
              value={entropy}
              onChange={(e) => setEntropy(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-borderSoft rounded appearance-none accent-[#167D78] cursor-pointer"
            />
            <span className="text-[11px] text-secondaryText block mt-1.5">
              Spatial life-space diversity
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF9F5] border border-borderSoft">
            <div className="flex items-center justify-between text-[13.5px] mb-2">
              <span className="text-secondaryText font-medium flex items-center space-x-1.5">
                <Footprints className="w-3.5 h-3.5 text-matchaGreen" />
                <span>Daily Steps Count</span>
              </span>
              <span className="font-mono font-bold text-primaryText text-[14px]">
                {steps}
              </span>
            </div>
            <input
              type="range"
              min="200"
              max="6000"
              step="100"
              value={steps}
              onChange={(e) => setSteps(parseInt(e.target.value))}
              className="w-full h-1.5 bg-borderSoft rounded appearance-none accent-[#167D78] cursor-pointer"
            />
            <span className="text-[11px] text-secondaryText block mt-1.5">
              Physical ambulation
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF9F5] border border-borderSoft">
            <div className="flex items-center justify-between text-[13.5px] mb-2">
              <span className="text-secondaryText font-medium flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-mizuTeal" />
                <span>Screen Time</span>
              </span>
              <span className="font-mono font-bold text-primaryText text-[14px]">
                {screen} h
              </span>
            </div>
            <input
              type="range"
              min="0.0"
              max="4.0"
              step="0.2"
              value={screen}
              onChange={(e) => setScreen(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-borderSoft rounded appearance-none accent-[#167D78] cursor-pointer"
            />
            <span className="text-[11px] text-secondaryText block mt-1.5">
              De-emphasized for elderly
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF9F5] border border-borderSoft">
            <div className="flex items-center justify-between text-[13.5px] mb-2">
              <span className="text-secondaryText font-medium flex items-center space-x-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-matchaGreen" />
                <span>Calls / Contacts</span>
              </span>
              <span className="font-mono font-bold text-primaryText text-[14px]">
                {calls}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="6"
              step="1"
              value={calls}
              onChange={(e) => setCalls(parseInt(e.target.value))}
              className="w-full h-1.5 bg-borderSoft rounded appearance-none accent-[#167D78] cursor-pointer"
            />
            <span className="text-[11px] text-secondaryText block mt-1.5">
              Phone voice/text touchpoints
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleSimulate}
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-mizuTeal hover:bg-mizuTeal-dark text-white text-[14.5px] font-semibold shadow-xs flex items-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-softMint" />
            <span>
              {loading ? "Evaluating..." : "Run Geriatric Isolation Inference"}
            </span>
          </button>
          <span className="text-[12px] text-secondaryText flex items-center space-x-1.5">
            <Info className="w-3.5 h-3.5 text-mizuTeal" />
            <span>Zero cloud transfer of sensor traces • ISO/IEC 27701</span>
          </span>
        </div>

        {evalResult && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="p-5 rounded-xl bg-softMint/50 border border-borderSoft text-[13.5px] space-y-2.5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="font-bold text-mizuTeal-dark text-[16px]">
                Isolation Risk Score:{" "}
                <span className="font-mono tabular-nums">
                  {Math.round(evalResult.overall_risk_score)}
                </span>{" "}
                / 100 ({evalResult.risk_tier} Tier)
              </span>
              <span className="font-mono text-mizuTeal text-[12px] bg-white/80 px-2.5 py-0.5 rounded-full border border-borderSoft font-semibold">
                {evalResult.model_type}
              </span>
            </div>
            <p className="text-primaryText leading-relaxed text-[14px]">
              {evalResult.plain_language_summary}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
