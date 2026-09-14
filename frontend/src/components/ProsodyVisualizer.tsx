import React, { useState } from "react";
import {
  Mic,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Activity,
  Waves,
} from "lucide-react";
import { motion } from "framer-motion";
import { VoiceProsody } from "../types";
import { api } from "../utils/api";

interface ProsodyVisualizerProps {
  initialProsody?: VoiceProsody | null;
}

export const ProsodyVisualizer: React.FC<ProsodyVisualizerProps> = ({
  initialProsody,
}) => {
  const [pitch, setPitch] = useState<number>(
    initialProsody?.pitch_variance_hz || 22.0,
  );
  const [tempo, setTempo] = useState<number>(
    initialProsody?.speech_rate_wpm || 105.0,
  );
  const [pauseRatio, setPauseRatio] = useState<number>(
    initialProsody?.pause_length_ratio || 0.35,
  );
  const [energy, setEnergy] = useState<number>(
    initialProsody?.vocal_energy_db || -24.0,
  );
  const [analysisResult, setAnalysisResult] = useState<any>(
    initialProsody || null,
  );
  const [isSimulating, setIsSimulating] = useState(false);

  const runSimulation = async () => {
    setIsSimulating(true);
    try {
      const res = await api.simulateProsody({
        pitch_variance_hz: pitch,
        speech_rate_wpm: tempo,
        pause_length_ratio: pauseRatio,
        vocal_energy_db: energy,
      });
      setAnalysisResult(res);
    } catch (err) {
      console.error("Failed to simulate prosody", err);
    } finally {
      setIsSimulating(false);
    }
  };

  const flatness = analysisResult?.affect_flatness_score || 45.0;

  return (
    <div className="calm-surface p-6 shadow-calm space-y-6">
      {/* Header with Strict Privacy Seal */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-kizunaBorder/60 pb-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-mizu-50 border border-mizu-200 text-mizu-700 flex items-center justify-center flex-shrink-0">
            <Mic className="w-5 h-5 text-mizu-700" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-[20px] font-bold text-primaryText font-sans">
                Paralinguistic Voice / Affect Prosody
              </h3>
              <span className="hanko-seal text-[12px] px-2 py-0.5">
                音響韻律解析
              </span>
            </div>
            <p className="text-[14.5px] text-secondaryText mt-0.5">
              Affect-from-prosody: "We analyze how something is said, never what
              is said."
            </p>
          </div>
        </div>

        {/* Certified Privacy Guarantee Banner */}
        <div className="px-3.5 py-1.5 rounded-xl bg-matcha-50 border border-matcha-200 text-[12.5px] text-matcha-700 font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-matcha" />
          <span>ISO/IEC 27701: Zero Audio Content Stored</span>
        </div>
      </div>

      {/* Main Grid: Sliders vs Clinical Affect Meter */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sliders Sandbox */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[13.5px] font-bold text-primaryText uppercase tracking-wider font-sans">
              Acoustic Parameters (Metadata Only)
            </span>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={runSimulation}
              disabled={isSimulating}
              className="text-[14px] text-white font-semibold flex items-center space-x-2 bg-mizu-700 hover:bg-mizu-800 px-4 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-mizu-200" />
              <span>
                {isSimulating ? "Evaluating..." : "Re-evaluate Prosody"}
              </span>
            </motion.button>
          </div>

          {/* 1. Pitch Variance */}
          <div className="p-4 rounded-xl bg-[#FAF9F5] border border-kizunaBorder">
            <div className="flex justify-between text-[14px] mb-2">
              <span className="text-primaryText font-medium">
                Pitch Variance (基本周波数 F0 抑揚)
              </span>
              <span className="font-mono text-mizu-800 font-bold text-[14.5px]">
                {pitch} Hz
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="50"
              step="1"
              value={pitch}
              onChange={(e) => setPitch(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#E8F1EE] rounded-lg appearance-none cursor-pointer accent-mizu-700"
            />
            <div className="flex justify-between text-[12px] text-secondaryText mt-1.5 font-mono">
              <span>Monotone (&lt;18 Hz)</span>
              <span>Healthy Range (34 Hz)</span>
            </div>
          </div>

          {/* 2. Speech Rate */}
          <div className="p-4 rounded-xl bg-[#FAF9F5] border border-kizunaBorder">
            <div className="flex justify-between text-[14px] mb-2">
              <span className="text-primaryText font-medium">
                Speech Rate (発話速度・テンポ)
              </span>
              <span className="font-mono text-mizu-800 font-bold text-[14.5px]">
                {tempo} WPM
              </span>
            </div>
            <input
              type="range"
              min="60"
              max="160"
              step="5"
              value={tempo}
              onChange={(e) => setTempo(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#E8F1EE] rounded-lg appearance-none cursor-pointer accent-mizu-700"
            />
            <div className="flex justify-between text-[12px] text-secondaryText mt-1.5 font-mono">
              <span>Psychomotor Retardation (&lt;90)</span>
              <span>Standard (120)</span>
            </div>
          </div>

          {/* 3. Pause Length Ratio */}
          <div className="p-4 rounded-xl bg-[#FAF9F5] border border-kizunaBorder">
            <div className="flex justify-between text-[14px] mb-2">
              <span className="text-primaryText font-medium">
                Pause Ratio (沈黙・発話間隔比率)
              </span>
              <span className="font-mono text-mizu-800 font-bold text-[14.5px]">
                {Math.round(pauseRatio * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.10"
              max="0.65"
              step="0.05"
              value={pauseRatio}
              onChange={(e) => setPauseRatio(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#E8F1EE] rounded-lg appearance-none cursor-pointer accent-mizu-700"
            />
            <div className="flex justify-between text-[12px] text-secondaryText mt-1.5 font-mono">
              <span>Active Dialogue (&lt;20%)</span>
              <span>Hesitation/Quiet (&gt;45%)</span>
            </div>
          </div>
        </div>

        {/* Clinical Affect Flatness Meter */}
        <div className="lg:col-span-6 calm-surface p-6 bg-[#FAF9F5] border border-kizunaBorder flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Waves className="w-4.5 h-4.5 text-mizu-700" />
                <h4 className="text-[14px] font-bold uppercase tracking-wider text-primaryText font-sans">
                  Prosody Affect Flatness Meter
                </h4>
              </div>
              <span
                className={`text-[12px] px-2.5 py-0.5 rounded-full font-semibold uppercase border ${
                  flatness < 35
                    ? "bg-matcha-50 border-matcha-200 text-matcha-700"
                    : flatness < 65
                      ? "bg-mizu-50 border-mizu-200 text-mizu-800"
                      : "bg-amber-50 border-amber-200 text-amber-600"
                }`}
              >
                {flatness < 35
                  ? "Expressive Rhythm"
                  : flatness < 65
                    ? "Slightly Flattened"
                    : "Blunted Cadence"}
              </span>
            </div>

            {/* Gauge */}
            <div className="text-center py-4">
              <div className="text-[36px] font-bold text-primaryText tabular-nums font-mono leading-none">
                {Math.round(flatness)}
                <span className="text-[18px] text-secondaryText font-normal">
                  {" "}
                  / 100
                </span>
              </div>
              <p className="text-[13.5px] text-secondaryText mt-1.5 font-medium">
                Affect Flatness & Cadence Index
              </p>
            </div>

            <div className="w-full bg-[#E8F1EE] rounded-full h-2.5 mb-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-matcha via-mizu-500 to-amber-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${flatness}%` }}
              />
            </div>

            <p className="text-[14.5px] text-primaryText/90 leading-relaxed">
              {analysisResult?.clinical_impression ||
                "Acoustic prosody indicates a quiet, reserved conversational pattern without severe affective blunting."}
            </p>
          </div>

          <div className="pt-3.5 border-t border-kizunaBorder/60 mt-4 text-[12.5px] text-secondaryText flex items-center justify-between">
            <span>Clinical Reference: Yang et al. (2013)</span>
            <span className="font-semibold text-mizu-700">
              0 Audio Bytes Retained
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
