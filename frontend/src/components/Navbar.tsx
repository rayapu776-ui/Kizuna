import React, { useState, useRef, useEffect } from "react";
import { Menu, ChevronDown, Sparkles, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { User } from "../types";

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  currentUser: User | null;
  onSwitchRole: (role: string) => void;
  onOpenCheckin: () => void;
  onToggleMobileSidebar: () => void;
  isSidebarCollapsed: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  currentUser,
  onSwitchRole,
  onOpenCheckin,
  onToggleMobileSidebar,
  isSidebarCollapsed,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const tabLabels: Record<string, { en: string; jp: string }> = {
    youth: { en: "Youth Sanctuary", jp: "本人ダッシュボード" },
    caregiver: { en: "Caregiver CRAFT Portal", jp: "家族・対話支援" },
    sandbox: { en: "ML Sensor Lab", jp: "機械学習・特徴量検証" },
    prosody: { en: "Voice Prosody Studio", jp: "音響韻律・非言語解析" },
    support: { en: "Support & Warm Hand-off", jp: "専門機関・相談窓口" },
    privacy: { en: "Consent Matrix", jp: "自己主権型プライバシー" },
    elderly: { en: "Elderly Isolation Model", jp: "高齢者孤立モデル" },
    ethics: { en: "Architecture & Ethics", jp: "設計根拠・倫理綱領" },
  };

  const currentLabel = tabLabels[currentTab] || {
    en: "Sanctuary",
    jp: "居場所",
  };

  const demoPersonas = [
    {
      role: "youth",
      name: "Ren Sato",
      age: 19,
      label: "Youth — Emerging Hikikomori",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
      tag: "Self-Sovereign",
    },
    {
      role: "caregiver",
      name: "Keiko Sato",
      age: 48,
      label: "Caregiver — Ren's Mother (CRAFT)",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80",
      tag: "Family Bridge",
    },
    {
      role: "clinician",
      name: "Dr. Kenji Takahashi",
      age: 52,
      label: "Clinician Specialist (Tokyo Youth Net)",
      avatar:
        "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=120&auto=format&fit=crop&q=80",
      tag: "Clinical",
    },
    {
      role: "elderly",
      name: "Chiyo Tanaka",
      age: 74,
      label: "Elderly Isolation Comparison Profile",
      avatar:
        "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=120&auto=format&fit=crop&q=80",
      tag: "Geriatric",
    },
  ];

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-kizunaBorder bg-white/95 backdrop-blur-md">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between">
        {/* Left: Mobile menu toggle + Breadcrumbs */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-xl text-secondaryText hover:text-primaryText hover:bg-[#FAF9F5] transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Japanese Breadcrumbs */}
          <div className="flex items-center space-x-2">
            <span className="text-[14px] font-semibold text-primaryText hidden sm:inline font-jp">
              絆 Kizuna
            </span>
            <span className="text-kizunaBorder hidden sm:inline">/</span>
            <div className="flex items-center space-x-2">
              <span className="text-[16px] font-bold text-primaryText tracking-tight font-sans">
                {currentLabel.en}
              </span>
              <span className="text-[12px] px-2.5 py-0.5 rounded-full bg-[#FAF9F5] border border-kizunaBorder text-mizu-700 font-jp hidden md:inline font-medium">
                {currentLabel.jp}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions, Persona Switcher & Checkin */}
        <div className="flex items-center space-x-3">
          {/* Live Status indicator in Matcha Green */}
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1 rounded-full bg-matcha-50 border border-matcha-200 text-[13px]">
            <span className="w-2 h-2 rounded-full bg-matcha animate-pulse"></span>
            <span className="text-matcha-700 font-medium">
              Interpretable AI Active (TreeSHAP)
            </span>
          </div>

          {/* 10-Second Daily Check-in Button in Mizu Teal */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenCheckin}
            className="px-3.5 sm:px-4 py-2 rounded-xl bg-mizu-50 hover:bg-mizu-100 text-mizu-800 border border-mizu-200 text-[14px] font-semibold shadow-xs flex items-center space-x-2 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-mizu-600" />
            <span className="hidden xs:inline">10s Daily Check-in</span>
            <span className="xs:hidden">Check-in</span>
          </motion.button>

          {/* Persona Switcher Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2.5 p-1.5 pr-3 rounded-xl border border-kizunaBorder hover:border-mizu-400 bg-white hover:bg-[#FAF9F5] transition-all duration-200 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-mizu-700 text-white flex items-center justify-center font-bold text-sm">
                {currentUser?.full_name ? currentUser.full_name.charAt(0) : "R"}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-[13.5px] font-bold text-primaryText leading-tight">
                  {currentUser?.full_name || "Ren Sato"}
                </span>
                <span className="text-[12px] text-mizu-700 capitalize font-medium leading-tight">
                  {currentUser?.role || "Youth"}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-secondaryText" />
            </button>

            {/* Persona Switcher Modal Menu */}
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-76 rounded-2xl bg-white border border-kizunaBorder shadow-xl p-2.5 z-50"
                >
                  <div className="px-3 py-2 border-b border-kizunaBorder/60 mb-1">
                    <span className="text-[12px] font-semibold text-secondaryText uppercase tracking-wider">
                      Switch Test Persona
                    </span>
                    <p className="text-[12px] text-secondaryText mt-0.5">
                      Experience Kizuna through any stakeholder perspective
                    </p>
                  </div>

                  <div className="space-y-1">
                    {demoPersonas.map((persona) => {
                      const isSelected =
                        currentUser?.role === persona.role ||
                        (persona.role === "youth" && !currentUser?.role);

                      return (
                        <button
                          key={persona.role}
                          onClick={() => {
                            onSwitchRole(persona.role);
                            setDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                            isSelected
                              ? "bg-mizu-50 border border-mizu-200"
                              : "hover:bg-[#FAF9F5] border border-transparent"
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <img
                              src={persona.avatar}
                              alt={persona.name}
                              className="w-9 h-9 rounded-full object-cover border border-kizunaBorder"
                            />
                            <div className="flex flex-col">
                              <span className="text-[13.5px] font-bold text-primaryText">
                                {persona.name} ({persona.age})
                              </span>
                              <span className="text-[12px] text-secondaryText">
                                {persona.label}
                              </span>
                            </div>
                          </div>

                          {isSelected && (
                            <Check className="w-4 h-4 text-mizu-700 flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};
