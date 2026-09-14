import React, { useState, useEffect } from "react";
import {
  HeartHandshake,
  ShieldCheck,
  Check,
  Sparkles,
  ArrowUpRight,
  Heart,
  CheckCircle2,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { CraftFramework } from "../components/CraftFramework";
import { ProblemSolvingJourney } from "../components/ProblemSolvingJourney";
import { api } from "../utils/api";
import { User } from "../types";

interface CaregiverPortalProps {
  currentUser: User | null;
  onNavigateToSupport?: () => void;
}

export const CaregiverPortal: React.FC<CaregiverPortalProps> = ({
  currentUser,
  onNavigateToSupport,
}) => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCaregiverData();
  }, [currentUser]);

  const loadCaregiverData = async () => {
    setLoading(true);
    try {
      const data = await api.getCaregiverDashboardView();
      setDashboardData(data);
    } catch (err) {
      console.error("Failed to load caregiver data", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !dashboardData) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-64 bg-[#E8F1EE] rounded"></div>
        <div className="h-44 bg-[#FAF9F5] rounded-2xl"></div>
      </div>
    );
  }

  const status = dashboardData.consented_status;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pb-12"
    >
      {/* Title & Caregiver Context */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-kizunaBorder/80 pb-5">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-[30px] sm:text-[34px] font-bold tracking-tight text-primaryText font-sans leading-tight">
              Caregiver Bridge Portal
            </h1>
            <span className="hanko-seal text-[12px] px-2 py-0.5">
              家族対話架橋
            </span>
          </div>
          <p className="text-[15px] text-secondaryText mt-1.5 font-sans">
            Supporting:{" "}
            <strong className="text-primaryText font-semibold">
              {dashboardData.youth_name}
            </strong>{" "}
            ({dashboardData.relationship}) • CRAFT & MHFA Non-Alarmist Guidance
          </p>
        </div>

        {onNavigateToSupport && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onNavigateToSupport}
            className="px-4.5 py-2.5 rounded-xl bg-white border border-kizunaBorder hover:border-mizu-400 text-[14px] font-semibold text-primaryText hover:text-mizu-800 flex items-center space-x-2 transition-all shadow-calm cursor-pointer"
          >
            <span>Verified Support Centers Directory</span>
            <ArrowUpRight className="w-4 h-4 text-mizu-700" />
          </motion.button>
        )}
      </div>

      {/* Problem-Solving Journey for Caregivers (Section 8 Pattern) */}
      <ProblemSolvingJourney
        currentStage="human_support"
        whatChanged="Something has changed: Ren's daily pattern has shifted toward quiet room hours and later sleep."
        whyItMatters="Here is what we are noticing: Demanding immediate confrontation increases retreat; gentle, low-pressure presence builds trust."
        whatCanYouDo="Here is a gentle way to approach: Use CRAFT positive reinforcement—notice small efforts and maintain calm warmth."
        recommendedSmallStep="Support is available: Send a gentle tea invitation without asking questions or requiring a response."
        actionButtonText="Send Low-Pressure Tea Invitation"
        onTakeAction={() => {
          window.scrollTo({ top: 750, behavior: "smooth" });
        }}
        progressPercent={65}
        statusContextLabel="Observation & Gentle Bridge Phase"
        statusTier="attention"
      />

      {/* Consented Family Health Overview */}
      <div className="calm-surface p-6 shadow-calm space-y-4">
        <div className="flex items-center justify-between border-b border-kizunaBorder/60 pb-3.5">
          <div className="flex items-center space-x-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-mizu-700" />
            <h3 className="text-[18px] font-bold text-primaryText font-sans">
              Consented Family Health Overview (合意済み共有状況)
            </h3>
          </div>
          <span className="text-[12px] text-secondaryText font-mono px-2.5 py-0.5 rounded-full bg-[#FAF9F5] border border-kizunaBorder">
            Updated Today
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Status Band */}
          <div className="p-4.5 rounded-xl bg-[#FAF9F5] border border-kizunaBorder flex flex-col justify-between">
            <div>
              <div className="text-[12px] font-bold text-secondaryText uppercase tracking-wider mb-1.5 font-sans">
                Current Routine Status (現状区分)
              </div>
              <div className="text-[20px] font-bold text-mizu-800 font-sans">
                {status.risk_band}
              </div>
            </div>
            <p className="text-[13.5px] text-secondaryText mt-2.5 leading-relaxed">
              {status.guidance_lead}
            </p>
          </div>

          {/* Consented Plain Language Note */}
          <div className="p-4.5 rounded-xl bg-[#FAF9F5] border border-kizunaBorder flex flex-col justify-between">
            <div>
              <div className="text-[12px] font-bold text-secondaryText uppercase tracking-wider mb-1.5 font-sans">
                Constructive Behavioral Note (行動所見)
              </div>
              <div className="text-[14px] text-primaryText leading-relaxed italic">
                {status.consented_insights?.summary
                  ? `"${status.consented_insights.summary}"`
                  : "General behavioral trends remain within quiet room boundaries."}
              </div>
            </div>
            <div className="text-[12px] text-mizu-700 mt-2.5 font-jp font-medium">
              Shared with Ren's voluntary consent
            </div>
          </div>

          {/* Forward Micro-Steps Completed */}
          <div className="p-4.5 rounded-xl bg-matcha-50/70 border border-matcha-200 flex flex-col justify-between">
            <div>
              <div className="text-[12px] font-bold text-matcha-800 uppercase tracking-wider mb-1.5 font-sans">
                Positive Forward Steps (前進の軌跡)
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-[32px] font-bold text-matcha-700 font-mono tabular-nums leading-none">
                  {status.completed_forward_steps !== null
                    ? status.completed_forward_steps
                    : 2}
                </span>
                <span className="text-[13.5px] text-matcha-800 font-medium">
                  micro-actions completed this week
                </span>
              </div>
            </div>
            <p className="text-[13.5px] text-matcha-800 mt-2.5 leading-relaxed">
              Reinforce these small wins with genuine, low-pressure praise.
            </p>
          </div>
        </div>
      </div>

      {/* Embedded CRAFT Protocol & Gentle Family Invitations */}
      <CraftFramework
        craftData={dashboardData.craft_framework}
        consentedStatus={dashboardData.consented_status}
        onInviteSent={() => loadCaregiverData()}
      />
    </motion.div>
  );
};
