import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  TrendingDown,
  Compass,
  Heart,
  Moon,
  Smartphone,
  MapPin,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { RiskAssessment } from "../types";

interface RiskScoreCardProps {
  assessment: RiskAssessment | null;
  loading?: boolean;
}

export const RiskScoreCard: React.FC<RiskScoreCardProps> = ({
  assessment,
  loading,
}) => {
  const [showShapDetails, setShowShapDetails] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    if (!assessment) return;
    const target = Math.round(assessment.overall_risk_score);
    let start = 0;
    const duration = 800;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setDisplayScore(target);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [assessment?.overall_risk_score]);

  if (loading || !assessment) {
    return (
      <div className="calm-surface p-6 animate-pulse">
        <div className="h-5 w-48 bg-[#E8F1EE] rounded mb-4"></div>
        <div className="h-28 w-full bg-[#FAF9F5] rounded-xl mb-4"></div>
        <div className="h-4 w-3/4 bg-[#E8F1EE] rounded"></div>
      </div>
    );
  }

  const score = assessment.overall_risk_score;
  const tier = assessment.risk_tier;

  // Mizu Calm + Matcha Growth Psychological Risk Tiers (Section 5)
  const tierConfig = {
    low: {
      color: "text-matcha",
      bg: "bg-matcha-50 border-matcha-200 text-matcha-700",
      stroke: "#5F8F6B", // Matcha Green
      label: "Balanced Equilibrium",
      jpLabel: "生活調和・安定律",
      icon: CheckCircle2,
      desc: "Your mobility, sleep timing, and digital rest patterns remain in healthy harmony.",
    },
    emerging: {
      color: "text-mizu-700",
      bg: "bg-mizu-50 border-mizu-200 text-mizu-800",
      stroke: "#167D78", // Mizu Teal
      label: "Gentle Rest Phase",
      jpLabel: "休息期・早期兆候",
      icon: Compass,
      desc: "We noticed a slight shift toward late-night hours. A 10-minute morning window reset will restore balance.",
    },
    moderate: {
      color: "text-amber-600",
      bg: "bg-amber-50 border-amber-200 text-amber-600",
      stroke: "#D39A45", // Attention Amber + Mizu Teal
      label: "Attention & Support Phase",
      jpLabel: "注意領域・家族架橋",
      icon: Sparkles,
      desc: "Indoor retreat and screen hours have drifted. Low-pressure family bridges and gentle steps recommended.",
    },
    elevated: {
      color: "text-mizu-900",
      bg: "bg-mizu-100 border-mizu-300 text-mizu-900",
      stroke: "#105C58", // Deeper Teal
      label: "Sanctuary Support Recommended",
      jpLabel: "専門支援・寄り添い期",
      icon: Heart,
      desc: "Prolonged room stay detected. You are safe; confidential clinical warm hand-offs are ready whenever you want.",
    },
  }[tier] || {
    color: "text-mizu-700",
    bg: "bg-mizu-50 border-mizu-200 text-mizu-800",
    stroke: "#167D78",
    label: "Observing Rhythm",
    jpLabel: "リズム観察",
    icon: CheckCircle2,
    desc: "Tracking behavioral patterns on-device with zero surveillance.",
  };

  const circumference = 2 * Math.PI * 44;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="calm-surface p-6 relative overflow-hidden">
      {/* Header & Gauge */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left: Zen Circular Ring Gauge & Status */}
        <div className="flex items-center space-x-5">
          <div className="relative w-28 h-28 flex items-center justify-center flex-shrink-0">
            <svg
              className="w-full h-full -rotate-90 transform"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="44"
                className="text-[#E8F1EE]"
                strokeWidth="7"
                stroke="currentColor"
                fill="transparent"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="44"
                stroke={tierConfig.stroke}
                strokeWidth="7"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Counter Score */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[34px] font-bold text-primaryText tracking-tight tabular-nums font-mono leading-none">
                {displayScore}
              </span>
              <span className="text-[12px] uppercase font-semibold text-secondaryText mt-1">
                Index / 100
              </span>
            </div>
          </div>

          {/* Psychological Framing */}
          <div className="space-y-2 max-w-md">
            <div className="flex items-center space-x-2">
              <span className="hanko-seal text-[12px] px-2 py-0.5">
                {tierConfig.jpLabel}
              </span>
              <span
                className={`text-[13px] px-3 py-0.5 rounded-full font-semibold border ${tierConfig.bg}`}
              >
                {tierConfig.label}
              </span>
            </div>
            <h3 className="text-[19px] sm:text-[21px] font-bold text-primaryText font-sans">
              Personal Wellbeing & Rhythm Index
            </h3>
            <p className="text-[15px] text-secondaryText leading-relaxed">
              {tierConfig.desc}
            </p>
          </div>
        </div>

        {/* Right: SHAP Explainability Trigger */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-end gap-2.5 w-full lg:w-auto">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowShapDetails(!showShapDetails)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-mizu-50 hover:bg-mizu-100 text-mizu-800 border border-mizu-200 text-[14.5px] font-semibold flex items-center justify-center space-x-2 transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-mizu-600" />
            <span>Why This Score? (TreeSHAP)</span>
            {showShapDetails ? (
              <ChevronUp className="w-4 h-4 text-mizu-600 ml-1" />
            ) : (
              <ChevronDown className="w-4 h-4 text-mizu-600 ml-1" />
            )}
          </motion.button>

          <span className="text-[12px] text-secondaryText">
            Interpretable AI • 100% Explainable
          </span>
        </div>
      </div>

      {/* Domain Subscores Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-6 pt-5 border-t border-kizunaBorder/60">
        {/* Circadian Rhythm */}
        <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#E8F1EE]">
          <div className="flex items-center justify-between text-secondaryText mb-1.5">
            <span className="text-[13px] font-medium flex items-center space-x-1.5">
              <Moon className="w-3.5 h-3.5 text-mizu-700" />
              <span>Circadian Rhythm</span>
            </span>
            <span className="text-[14px] font-bold text-primaryText font-mono">
              {Math.round(assessment.circadian_subscore)}%
            </span>
          </div>
          <div className="w-full bg-[#E8F1EE] rounded-full h-2 overflow-hidden">
            <div
              className="bg-mizu-700 h-2 rounded-full transition-all duration-500"
              style={{ width: `${assessment.circadian_subscore}%` }}
            />
          </div>
        </div>

        {/* Digital Immersion */}
        <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#E8F1EE]">
          <div className="flex items-center justify-between text-secondaryText mb-1.5">
            <span className="text-[13px] font-medium flex items-center space-x-1.5">
              <Smartphone className="w-3.5 h-3.5 text-mizu-700" />
              <span>Digital Rest</span>
            </span>
            <span className="text-[14px] font-bold text-primaryText font-mono">
              {Math.round(assessment.digital_subscore)}%
            </span>
          </div>
          <div className="w-full bg-[#E8F1EE] rounded-full h-2 overflow-hidden">
            <div
              className="bg-mizu-700 h-2 rounded-full transition-all duration-500"
              style={{ width: `${assessment.digital_subscore}%` }}
            />
          </div>
        </div>

        {/* Mobility Variety */}
        <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#E8F1EE]">
          <div className="flex items-center justify-between text-secondaryText mb-1.5">
            <span className="text-[13px] font-medium flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-mizu-700" />
              <span>Physical Space</span>
            </span>
            <span className="text-[14px] font-bold text-primaryText font-mono">
              {Math.round(assessment.mobility_subscore)}%
            </span>
          </div>
          <div className="w-full bg-[#E8F1EE] rounded-full h-2 overflow-hidden">
            <div
              className="bg-mizu-700 h-2 rounded-full transition-all duration-500"
              style={{ width: `${assessment.mobility_subscore}%` }}
            />
          </div>
        </div>

        {/* Social Balance */}
        <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#E8F1EE]">
          <div className="flex items-center justify-between text-secondaryText mb-1.5">
            <span className="text-[13px] font-medium flex items-center space-x-1.5">
              <Heart className="w-3.5 h-3.5 text-mizu-700" />
              <span>Social Bridge</span>
            </span>
            <span className="text-[14px] font-bold text-primaryText font-mono">
              {Math.round(assessment.social_subscore)}%
            </span>
          </div>
          <div className="w-full bg-[#E8F1EE] rounded-full h-2 overflow-hidden">
            <div
              className="bg-mizu-700 h-2 rounded-full transition-all duration-500"
              style={{ width: `${assessment.social_subscore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Expandable TreeSHAP Feature Attributions */}
      <AnimatePresence>
        {showShapDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-5 pt-5 border-t border-kizunaBorder/60"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-mizu-700" />
                <h4 className="text-[14px] font-bold uppercase tracking-wider text-mizu-900 font-sans">
                  Transparent Machine Learning Attribution (TreeSHAP)
                </h4>
              </div>
              <span className="text-[12px] text-secondaryText">
                Zero Black Boxes • Clinically Interpretable
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {assessment.shap_breakdown &&
              assessment.shap_breakdown.length > 0 ? (
                assessment.shap_breakdown.map((item, idx) => {
                  const isProtective =
                    item.direction === "protects_against_risk";

                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isProtective
                          ? "bg-matcha-50 border-matcha-200 text-matcha-800"
                          : "bg-mizu-50/70 border-mizu-200 text-mizu-900"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[14px] font-bold flex items-center space-x-1.5">
                          {isProtective ? (
                            <TrendingDown className="w-4 h-4 text-matcha" />
                          ) : (
                            <TrendingUp className="w-4 h-4 text-mizu-700" />
                          )}
                          <span>{item.display_name || item.feature_name}</span>
                        </span>
                        <span
                          className={`text-[14px] font-bold font-mono ${
                            isProtective ? "text-matcha-700" : "text-mizu-800"
                          }`}
                        >
                          {item.impact_points > 0 ? "+" : ""}
                          {Math.round(item.impact_points)}%
                        </span>
                      </div>
                      <p className="text-[13.5px] text-primaryText/80 leading-relaxed">
                        {item.plain_explanation}
                      </p>
                    </div>
                  );
                })
              ) : (
                <p className="text-[14px] text-secondaryText col-span-2">
                  All sensory features are currently contributing toward
                  baseline stability.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
