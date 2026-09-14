import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  Check,
  Sparkles,
  Smartphone,
  MapPin,
  Moon,
  Phone,
  Mic,
  RefreshCw,
} from "lucide-react";
import { motion } from "framer-motion";
import { ConsentSetting, WhatCaregiverSeesPreview } from "../types";
import { api } from "../utils/api";

interface ConsentMatrixProps {
  onSettingsSaved?: () => void;
}

export const ConsentMatrix: React.FC<ConsentMatrixProps> = ({
  onSettingsSaved,
}) => {
  const [settings, setSettings] = useState<ConsentSetting | null>(null);
  const [preview, setPreview] = useState<WhatCaregiverSeesPreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [s, p] = await Promise.all([
        api.getConsentSettings(),
        api.getWhatCaregiverSees(),
      ]);
      setSettings(s);
      setPreview(p);
    } catch (err) {
      console.error("Failed to load consent data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (key: keyof ConsentSetting) => {
    if (!settings) return;
    setSettings({
      ...settings,
      [key]: !settings[key],
    });
  };

  const saveSettings = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      await api.updateConsentSettings(settings);
      const updatedPreview = await api.getWhatCaregiverSees();
      setPreview(updatedPreview);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
      if (onSettingsSaved) onSettingsSaved();
    } catch (err) {
      console.error("Failed to update consent", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="calm-surface p-6 animate-pulse">
        <div className="h-6 w-52 bg-[#E8F1EE] rounded mb-4"></div>
        <div className="h-40 w-full bg-[#FAF9F5] rounded-xl"></div>
      </div>
    );
  }

  const streams = [
    {
      key: "share_risk_level" as keyof ConsentSetting,
      label: "General Balance & Status Band",
      jpLabel: "総合生活調和区分",
      desc: "Shares high-level category (Steady Rhythm vs. Quiet Rest Phase) without exposing raw mathematical scores.",
      icon: ShieldCheck,
      recommended: true,
    },
    {
      key: "share_plain_language_summary" as keyof ConsentSetting,
      label: "Constructive Plain-Language Summaries",
      jpLabel: "自然言語による助言要約",
      desc: 'High-level synthesis (e.g., "Taking a restful day indoors") with zero surveillance metrics.',
      icon: Sparkles,
      recommended: true,
    },
    {
      key: "share_nudge_completions" as keyof ConsentSetting,
      label: "Completed Micro-Step Milestones",
      jpLabel: "達成した微小行動",
      desc: "Displays completed small steps (e.g., 5-minute morning fresh air walk) to reassure your family.",
      icon: Check,
      recommended: true,
    },
    {
      key: "share_subscores" as keyof ConsentSetting,
      label: "Domain Subscores (Mobility, Sleep, Social, Digital %)",
      jpLabel: "領域別調和サブスコア",
      desc: "Four category percentage meters for rhythm balance.",
      icon: Eye,
      recommended: false,
    },
    {
      key: "share_exact_screen_time" as keyof ConsentSetting,
      label: "Raw Screen Time & Application Usage",
      jpLabel: "端末利用時間・アプリ履歴",
      desc: "Hour-by-hour logs of screen time and individual apps.",
      icon: Smartphone,
      recommended: false,
    },
    {
      key: "share_location_entropy" as keyof ConsentSetting,
      label: "GPS Coordinates & Location Entropy",
      jpLabel: "GPS位置情報・移動エントロピー",
      desc: "Geographical locations, map points, and travel radiuses.",
      icon: MapPin,
      recommended: false,
    },
    {
      key: "share_sleep_timing" as keyof ConsentSetting,
      label: "Sleep & Wake Timestamp Logs",
      jpLabel: "就寝・起床タイムスタンプ",
      desc: "Exact hour timestamps of when you slept or awoke.",
      icon: Moon,
      recommended: false,
    },
    {
      key: "share_social_counts" as keyof ConsentSetting,
      label: "Communication Frequency Counts",
      jpLabel: "通話・メッセージ回数",
      desc: "Count of interactions (never contents or contact identities).",
      icon: Phone,
      recommended: false,
    },
    {
      key: "share_voice_prosody" as keyof ConsentSetting,
      label: "Voice Prosody Affect Metrics",
      jpLabel: "音響韻律・音声特性",
      desc: "Acoustic speech rate and pitch dynamics (never recordings).",
      icon: Mic,
      recommended: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Psychological Reassurance Banner in Soft Mint */}
      <div className="p-5 rounded-2xl bg-mizu-50 border border-mizu-200 flex items-start space-x-4">
        <div className="w-9 h-9 rounded-xl bg-mizu-700 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2.5">
            <h3 className="text-[17px] sm:text-[18px] font-bold text-mizu-900 font-sans">
              Your Data is Handled with Care (自己主権型プライバシー)
            </h3>
            <span className="hanko-seal text-[12px] px-2 py-0.5">完全同意</span>
          </div>
          <p className="text-[15px] text-primaryText mt-1.5 leading-relaxed">
            You hold total sovereign control over your data. Kizuna never acts
            as a surveillance tool: raw GPS coordinates, keystrokes, spoken
            words, and private messages are strictly blocked on-device. Your
            family only sees what you explicitly choose to share.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Sovereign Permission Switches (7 Cols) */}
        <div className="lg:col-span-7 calm-surface p-6 shadow-calm">
          <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-kizunaBorder/60">
            <div>
              <h4 className="text-[18px] font-bold text-primaryText font-sans">
                Granular Privacy Switches
              </h4>
              <p className="text-[13px] text-secondaryText mt-0.5">
                Toggle exactly what is bridged to your caregiver
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={saveSettings}
              disabled={saving}
              className={`px-4.5 py-2.5 rounded-xl text-[14.5px] font-semibold flex items-center space-x-2 transition-all cursor-pointer ${
                savedSuccess
                  ? "bg-matcha text-white shadow-xs"
                  : "bg-mizu-700 hover:bg-mizu-800 text-white shadow-xs"
              }`}
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <RefreshCw
                    className={`w-4 h-4 ${saving ? "animate-spin" : ""}`}
                  />
                  <span>Apply & Save</span>
                </>
              )}
            </motion.button>
          </div>

          <div className="space-y-3.5">
            {streams.map((s) => {
              const Icon = s.icon;
              const isEnabled = Boolean(settings[s.key]);

              return (
                <div
                  key={s.key}
                  className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                    isEnabled
                      ? "bg-mizu-50/40 border-mizu-200"
                      : "bg-[#FAF9F5] border-kizunaBorder/70 opacity-80"
                  }`}
                >
                  <div className="flex items-start space-x-3.5 pr-3">
                    <div
                      className={`p-2.5 rounded-xl mt-0.5 ${
                        isEnabled
                          ? "bg-mizu-100 text-mizu-800"
                          : "bg-[#E8F1EE] text-secondaryText"
                      }`}
                    >
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[14.5px] font-semibold text-primaryText font-sans">
                          {s.label}
                        </span>
                        <span className="text-[12px] text-mizu-700 font-jp font-medium hidden sm:inline">
                          {s.jpLabel}
                        </span>
                        {s.recommended && (
                          <span className="text-[11.5px] px-2 py-0.5 rounded-full bg-matcha-50 text-matcha-700 font-medium border border-matcha-200">
                            Recommended Bridge
                          </span>
                        )}
                      </div>
                      <span className="text-[13.5px] text-secondaryText leading-relaxed mt-1">
                        {s.desc}
                      </span>
                    </div>
                  </div>

                  {/* Smooth Toggle Switch */}
                  <button
                    type="button"
                    onClick={() => handleToggle(s.key)}
                    className={`w-12 h-6.5 flex items-center rounded-full p-1 transition-colors flex-shrink-0 cursor-pointer ${
                      isEnabled ? "bg-mizu-700" : "bg-[#D8E7E3]"
                    }`}
                  >
                    <motion.div
                      layout
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                      className={`bg-white w-4.5 h-4.5 rounded-full shadow-md ${
                        isEnabled ? "ml-auto" : "mr-auto"
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Live "What Caregiver Sees" Preview (5 Cols) */}
        <div className="lg:col-span-5 calm-surface p-6 shadow-calm flex flex-col">
          <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-kizunaBorder/60">
            <div className="flex items-center space-x-2">
              <Eye className="w-4.5 h-4.5 text-mizu-700" />
              <h4 className="text-[18px] font-bold text-primaryText font-sans">
                What Caregiver Sees (Live Mirror)
              </h4>
            </div>
            <span className="text-[12px] px-2.5 py-0.5 rounded-full bg-[#FAF9F5] border border-kizunaBorder text-secondaryText font-medium">
              Caregiver View
            </span>
          </div>

          <p className="text-[14.5px] text-secondaryText mb-4 leading-relaxed">
            This card mirrors the exact screen shown to Keiko Sato (Mother). Any
            sensitive stream you disabled is replaced with a respectful privacy
            seal.
          </p>

          {preview && (
            <div className="flex-1 space-y-3.5 p-4 rounded-2xl bg-[#FAF9F5] border border-kizunaBorder">
              {/* Status Band */}
              <div className="p-3.5 rounded-xl bg-white border border-kizunaBorder">
                <span className="text-[12px] uppercase font-bold text-secondaryText block mb-1">
                  Shared Risk Band
                </span>
                {preview.risk_level_visible ? (
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-mizu-600" />
                    <span className="text-[14px] font-bold text-mizu-800 capitalize">
                      {preview.risk_level_visible} Status
                    </span>
                  </div>
                ) : (
                  <span className="text-[13.5px] text-secondaryText italic flex items-center space-x-1.5">
                    <EyeOff className="w-3.5 h-3.5 text-[#8B9E9A]" />
                    <span>Private — Kept in Sanctuary</span>
                  </span>
                )}
              </div>

              {/* Constructive Plain Language Summary */}
              <div className="p-3.5 rounded-xl bg-white border border-kizunaBorder">
                <span className="text-[12px] uppercase font-bold text-secondaryText block mb-1">
                  Plain-Language Summary
                </span>
                {preview.plain_summary_visible ? (
                  <p className="text-[14px] text-primaryText leading-relaxed">
                    {preview.plain_summary_visible}
                  </p>
                ) : (
                  <span className="text-[13.5px] text-secondaryText italic flex items-center space-x-1.5">
                    <EyeOff className="w-3.5 h-3.5 text-[#8B9E9A]" />
                    <span>Private — Kept in Sanctuary</span>
                  </span>
                )}
              </div>

              {/* Nudge Completions */}
              <div className="p-3.5 rounded-xl bg-white border border-kizunaBorder">
                <span className="text-[12px] uppercase font-bold text-secondaryText block mb-1">
                  Completed Positive Milestones
                </span>
                {preview.nudges_completed_count !== undefined ? (
                  <div className="text-[14px] text-matcha-800 flex items-center space-x-1.5 font-semibold">
                    <Check className="w-4 h-4 text-matcha flex-shrink-0" />
                    <span>
                      {preview.nudges_completed_count} micro-steps completed
                    </span>
                  </div>
                ) : (
                  <span className="text-[13.5px] text-secondaryText italic flex items-center space-x-1.5">
                    <EyeOff className="w-3.5 h-3.5 text-[#8B9E9A]" />
                    <span>Private — Kept in Sanctuary</span>
                  </span>
                )}
              </div>

              {/* Subscores */}
              <div className="p-3.5 rounded-xl bg-white border border-kizunaBorder">
                <span className="text-[12px] uppercase font-bold text-secondaryText block mb-1">
                  Subscore Breakdowns
                </span>
                {preview.subscores_visible ? (
                  <div className="grid grid-cols-2 gap-2.5 text-[14px] text-primaryText font-medium">
                    <div>
                      Circadian:{" "}
                      {Math.round(preview.subscores_visible.circadian)}%
                    </div>
                    <div>
                      Digital: {Math.round(preview.subscores_visible.digital)}%
                    </div>
                    <div>
                      Mobility: {Math.round(preview.subscores_visible.mobility)}
                      %
                    </div>
                    <div>
                      Social: {Math.round(preview.subscores_visible.social)}%
                    </div>
                  </div>
                ) : (
                  <span className="text-[13.5px] text-secondaryText italic flex items-center space-x-1.5">
                    <EyeOff className="w-3.5 h-3.5 text-[#8B9E9A]" />
                    <span>Private — Kept in Sanctuary</span>
                  </span>
                )}
              </div>

              {/* Raw Sensors Status */}
              <div className="p-3 rounded-xl bg-mizu-50/70 border border-mizu-200 text-[13px] text-mizu-900 flex items-center space-x-2 font-medium">
                <Lock className="w-4 h-4 text-mizu-700 flex-shrink-0" />
                <span>
                  Raw GPS coordinates & message logs are permanently locked
                  on-device.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
