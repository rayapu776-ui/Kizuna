import React, { useState, useEffect } from "react";
import {
  Compass,
  Sparkles,
  Footprints,
  Calendar,
  TrendingDown,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Clock,
  Heart,
  Smartphone,
  MapPin,
  Moon,
  Activity,
  Check,
  HeartHandshake,
  Lock,
  Phone,
  MessageCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { RiskScoreCard } from "../components/RiskScoreCard";
import { NudgeCard } from "../components/NudgeCard";
import { ProblemSolvingJourney } from "../components/ProblemSolvingJourney";
import {
  RiskAssessment,
  TelemetryDaily,
  TelemetryDifferential,
  BehavioralNudge,
  EMACheckin,
  User,
} from "../types";
import { api } from "../utils/api";

interface YouthDashboardProps {
  currentUser: User | null;
  onOpenCheckin: () => void;
}

export const YouthDashboard: React.FC<YouthDashboardProps> = ({
  currentUser,
  onOpenCheckin,
}) => {
  const [risk, setRisk] = useState<RiskAssessment | null>(null);
  const [telemetry, setTelemetry] = useState<TelemetryDaily[]>([]);
  const [differentials, setDifferentials] = useState<TelemetryDifferential[]>(
    [],
  );
  const [nudges, setNudges] = useState<BehavioralNudge[]>([]);
  const [emaHistory, setEmaHistory] = useState<EMACheckin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [currentUser]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [r, t, d, n, e] = await Promise.all([
        api.getLatestRisk(),
        api.getTelemetryHistory(30),
        api.getDifferentials(),
        api.getNudges(),
        api.getEMAHistory(),
      ]);
      setRisk(r);
      setTelemetry(t);
      setDifferentials(d);
      setNudges(n);
      setEmaHistory(e);
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNudgeComplete = async (nudgeId: number, reflection: string) => {
    try {
      await api.updateNudge(nudgeId, "completed", reflection);
      const updated = await api.getNudges();
      setNudges(updated);
    } catch (err) {
      console.error("Failed to complete nudge", err);
    }
  };

  const handleNudgeSkip = async (nudgeId: number) => {
    try {
      await api.updateNudge(nudgeId, "skipped");
      const updated = await api.getNudges();
      setNudges(updated);
    } catch (err) {
      console.error("Failed to skip nudge", err);
    }
  };

  const chartData = telemetry.map((item) => ({
    date: item.log_date ? item.log_date.slice(5) : "",
    entropy: Math.round(item.location_entropy * 100),
    radius: Math.round(item.radius_of_gyration_km * 10) / 10,
    screenTime: Math.round(item.total_screen_time_hours * 10) / 10,
    nightScreen: Math.round(item.late_night_screen_hours * 10) / 10,
    sleepMid: item.sleep_midpoint_hour,
  }));

  const pendingNudges = nudges.filter((n) => n.status === "pending");
  const completedNudges = nudges.filter((n) => n.status === "completed");

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pb-12"
    >
      {/* 1. Calm Welcome Area */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-kizunaBorder/80 pb-5">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-[30px] sm:text-[34px] font-bold tracking-tight text-primaryText font-sans leading-tight">
              {currentUser?.full_name
                ? `${currentUser.full_name}'s Sanctuary`
                : "Ren Sato's Sanctuary"}
            </h1>
            <span className="hanko-seal text-[12px] px-2 py-0.5">
              安心居場所
            </span>
          </div>
          <p className="text-[15px] text-secondaryText mt-1.5 font-sans">
            Welcome back • Take today one small step at a time • 100% on-device
            privacy
          </p>
        </div>

        {/* Quick Check-in Prompt */}
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenCheckin}
            className="px-4.5 py-2.5 rounded-xl bg-mizu-700 hover:bg-mizu-800 text-white text-[14.5px] font-semibold shadow-xs flex items-center space-x-2 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-mizu-200" />
            <span>Today's 10-Second Reflection</span>
          </motion.button>
        </div>
      </div>

      {/* 2 & 3 & 4 & 5. Problem-Solving Journey: What Changed → Why It Matters → What Can You Do → Small Step */}
      <ProblemSolvingJourney
        currentStage={
          completedNudges.length > 0
            ? "progress"
            : pendingNudges.length > 0
              ? "action_ready"
              : "recommended"
        }
        whatChanged="Your physical mobility has decreased over the last two weeks, and sleep timing shifted later."
        whyItMatters="Late-night digital wakefulness delays melatonin, which can make daytime energy feel drained."
        whatCanYouDo="A 10-minute walk outside or opening your window to morning light gently resets your circadian clock."
        recommendedSmallStep="Step out for 5 minutes or enjoy a cup of warm tea by an open window."
        actionButtonText="Try This Small Step (5 Mins)"
        onTakeAction={() => {
          window.scrollTo({ top: 650, behavior: "smooth" });
        }}
        progressPercent={Math.min(
          100,
          Math.max(35, completedNudges.length * 30 + 35),
        )}
        statusContextLabel="Observing Rhythm — Responsive to Small Steps"
        statusTier="attention"
      />

      {/* 2. Current Status & Interpretable Risk Card + 6. Today's Progress / Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Wellbeing Index & TreeSHAP (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <RiskScoreCard assessment={risk} loading={loading} />

          {/* Differential Telemetry Indicators */}
          <div className="calm-surface p-6 shadow-calm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-bold uppercase tracking-wider text-mizu-900 font-sans">
                Behavioral Shifts (Vs. 14-Day Baseline)
              </h3>
              <span className="text-[12px] text-secondaryText">
                Personalized Baselines
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {differentials.map((diff, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#FAF9F5] border border-kizunaBorder/70"
                >
                  <span className="text-[13px] text-secondaryText font-medium block mb-1">
                    {diff.metric_name}
                  </span>
                  <div className="flex items-baseline space-x-1.5">
                    <span className="text-[24px] font-bold text-primaryText font-mono tabular-nums">
                      {diff.current_avg}
                    </span>
                    <span className="text-[12px] text-secondaryText font-mono">
                      base: {diff.previous_avg}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-[13px] font-semibold text-mizu-800 mt-1 font-mono">
                    {diff.percentage_change > 0 ? (
                      <TrendingUp className="w-3.5 h-3.5 text-mizu-700" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5 text-matcha" />
                    )}
                    <span>
                      {diff.percentage_change > 0 ? "+" : ""}
                      {Math.round(diff.percentage_change)}% shift
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Recommended Small Steps + 6. Today's Progress (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="calm-surface p-6 shadow-calm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4.5 h-4.5 text-mizu-700" />
                <h3 className="text-[18px] font-bold text-primaryText font-sans">
                  Gentle Steps Forward (一歩一歩)
                </h3>
              </div>
              <span className="text-[12px] px-2.5 py-0.5 rounded-full bg-mizu-50 border border-mizu-200 text-mizu-800 font-medium">
                {pendingNudges.length} Available
              </span>
            </div>

            <p className="text-[14.5px] text-secondaryText mb-4 leading-relaxed">
              No pressure or obligations. These micro-levers take 2 to 5 minutes
              to gently activate your senses in the real world.
            </p>

            <div className="space-y-3.5">
              {pendingNudges.length > 0 ? (
                pendingNudges.map((nudge) => (
                  <NudgeCard
                    key={nudge.id}
                    nudge={nudge}
                    onComplete={handleNudgeComplete}
                    onSkip={handleNudgeSkip}
                  />
                ))
              ) : (
                <div className="p-6 rounded-xl bg-matcha-50 border border-matcha-200 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-matcha mx-auto stroke-[2.5]" />
                  <h4 className="text-[16px] font-bold text-matcha-800 font-sans">
                    All Small Steps Completed Today!
                  </h4>
                  <p className="text-[13px] text-secondaryText">
                    You have taken gentle, meaningful action. Rest comfortably.
                  </p>
                </div>
              )}
            </div>

            {/* 6. Today's Progress / Completed History */}
            {completedNudges.length > 0 && (
              <div className="mt-5 pt-4 border-t border-kizunaBorder/60">
                <span className="text-[12px] font-bold text-secondaryText uppercase tracking-wider block mb-2">
                  Completed This Week ({completedNudges.length})
                </span>
                <div className="space-y-2">
                  {completedNudges.slice(0, 3).map((nudge) => (
                    <div
                      key={nudge.id}
                      className="p-3 rounded-lg bg-[#FAF9F5] border border-kizunaBorder/80 text-[14px] flex items-center justify-between text-primaryText"
                    >
                      <div className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-matcha stroke-[2.5] flex-shrink-0" />
                        <span className="font-medium line-through text-secondaryText">
                          {nudge.title}
                        </span>
                      </div>
                      <span className="text-[12px] text-matcha-700 font-bold">
                        Done
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 7. Human Connection & Support (Section 10 Requirement) */}
          <div className="calm-surface p-6 shadow-calm space-y-3.5 bg-gradient-to-br from-white to-[#FAF9F5]">
            <div className="flex items-center space-x-2 border-b border-kizunaBorder/60 pb-3">
              <HeartHandshake className="w-4.5 h-4.5 text-mizu-700" />
              <h3 className="text-[14px] font-bold text-primaryText uppercase tracking-wider font-sans">
                Human Connection (人の絆)
              </h3>
            </div>
            <p className="text-[14.5px] text-secondaryText leading-relaxed">
              <strong className="text-primaryText font-semibold">
                “Technology helps us notice. Humans help us connect.”
              </strong>{" "}
              Kizuna is never an artificial replacement for human warmth. When
              you are ready, gentle bridges are open.
            </p>
            <div className="grid grid-cols-2 gap-2.5 pt-1 text-[14px]">
              <div className="p-3 rounded-xl bg-white border border-kizunaBorder flex items-center space-x-2.5">
                <Heart className="w-4 h-4 text-mizu-600 flex-shrink-0" />
                <span className="font-semibold text-primaryText">
                  Keiko (Mother)
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-kizunaBorder flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-matcha flex-shrink-0" />
                <span className="font-semibold text-primaryText">
                  Youth Net Bridge
                </span>
              </div>
            </div>
          </div>

          {/* 8. Privacy & Consent Notice (Section 9 Requirement) */}
          <div className="p-4 rounded-2xl bg-mizu-50/70 border border-mizu-200 flex items-start space-x-3">
            <ShieldCheck className="w-4.5 h-4.5 text-mizu-700 flex-shrink-0 mt-0.5" />
            <div className="text-[13.5px] text-mizu-900 leading-relaxed">
              <span className="font-bold">Sovereign Privacy Guard: </span>
              <span>
                Your data is processed on-device. Your family cannot read
                messages or track GPS points. You maintain total opt-in control.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 30-Day Longitudinal Rhythm Trends */}
      <div className="calm-surface p-6 shadow-calm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-[18px] font-bold text-primaryText font-sans">
              30-Day Longitudinal Rhythm Trends
            </h3>
            <p className="text-[13.5px] text-secondaryText mt-0.5">
              Passive sensor metrics tracked on-device with zero surveillance
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1.5 text-[13px] text-mizu-700 font-medium">
              <span className="w-3 h-3 rounded-full bg-mizu-700 inline-block" />
              <span>Location Entropy</span>
            </span>
            <span className="inline-flex items-center space-x-1.5 text-[13px] text-matcha font-medium ml-3">
              <span className="w-3 h-3 rounded-full bg-matcha inline-block" />
              <span>Screen Hours</span>
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="mizuGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#167D78" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#167D78" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="matchaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5F8F6B" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#5F8F6B" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8F1EE" />
              <XAxis dataKey="date" stroke="#8B9E9A" fontSize={12} />
              <YAxis stroke="#8B9E9A" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderColor: "#d8e7e3",
                  borderRadius: "12px",
                  boxShadow: "0 8px 16px -4px rgba(22,125,120,0.08)",
                  fontSize: "13px",
                  color: "#193B37",
                }}
              />
              <Area
                type="monotone"
                dataKey="entropy"
                stroke="#167D78"
                strokeWidth={2}
                fill="url(#mizuGrad)"
                name="Location Entropy Index"
              />
              <Area
                type="monotone"
                dataKey="screenTime"
                stroke="#5F8F6B"
                strokeWidth={2}
                fill="url(#matchaGrad)"
                name="Screen Time (Hrs)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};
