import React, { useState } from "react";
import {
  HeartHandshake,
  CheckCircle,
  XCircle,
  Send,
  Utensils,
  Car,
  Coffee,
  Sparkles,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";
import { api } from "../utils/api";

interface CraftFrameworkProps {
  craftData: any;
  consentedStatus: any;
  onInviteSent?: () => void;
}

export const CraftFramework: React.FC<CraftFrameworkProps> = ({
  craftData,
  consentedStatus,
  onInviteSent,
}) => {
  const [activePillar, setActivePillar] = useState<number>(1);
  const [selectedInvite, setSelectedInvite] = useState<string>("food_shared");
  const [customMsg, setCustomMsg] = useState<string>("");
  const [inviteStatus, setInviteStatus] = useState<string | null>(null);
  const [sendingInvite, setSendingInvite] = useState(false);

  const pillars = craftData?.framework_overview?.core_pillars || [];
  const scripts = craftData?.dialogue_coaching || [];

  const handleSendInvite = async () => {
    setSendingInvite(true);
    try {
      const res = await api.sendCaregiverInvite(selectedInvite, customMsg);
      setInviteStatus(res.message);
      setTimeout(() => setInviteStatus(null), 4000);
      setCustomMsg("");
      if (onInviteSent) onInviteSent();
    } catch (err) {
      console.error("Failed to send invite", err);
    } finally {
      setSendingInvite(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 5-Stage Gentle Caregiver Cycle: OBSERVE → UNDERSTAND → APPROACH GENTLY → SUPPORT → CONNECT */}
      <div className="calm-surface p-6 shadow-calm">
        <div className="flex items-center justify-between mb-4 border-b border-kizunaBorder/60 pb-3.5">
          <span className="text-[13.5px] font-bold uppercase tracking-wider text-mizu-800 font-sans">
            Caregiver Guidance Cycle (OBSERVE → UNDERSTAND → APPROACH → SUPPORT
            → CONNECT)
          </span>
          <span className="hanko-seal text-[12px] px-2 py-0.5">
            寄り添いの道
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-4">
          {pillars.map((p: any) => {
            const isActive = activePillar === p.stage;
            return (
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                key={p.stage}
                onClick={() => setActivePillar(p.stage)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isActive
                    ? "bg-mizu-700 text-white border-mizu-700 shadow-xs"
                    : "bg-[#FAF9F5] border-kizunaBorder text-secondaryText hover:bg-mizu-50 hover:text-mizu-900"
                }`}
              >
                <div
                  className={`text-[12px] font-bold uppercase ${
                    isActive ? "text-mizu-200" : "text-mizu-700"
                  }`}
                >
                  Stage {p.stage}
                </div>
                <div className="text-[14px] font-bold truncate mt-0.5 font-sans">
                  {p.name}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Active Stage Body */}
        {pillars.find((p: any) => p.stage === activePillar) && (
          <div className="p-5 rounded-xl bg-[#FAF9F5] border border-kizunaBorder space-y-3.5">
            <div className="flex items-center space-x-2.5">
              <span className="w-7 h-7 rounded-full bg-mizu-100 text-mizu-800 font-bold text-[13px] flex items-center justify-center">
                {activePillar}
              </span>
              <h4 className="text-[18px] font-bold text-primaryText font-sans">
                {pillars.find((p: any) => p.stage === activePillar)?.name}
              </h4>
            </div>
            <p className="text-[15px] text-secondaryText leading-relaxed">
              {pillars.find((p: any) => p.stage === activePillar)?.purpose}
            </p>

            <div className="pt-3 border-t border-kizunaBorder/60">
              <span className="text-[13px] font-bold text-mizu-900 uppercase tracking-wider font-sans">
                Gentle Actions for Parents & Families:
              </span>
              <ul className="mt-2.5 space-y-2 text-[14px] text-primaryText">
                {pillars
                  .find((p: any) => p.stage === activePillar)
                  ?.action_steps.map((step: string, i: number) => (
                    <li key={i} className="flex items-start space-x-2.5">
                      <CheckCircle className="w-4 h-4 text-matcha flex-shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* "Say This, Not That" Practical Scripts */}
      <div className="calm-surface p-6 shadow-calm">
        <div className="flex items-center justify-between mb-4 pb-3.5 border-b border-kizunaBorder/60">
          <div>
            <h4 className="text-[18px] font-bold text-primaryText font-sans">
              "Say This, Not That" Practical Guidance
            </h4>
            <p className="text-[13px] text-secondaryText mt-0.5">
              Clinical CRAFT phrasing: de-escalate defensiveness and nurture
              relational safety
            </p>
          </div>
          <span className="hanko-seal text-[12px] px-2 py-0.5">対話処方箋</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scripts.map((item: any, idx: number) => (
            <div
              key={idx}
              className="p-4.5 rounded-xl border border-kizunaBorder bg-white space-y-3.5"
            >
              <div className="text-[13.5px] font-bold text-mizu-800 uppercase tracking-wider font-sans">
                Scenario: {item.scenario}
              </div>

              {/* Avoid Saying (Soft Amber) */}
              <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200">
                <div className="flex items-center space-x-1.5 text-[12.5px] font-semibold text-amber-600 mb-1">
                  <XCircle className="w-4 h-4 text-amber-500" />
                  <span>Phrasing that triggers withdrawal:</span>
                </div>
                <p className="text-[14.5px] text-primaryText italic font-sans font-medium leading-relaxed">
                  "{item.avoid_phrase}"
                </p>
              </div>

              {/* Try Saying Instead (Matcha Green) */}
              <div className="p-3.5 rounded-lg bg-matcha-50 border border-matcha-200">
                <div className="flex items-center space-x-1.5 text-[12.5px] font-semibold text-matcha-700 mb-1">
                  <CheckCircle className="w-4 h-4 text-matcha" />
                  <span>Gentle bridge phrasing:</span>
                </div>
                <p className="text-[14.5px] text-primaryText italic font-sans font-medium leading-relaxed">
                  "{item.recommended_phrase}"
                </p>
              </div>

              <div className="text-[13px] text-secondaryText bg-[#FAF9F5] p-3 rounded-lg border border-kizunaBorder/60 leading-relaxed">
                <span className="font-semibold text-primaryText">
                  Why this works:{" "}
                </span>
                {item.clinical_rationale}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gentle Parental Invitation Dispatcher */}
      <div className="calm-surface p-6 shadow-calm">
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-kizunaBorder/60">
          <div className="flex items-center space-x-2.5">
            <Sparkles className="w-4.5 h-4.5 text-mizu-700" />
            <h4 className="text-[18px] font-bold text-primaryText font-sans">
              Send a Low-Pressure Invitation
            </h4>
          </div>
          <span className="text-[12px] text-secondaryText font-medium bg-[#FAF9F5] px-2.5 py-0.5 rounded-full border border-kizunaBorder">
            Zero Obligation
          </span>
        </div>

        <p className="text-[14.5px] text-secondaryText mb-4 leading-relaxed">
          Send a gentle invitation to Ren's sanctuary dashboard. The invitation
          explicitly requires no immediate conversation or response.
        </p>

        {inviteStatus && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 mb-4 rounded-xl bg-matcha-100 text-matcha-800 text-[14px] font-semibold flex items-center space-x-2 border border-matcha-200"
          >
            <Check className="w-4 h-4 text-matcha" />
            <span>{inviteStatus}</span>
          </motion.div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-4">
          <button
            type="button"
            onClick={() => setSelectedInvite("food_shared")}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              selectedInvite === "food_shared"
                ? "bg-mizu-50 border-mizu-600 text-mizu-900 shadow-xs"
                : "bg-[#FAF9F5] border-kizunaBorder text-secondaryText hover:bg-white"
            }`}
          >
            <Utensils className="w-4.5 h-4.5 text-mizu-700 mb-2" />
            <div className="text-[14.5px] font-bold text-primaryText font-sans">
              Leaving Warm Tea / Food
            </div>
            <div className="text-[12.5px] text-secondaryText mt-1 leading-relaxed">
              "Left some warm dinner outside your door. Enjoy whenever ready."
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedInvite("silent_drive")}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              selectedInvite === "silent_drive"
                ? "bg-mizu-50 border-mizu-600 text-mizu-900 shadow-xs"
                : "bg-[#FAF9F5] border-kizunaBorder text-secondaryText hover:bg-white"
            }`}
          >
            <Car className="w-4.5 h-4.5 text-mizu-700 mb-2" />
            <div className="text-[14.5px] font-bold text-primaryText font-sans">
              Silent Fresh Air Ride
            </div>
            <div className="text-[12.5px] text-secondaryText mt-1 leading-relaxed">
              "Going to the store. You can just sit quietly if you want fresh
              air."
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedInvite("quiet_presence")}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              selectedInvite === "quiet_presence"
                ? "bg-mizu-50 border-mizu-600 text-mizu-900 shadow-xs"
                : "bg-[#FAF9F5] border-kizunaBorder text-secondaryText hover:bg-white"
            }`}
          >
            <Coffee className="w-4.5 h-4.5 text-mizu-700 mb-2" />
            <div className="text-[14.5px] font-bold text-primaryText font-sans">
              Quiet Shared Space
            </div>
            <div className="text-[12.5px] text-secondaryText mt-1 leading-relaxed">
              "I am reading downstairs. Feel free to come down anytime."
            </div>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <input
            type="text"
            value={customMsg}
            onChange={(e) => setCustomMsg(e.target.value)}
            placeholder="Add an optional warm personal note (e.g. 'Your favorite tea is in the cup')..."
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-kizunaBorder text-[14px] text-primaryText placeholder-[#8B9E9A] focus:outline-none focus:ring-2 focus:ring-mizu-500/20 focus:border-mizu-600"
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSendInvite}
            disabled={sendingInvite}
            className="px-5 py-2.5 rounded-xl bg-mizu-700 hover:bg-mizu-800 text-white text-[14.5px] font-semibold shadow-xs flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>
              {sendingInvite ? "Sending..." : "Send Gentle Invitation"}
            </span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};
