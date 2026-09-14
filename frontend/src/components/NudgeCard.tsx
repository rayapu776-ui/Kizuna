import React, { useState } from "react";
import {
  CheckCircle2,
  Clock,
  Footprints,
  Send,
  Eye,
  Palette,
  Check,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BehavioralNudge } from "../types";

interface NudgeCardProps {
  nudge: BehavioralNudge;
  onComplete: (nudgeId: number, reflection: string) => void;
  onSkip: (nudgeId: number) => void;
}

export const NudgeCard: React.FC<NudgeCardProps> = ({
  nudge,
  onComplete,
  onSkip,
}) => {
  const [isReflecting, setIsReflecting] = useState(false);
  const [reflection, setReflection] = useState("");

  const categoryMeta = {
    physical: {
      icon: Footprints,
      color: "text-mizu-800 bg-mizu-50 border-mizu-200",
      label: "Physical Mobility",
      jpLabel: "身体活性",
    },
    social_micro: {
      icon: Send,
      color: "text-mizu-800 bg-mizu-50 border-mizu-200",
      label: "Micro Social Bridge",
      jpLabel: "対人微接触",
    },
    sensory: {
      icon: Eye,
      color: "text-amber-600 bg-amber-50 border-amber-200",
      label: "Sensory Grounding",
      jpLabel: "五感調律",
    },
    hobby: {
      icon: Palette,
      color: "text-matcha-700 bg-matcha-50 border-matcha-200",
      label: "Tactile Real-World Step",
      jpLabel: "触覚・行動",
    },
  }[nudge.category] || {
    icon: Sparkles,
    color: "text-mizu-800 bg-mizu-50 border-mizu-200",
    label: "Grounded Action",
    jpLabel: "行動活性",
  };

  const Icon = categoryMeta.icon;
  const isCompleted = nudge.status === "completed";

  const handleFinish = () => {
    onComplete(nudge.id, reflection);
    setIsReflecting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`p-4 rounded-2xl border transition-all ${
        isCompleted
          ? "bg-matcha-50/50 border-matcha-200 shadow-xs"
          : "calm-surface calm-surface-hover shadow-calm"
      }`}
    >
      {/* Header & Category Badges */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2.5">
          <span
            className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[12px] font-semibold border ${categoryMeta.color}`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{categoryMeta.label}</span>
            <span className="font-jp text-[11px] opacity-80">
              ({categoryMeta.jpLabel})
            </span>
          </span>

          <span className="flex items-center space-x-1 text-[12.5px] text-secondaryText font-medium">
            <Clock className="w-3.5 h-3.5 text-[#8B9E9A]" />
            <span>{nudge.estimated_minutes} min</span>
          </span>
        </div>

        {/* Graduated Difficulty Pill */}
        <span className="text-[12px] px-2.5 py-0.5 rounded-full bg-[#FAF9F5] border border-kizunaBorder text-secondaryText font-medium">
          Step Level {nudge.graduated_difficulty || 1}
        </span>
      </div>

      {/* Title & Description */}
      <h4
        className={`text-[17px] sm:text-[18px] font-bold text-primaryText mb-1.5 leading-snug font-sans ${
          isCompleted ? "line-through text-secondaryText" : ""
        }`}
      >
        {nudge.title}
      </h4>
      <p className="text-[15px] text-secondaryText leading-relaxed mb-3">
        {nudge.description}
      </p>

      {/* Rationale / Context Box */}
      <div className="p-3 rounded-xl bg-[#FAF9F5] border border-kizunaBorder/70 text-[13px] text-secondaryText mb-3.5 flex items-start space-x-2">
        <span className="font-semibold text-mizu-800 whitespace-nowrap">
          Why recommended:
        </span>
        <span className="leading-relaxed text-primaryText">
          {nudge.rationale}
        </span>
      </div>

      {/* Completion Feedback or Action Buttons */}
      {isCompleted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-center space-x-2 p-3 rounded-xl bg-matcha-100 border border-matcha-200 text-[14px] text-matcha-800 font-semibold"
        >
          <CheckCircle2 className="w-4 h-4 text-matcha stroke-[2.5]" />
          <span>
            Step Completed
            {nudge.user_reflection
              ? `: "${nudge.user_reflection}"`
              : " — Gentle progress made today!"}
          </span>
        </motion.div>
      ) : isReflecting ? (
        <div className="space-y-2.5 pt-2 border-t border-kizunaBorder/60">
          <label className="block text-[13px] font-medium text-secondaryText">
            One short reflection (いかがでしたか？)
          </label>
          <input
            type="text"
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="e.g. Fresh air felt good; my head feels slightly clearer."
            className="w-full px-3.5 py-2 rounded-xl bg-white border border-kizunaBorder text-[14px] text-primaryText placeholder-[#8B9E9A] focus:outline-none focus:ring-2 focus:ring-mizu-500/20 focus:border-mizu-600"
          />
          <div className="flex items-center justify-end space-x-2.5">
            <button
              onClick={() => setIsReflecting(false)}
              className="px-3.5 py-1.5 rounded-lg text-[13.5px] font-medium text-secondaryText hover:text-primaryText cursor-pointer"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleFinish}
              className="px-4 py-2 rounded-xl bg-mizu-700 hover:bg-mizu-800 text-white text-[14.5px] font-semibold shadow-xs flex items-center space-x-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save Progress</span>
            </motion.button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between pt-2.5 border-t border-kizunaBorder/60">
          <button
            onClick={() => onSkip(nudge.id)}
            className="text-[13.5px] text-secondaryText hover:text-primaryText transition-colors cursor-pointer font-medium"
          >
            Save for later
          </button>
          <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsReflecting(true)}
            className="px-4.5 py-2 rounded-xl bg-mizu-700 hover:bg-mizu-800 text-white text-[14.5px] font-semibold shadow-xs flex items-center space-x-2 transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Mark Step Done</span>
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};
