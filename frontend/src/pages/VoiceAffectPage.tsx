import React, { useState, useEffect } from "react";
import { Mic, FileLock2, ShieldCheck, Info } from "lucide-react";
import { motion } from "framer-motion";
import { ProsodyVisualizer } from "../components/ProsodyVisualizer";
import { VoiceProsody } from "../types";
import { api } from "../utils/api";

export const VoiceAffectPage: React.FC = () => {
  const [prosody, setProsody] = useState<VoiceProsody | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.getLatestProsody();
      setProsody(data);
    } catch (err) {
      console.error("Failed to load prosody", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pb-12"
    >
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-kizunaBorder/80 pb-5">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-[30px] sm:text-[34px] font-bold tracking-tight text-primaryText">
              Voice & Affect Prosody Studio
            </h1>
            <span className="hanko-seal text-[12px] px-2.5 py-0.5">
              音響韻律
            </span>
          </div>
          <p className="text-[14.5px] text-secondaryText mt-1.5 font-jp">
            Acoustic prosody evaluation for psychomotor cadence • Audio content
            is never recorded or speech transcribed
          </p>
        </div>
      </div>

      {/* Architectural Guarantee Box in Soft Mint */}
      <div className="calm-surface p-6 bg-mizu-50/70 border border-mizu-200 shadow-calm space-y-3">
        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-mizu-700 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
            <Info className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-[16px] sm:text-[17px] font-bold text-mizu-900">
              The Sovereign Privacy Principle: How vs. What
              (発話内容ではなく様式のみを解析)
            </h4>
            <p className="text-[14.5px] text-primaryText mt-1.5 leading-relaxed">
              Kizuna strictly restricts voice metrics to paralinguistic acoustic
              dimensions: pitch variance (F0), speech tempo, pause ratios, and
              vocal energy.{" "}
              <strong className="font-semibold text-mizu-900">
                Semantic word analysis, speech-to-text conversion, and raw audio
                file retention are permanently blocked on-device by system
                architecture
              </strong>
              . We evaluate <em>how</em> cadence shifts, never <em>what</em> is
              spoken.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Prosody Visualizer */}
      <ProsodyVisualizer initialProsody={prosody} />
    </motion.div>
  );
};
