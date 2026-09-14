import React from "react";
import {
  CheckCircle2,
  Compass,
  ArrowRight,
  Sparkles,
  Search,
  Activity,
  Lightbulb,
  HeartHandshake,
  TrendingUp,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";

export type JourneyStage =
  | "detected"
  | "analyzed"
  | "recommended"
  | "action_ready"
  | "human_support"
  | "progress"
  | "resolved";

interface ProblemSolvingJourneyProps {
  currentStage: JourneyStage;
  whatChanged: string;
  whyItMatters: string;
  whatCanYouDo: string;
  recommendedSmallStep: string;
  actionButtonText?: string;
  onTakeAction?: () => void;
  progressPercent?: number;
  statusContextLabel?: string;
  statusTier?: "stable" | "attention" | "elevated" | "critical";
}

export const ProblemSolvingJourney: React.FC<ProblemSolvingJourneyProps> = ({
  currentStage,
  whatChanged,
  whyItMatters,
  whatCanYouDo,
  recommendedSmallStep,
  actionButtonText = "Take This Small Step",
  onTakeAction,
  progressPercent = 65,
  statusContextLabel = "Gentle Adjustment Phase",
  statusTier = "attention",
}) => {
  const stages: {
    key: JourneyStage;
    label: string;
    jp: string;
    icon: React.ElementType;
  }[] = [
    { key: "detected", label: "Detected", jp: "兆候感知", icon: Search },
    { key: "analyzed", label: "Analyzed", jp: "要因分析", icon: Activity },
    {
      key: "recommended",
      label: "Recommended",
      jp: "助言導出",
      icon: Lightbulb,
    },
    { key: "action_ready", label: "Action Ready", jp: "小行動", icon: Compass },
    {
      key: "human_support",
      label: "Human Support",
      jp: "人的架橋",
      icon: HeartHandshake,
    },
    { key: "progress", label: "Progress", jp: "前進実感", icon: TrendingUp },
    { key: "resolved", label: "Resolved", jp: "調和回復", icon: CheckCircle2 },
  ];

  const stageOrder: JourneyStage[] = [
    "detected",
    "analyzed",
    "recommended",
    "action_ready",
    "human_support",
    "progress",
    "resolved",
  ];

  const currentIndex = stageOrder.indexOf(currentStage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="calm-surface p-6 mb-6 relative overflow-hidden"
    >
      {/* Subtle Warm Ivory to Mint gradient accent */}
      <div className="absolute top-0 right-0 w-80 h-32 bg-gradient-to-l from-mizu-100/50 via-matcha-50/30 to-transparent pointer-events-none" />

      {/* Header with Psychological Grounding */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 relative z-10">
        <div>
          <div className="flex items-center space-x-2.5 mb-1.5">
            <span className="hanko-seal text-[12px] px-2 py-0.5">
              解決への歩み
            </span>
            <span className="text-[13px] font-bold uppercase tracking-wider text-mizu-700 font-sans">
              Problem-Solving Journey
            </span>
          </div>
          <h3 className="text-[20px] sm:text-[22px] font-bold text-primaryText tracking-tight font-sans leading-snug">
            “You are safe. Notice the change, understand it, and take one small
            step.”
          </h3>
        </div>

        {/* Psychological Status Badge */}
        <div className="flex items-center space-x-2">
          <div
            className={`px-3.5 py-1.5 rounded-full text-[13px] font-semibold flex items-center space-x-2 ${
              statusTier === "critical"
                ? "bg-coral-50 text-coral-600 border border-coral-200"
                : statusTier === "attention"
                  ? "bg-amber-50 text-amber-600 border border-amber-200"
                  : "bg-matcha-50 text-matcha-700 border border-matcha-200"
            }`}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                statusTier === "critical"
                  ? "bg-criticalCoral"
                  : statusTier === "attention"
                    ? "bg-attentionAmber"
                    : "bg-matcha"
              }`}
            />
            <span>{statusContextLabel}</span>
          </div>
        </div>
      </div>

      {/* 7-Stage Visual Journey Stepper */}
      <div className="mb-6 relative z-10">
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {stages.map((stage, idx) => {
            const isCompleted = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            const Icon = stage.icon;

            return (
              <div
                key={stage.key}
                className="flex flex-col items-center text-center"
              >
                {/* Connector Line and Step Bubble */}
                <div className="w-full flex items-center relative mb-2">
                  <div
                    className={`flex-1 h-1.5 rounded-full transition-colors duration-300 ${
                      idx === 0
                        ? "opacity-0"
                        : idx <= currentIndex
                          ? "bg-matcha"
                          : "bg-[#E8F1EE]"
                    }`}
                  />
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 relative z-10 ${
                      isCompleted
                        ? "bg-matcha text-white shadow-xs"
                        : isCurrent
                          ? "bg-mizu-700 text-white shadow-md ring-4 ring-mizu-100 animate-step-pulse"
                          : "bg-white text-secondaryText border border-kizunaBorder"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4 stroke-[2.5]" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>
                  <div
                    className={`flex-1 h-1.5 rounded-full transition-colors duration-300 ${
                      idx === stages.length - 1
                        ? "opacity-0"
                        : idx < currentIndex
                          ? "bg-matcha"
                          : "bg-[#E8F1EE]"
                    }`}
                  />
                </div>

                {/* Stage Labels */}
                <span
                  className={`text-[13px] font-semibold leading-tight truncate max-w-full font-sans ${
                    isCurrent
                      ? "text-mizu-800 font-bold"
                      : isCompleted
                        ? "text-matcha-700"
                        : "text-secondaryText"
                  }`}
                >
                  {stage.label}
                </span>
                <span className="text-[11.5px] text-[#8B9E9A] hidden md:inline font-jp mt-0.5">
                  {stage.jp}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4-Part Supportive Explanation Box: What Changed → Why It Matters → What Can You Do → Small Step */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5 bg-[#FAF9F5] rounded-xl p-4 border border-kizunaBorder mb-5 relative z-10">
        {/* Step 1: What Changed */}
        <div className="bg-white p-4 rounded-lg border border-[#E8F1EE] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-mizu-800 text-[15px] font-bold mb-2 font-sans">
              <span className="w-5 h-5 rounded-full bg-mizu-100 text-mizu-800 flex items-center justify-center text-[11px] font-bold flex-shrink-0">
                1
              </span>
              <span>What Changed?</span>
            </div>
            <p className="text-[14.5px] text-primaryText leading-relaxed">
              {whatChanged}
            </p>
          </div>
        </div>

        {/* Step 2: Why It Matters */}
        <div className="bg-white p-4 rounded-lg border border-[#E8F1EE] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-mizu-800 text-[15px] font-bold mb-2 font-sans">
              <span className="w-5 h-5 rounded-full bg-mizu-100 text-mizu-800 flex items-center justify-center text-[11px] font-bold flex-shrink-0">
                2
              </span>
              <span>Why Does It Matter?</span>
            </div>
            <p className="text-[14.5px] text-primaryText leading-relaxed">
              {whyItMatters}
            </p>
          </div>
        </div>

        {/* Step 3: What Can You Do */}
        <div className="bg-white p-4 rounded-lg border border-[#E8F1EE] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-mizu-800 text-[15px] font-bold mb-2 font-sans">
              <span className="w-5 h-5 rounded-full bg-mizu-100 text-mizu-800 flex items-center justify-center text-[11px] font-bold flex-shrink-0">
                3
              </span>
              <span>What Can You Do?</span>
            </div>
            <p className="text-[14.5px] text-primaryText leading-relaxed">
              {whatCanYouDo}
            </p>
          </div>
        </div>

        {/* Step 4: Recommended Small Step */}
        <div className="bg-mizu-50/80 p-4 rounded-lg border border-mizu-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-mizu-900 text-[15px] font-bold mb-2 font-sans">
              <span className="w-5 h-5 rounded-full bg-mizu-700 text-white flex items-center justify-center text-[11px] font-bold flex-shrink-0">
                4
              </span>
              <span>Recommended Small Step</span>
            </div>
            <p className="text-[14.5px] text-mizu-900 font-semibold leading-relaxed">
              {recommendedSmallStep}
            </p>
          </div>
        </div>
      </div>

      {/* Action Footer & Progress Tracker */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-kizunaBorder/60 relative z-10">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="w-36 bg-[#E8F1EE] rounded-full h-2.5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="bg-gradient-to-r from-mizu-700 to-matcha h-2.5 rounded-full"
            />
          </div>
          <span className="text-[13.5px] text-secondaryText font-medium">
            {progressPercent}% Toward Rhythm Resolution
          </span>
        </div>

        {onTakeAction && (
          <motion.button
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            onClick={onTakeAction}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-mizu-700 hover:bg-mizu-800 text-white text-[15px] font-semibold shadow-sm hover:shadow transition-all flex items-center justify-center space-x-2 group cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-mizu-200 group-hover:rotate-12 transition-transform" />
            <span>{actionButtonText}</span>
            <ArrowRight className="w-4 h-4 text-white/80 group-hover:translate-x-0.5 transition-transform" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};
