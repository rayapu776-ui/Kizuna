import React from "react";
import {
  Compass,
  HeartHandshake,
  Activity,
  Mic,
  Users,
  FileText,
  UserCheck,
  ShieldCheck,
  Lock,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { User } from "../types";

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  currentUser: User | null;
  isOpen: boolean;
  onCloseMobile: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  currentUser,
  isOpen,
  onCloseMobile,
  isCollapsed,
  onToggleCollapse,
}) => {
  const navSections = [
    {
      title: "Individual Sanctuary",
      japaneseTitle: "個人領域",
      items: [
        {
          id: "youth",
          label: "Sanctuary Dashboard",
          icon: Compass,
          badge: "Active",
        },
        {
          id: "privacy",
          label: "Consent Matrix",
          icon: ShieldCheck,
          badge: "Sovereign",
        },
        {
          id: "prosody",
          label: "Voice Prosody Studio",
          icon: Mic,
          badge: "Zero-Audio",
        },
      ],
    },
    {
      title: "Human Bridge & Care",
      japaneseTitle: "家族・対話",
      items: [
        {
          id: "caregiver",
          label: "Caregiver Portal",
          icon: HeartHandshake,
          badge: "CRAFT",
        },
        {
          id: "support",
          label: "Support & Warm Hand-off",
          icon: Users,
          badge: "Clinical",
        },
      ],
    },
    {
      title: "AI/ML & Generalization",
      japaneseTitle: "技術検証",
      items: [
        {
          id: "sandbox",
          label: "ML Sensor Lab",
          icon: Activity,
          badge: "RF + SHAP",
        },
        {
          id: "elderly",
          label: "Elderly Isolation Model",
          icon: UserCheck,
          badge: "Adapted",
        },
        {
          id: "ethics",
          label: "Architecture & Ethics",
          icon: FileText,
          badge: "Dossier",
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-primaryText/25 backdrop-blur-xs lg:hidden animate-in fade-in duration-200"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-white border-r border-kizunaBorder shadow-calm transition-all duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${isCollapsed ? "lg:w-20" : "lg:w-64"} w-72`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-kizunaBorder/60 bg-white">
          <div
            onClick={() => onSelectTab("youth")}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            {/* Japanese Kanji Emblem Box (絆) in Primary Mizu Teal */}
            <div className="w-10 h-10 rounded-xl bg-mizu-700 text-white flex items-center justify-center shadow-xs flex-shrink-0 group-hover:scale-105 group-hover:bg-mizu-800 transition-all">
              <span className="font-jp font-bold text-xl leading-none">絆</span>
            </div>

            {!isCollapsed && (
              <div className="flex flex-col">
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-primaryText tracking-tight text-[16px]">
                    KIZUNA
                  </span>
                  <span className="hanko-seal text-[11px] px-1.5 py-0.5">
                    絆
                  </span>
                </div>
                <span className="text-[12px] text-mizu-700 font-medium">
                  Mizu Calm Sanctuary
                </span>
              </div>
            )}
          </div>

          {/* Mobile Close Button */}
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-secondaryText hover:text-primaryText hover:bg-[#FAF9F5] lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg text-secondaryText hover:text-mizu-700 hover:bg-mizu-50 transition-colors"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation Item Lists */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1.5">
              {!isCollapsed && (
                <div className="flex items-center justify-between px-3 py-1 mb-1 text-[12px] font-semibold text-secondaryText uppercase tracking-wider">
                  <span>{section.title}</span>
                  <span className="font-jp text-[12px] text-mizu-700 font-medium">
                    {section.japaneseTitle}
                  </span>
                </div>
              )}

              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      onCloseMobile();
                    }}
                    title={isCollapsed ? item.label : undefined}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[14.5px] transition-all duration-200 group ${
                      isActive
                        ? "bg-mizu-50 text-mizu-800 border-l-3 border-mizu-700 font-semibold shadow-xs"
                        : "text-primaryText/85 font-medium hover:text-mizu-800 hover:bg-[#FAF9F5]"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon
                        className={`w-4.5 h-4.5 flex-shrink-0 transition-colors ${
                          isActive
                            ? "text-mizu-700"
                            : "text-[#8B9E9A] group-hover:text-mizu-600"
                        }`}
                      />
                      {!isCollapsed && (
                        <span className="truncate">{item.label}</span>
                      )}
                    </div>

                    {!isCollapsed && item.badge && (
                      <span
                        className={`text-[11.5px] px-2 py-0.5 rounded-full font-medium ${
                          isActive
                            ? "bg-mizu-100 text-mizu-800"
                            : "bg-[#FAF9F5] text-secondaryText group-hover:bg-mizu-50 group-hover:text-mizu-700"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Sidebar Footer: Privacy Certification & User Status */}
        <div className="p-3 border-t border-kizunaBorder/60 bg-[#FAF9F5]/70 space-y-2">
          {!isCollapsed && (
            <div className="px-3 py-2 rounded-xl bg-white border border-kizunaBorder shadow-xs flex items-center space-x-2.5">
              <div className="w-6 h-6 rounded-lg bg-matcha-50 border border-matcha-200 text-matcha-600 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 text-matcha" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[12.5px] font-semibold text-primaryText truncate">
                  ISO/IEC 27701 Aligned
                </span>
                <span className="text-[11.5px] text-mizu-700 flex items-center space-x-1 font-medium">
                  <Lock className="w-3 h-3 inline" />
                  <span>On-Device Edge Privacy</span>
                </span>
              </div>
            </div>
          )}

          {/* Current User Snapshot */}
          <div className="flex items-center space-x-3 px-2 py-1.5">
            <div className="w-8 h-8 rounded-full bg-mizu-100 border border-mizu-200 text-mizu-800 flex items-center justify-center font-bold text-sm flex-shrink-0">
              {currentUser?.full_name ? currentUser.full_name.charAt(0) : "K"}
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-[13.5px] font-semibold text-primaryText truncate">
                  {currentUser?.full_name || "Ren Sato"}
                </span>
                <span className="text-[12px] text-secondaryText capitalize">
                  {currentUser?.role === "caregiver"
                    ? "Caregiver"
                    : currentUser?.role === "clinician"
                      ? "Clinician"
                      : "Individual Sanctuary"}
                </span>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
