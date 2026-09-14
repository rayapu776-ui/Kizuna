import React, { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { Navbar } from "./components/Navbar";
import { EmaCheckinModal } from "./components/EmaCheckinModal";
import { YouthDashboard } from "./pages/YouthDashboard";
import { CaregiverPortal } from "./pages/CaregiverPortal";
import { TelemetryStudio } from "./pages/TelemetryStudio";
import { VoiceAffectPage } from "./pages/VoiceAffectPage";
import { SupportBridge } from "./pages/SupportBridge";
import { ElderlyVisionPage } from "./pages/ElderlyVisionPage";
import { ArchitectureDossier } from "./pages/ArchitectureDossier";
import { ConsentMatrix } from "./components/ConsentMatrix";
import { User } from "./types";
import { api } from "./utils/api";
import { CheckCircle2 } from "lucide-react";

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>("youth");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isCheckinOpen, setIsCheckinOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] =
    useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const user = await api.getMe();
      setCurrentUser(user);
    } catch (err) {
      console.warn("Auto-login fallback to default demo persona", err);
      const res = await api.switchDemoRole("youth");
      setCurrentUser(res.user);
    }
  };

  const handleSwitchRole = async (role: string) => {
    try {
      const res = await api.switchDemoRole(role);
      setCurrentUser(res.user);

      // Intelligent auto-route to the most relevant view
      if (role === "youth") {
        setCurrentTab("youth");
        showToast("Switched persona to Ren Sato (Youth Sanctuary)");
      } else if (role === "caregiver") {
        setCurrentTab("caregiver");
        showToast("Switched persona to Keiko Sato (Caregiver CRAFT Portal)");
      } else if (role === "clinician") {
        setCurrentTab("support");
        showToast(
          "Switched persona to Dr. Takahashi (Clinical Support Bridge)",
        );
      } else if (role === "elderly") {
        setCurrentTab("elderly");
        showToast("Switched persona to Chiyo Tanaka (Elderly Isolation Model)");
      }
    } catch (err) {
      console.error("Role switch failed", err);
    }
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-primaryText flex selection:bg-softMint selection:text-mizuTeal font-sans">
      {/* Toast Notification Banner in Calm Style */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-white border border-borderSoft text-primaryText text-[13.5px] font-semibold shadow-calm-lg flex items-center space-x-2.5 animate-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-4 h-4 text-matchaGreen flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Modern Japanese Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        currentUser={currentUser}
        isOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content Area Layout with Responsive Padding */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isSidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
        }`}
      >
        {/* Topbar */}
        <Navbar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          currentUser={currentUser}
          onSwitchRole={handleSwitchRole}
          onOpenCheckin={() => setIsCheckinOpen(true)}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
          isSidebarCollapsed={isSidebarCollapsed}
        />

        {/* Page Content Shell */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          {currentTab === "youth" && (
            <YouthDashboard
              currentUser={currentUser}
              onOpenCheckin={() => setIsCheckinOpen(true)}
            />
          )}
          {currentTab === "caregiver" && (
            <CaregiverPortal
              currentUser={currentUser}
              onNavigateToSupport={() => setCurrentTab("support")}
            />
          )}
          {currentTab === "sandbox" && <TelemetryStudio />}
          {currentTab === "prosody" && <VoiceAffectPage />}
          {currentTab === "support" && <SupportBridge />}
          {currentTab === "privacy" && (
            <div className="space-y-6 pb-14">
              <div className="flex items-center space-x-2.5 border-b border-borderSoft pb-4">
                <h1 className="text-[30px] sm:text-[34px] font-bold tracking-tight text-primaryText font-sans">
                  Sovereign Consent & Privacy Matrix
                </h1>
                <span className="hanko-seal text-[12px] px-2.5 py-0.5">
                  自己主権型合意
                </span>
              </div>
              <ConsentMatrix
                onSettingsSaved={() =>
                  showToast("Privacy permissions updated successfully")
                }
              />
            </div>
          )}
          {currentTab === "elderly" && <ElderlyVisionPage />}
          {currentTab === "ethics" && <ArchitectureDossier />}
        </main>

        {/* Product Footer */}
        <footer className="border-t border-borderSoft bg-white py-6 text-[13.5px] text-secondaryText">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-mizuTeal text-[15px] font-jp">
                絆 Kizuna
              </span>
              <span className="text-borderSoft">•</span>
              <span className="font-sans">
                Passive Early-Warning & Family-Bridging Sanctuary
              </span>
            </div>
            <div className="flex items-center space-x-4 text-[12px] font-mono text-secondaryText">
              <span className="text-matchaGreen font-semibold flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-matchaGreen inline-block" />
                <span>ISO/IEC 27701 Aligned</span>
              </span>
              <span>Non-Virtual Behavioral Activation</span>
              <span>Zero-Storage Audio</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Global 10-Second Daily Reflection Modal */}
      <EmaCheckinModal
        isOpen={isCheckinOpen}
        onClose={() => setIsCheckinOpen(false)}
        onCheckinComplete={() => {
          showToast("Daily reflection recorded. Micro-actions refreshed.");
        }}
      />
    </div>
  );
};

export default App;
