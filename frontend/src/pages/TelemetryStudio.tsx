import React, { useState, useEffect } from "react";
import {
  Activity,
  Sliders,
  Sparkles,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Users,
  Compass,
} from "lucide-react";
import { motion } from "framer-motion";
import { api } from "../utils/api";

export const TelemetryStudio: React.FC = () => {
  const [population, setPopulation] = useState<
    "youth_hikikomori" | "elderly_isolation"
  >("youth_hikikomori");

  // Interactive Slider States
  const [entropy, setEntropy] = useState<number>(0.45);
  const [radius, setRadius] = useState<number>(1.5);
  const [homeRatio, setHomeRatio] = useState<number>(0.85);
  const [screenTime, setScreenTime] = useState<number>(9.5);
  const [lateNightScreen, setLateNightScreen] = useState<number>(3.5);
  const [appSwitching, setAppSwitching] = useState<number>(28.0);
  const [sleepMidpoint, setSleepMidpoint] = useState<number>(7.5);
  const [sleepDuration, setSleepDuration] = useState<number>(6.5);
  const [sleepQuality, setSleepQuality] = useState<number>(55.0);
  const [steps, setSteps] = useState<number>(1400);
  const [calls, setCalls] = useState<number>(0);
  const [sms, setSms] = useState<number>(4);
  const [contacts, setContacts] = useState<number>(1);

  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    runInference();
  }, [
    population,
    entropy,
    radius,
    homeRatio,
    screenTime,
    lateNightScreen,
    appSwitching,
    sleepMidpoint,
    sleepDuration,
    sleepQuality,
    steps,
    calls,
    sms,
    contacts,
  ]);

  const runInference = async () => {
    setIsSimulating(true);
    try {
      const res = await api.simulateRisk({
        location_entropy: entropy,
        radius_of_gyration_km: radius,
        time_spent_home_ratio: homeRatio,
        total_screen_time_hours: screenTime,
        late_night_screen_hours: lateNightScreen,
        app_switching_frequency: appSwitching,
        sleep_duration_hours: sleepDuration,
        sleep_midpoint_hour: sleepMidpoint,
        sleep_quality_score: sleepQuality,
        step_count: steps,
        outgoing_call_count: calls,
        sms_or_message_count: sms,
        distinct_contacts_interacted: contacts,
        population_type: population,
      });
      setSimulationResult(res);
    } catch (err) {
      console.error("Simulation error", err);
    } finally {
      setIsSimulating(false);
    }
  };

  const loadPreset = (
    preset:
      | "healthy_youth"
      | "acute_hikikomori"
      | "healthy_elderly"
      | "isolated_elderly",
  ) => {
    if (preset === "healthy_youth") {
      setPopulation("youth_hikikomori");
      setEntropy(0.85);
      setRadius(5.5);
      setHomeRatio(0.55);
      setScreenTime(4.8);
      setLateNightScreen(0.6);
      setAppSwitching(14.0);
      setSleepMidpoint(4.0);
      setSleepDuration(7.5);
      setSleepQuality(82.0);
      setSteps(6800);
      setCalls(3);
      setSms(25);
      setContacts(5);
    } else if (preset === "acute_hikikomori") {
      setPopulation("youth_hikikomori");
      setEntropy(0.18);
      setRadius(0.4);
      setHomeRatio(0.96);
      setScreenTime(12.5);
      setLateNightScreen(5.5);
      setAppSwitching(42.0);
      setSleepMidpoint(9.5);
      setSleepDuration(5.5);
      setSleepQuality(40.0);
      setSteps(700);
      setCalls(0);
      setSms(2);
      setContacts(1);
    } else if (preset === "healthy_elderly") {
      setPopulation("elderly_isolation");
      setEntropy(0.65);
      setRadius(2.8);
      setHomeRatio(0.7);
      setScreenTime(1.8);
      setLateNightScreen(0.1);
      setAppSwitching(5.0);
      setSleepMidpoint(2.5);
      setSleepDuration(6.8);
      setSleepQuality(78.0);
      setSteps(4500);
      setCalls(2);
      setSms(6);
      setContacts(3);
    } else if (preset === "isolated_elderly") {
      setPopulation("elderly_isolation");
      setEntropy(0.15);
      setRadius(0.3);
      setHomeRatio(0.98);
      setScreenTime(0.3);
      setLateNightScreen(0.0);
      setAppSwitching(1.0);
      setSleepMidpoint(2.0);
      setSleepDuration(6.0);
      setSleepQuality(50.0);
      setSteps(650);
      setCalls(0);
      setSms(1);
      setContacts(0);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pb-12"
    >
      {/* Title & Presets */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-kizunaBorder/80 pb-5">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-[30px] sm:text-[34px] font-bold tracking-tight text-primaryText">
              ML Sensor Studio & Sandbox
            </h1>
            <span className="hanko-seal text-[12px] px-2.5 py-0.5">
              特徴量検証
            </span>
          </div>
          <p className="text-[14.5px] text-secondaryText mt-1.5 font-jp">
            Passive behavioral sensing adjustments • Live Random Forest
            inference and TreeSHAP attribution
          </p>
        </div>

        {/* Quick Scenario Presets */}
        <div className="flex flex-wrap items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-kizunaBorder text-[13.5px] shadow-calm">
          <span className="text-[12px] font-bold text-secondaryText uppercase px-2">
            Presets:
          </span>
          <button
            onClick={() => loadPreset("healthy_youth")}
            className="px-3.5 py-1.5 rounded-xl bg-matcha-50 hover:bg-matcha-100 text-matcha-800 border border-matcha-200 text-[13.5px] font-semibold transition-colors cursor-pointer"
          >
            Connected Youth
          </button>
          <button
            onClick={() => loadPreset("acute_hikikomori")}
            className="px-3.5 py-1.5 rounded-xl bg-mizu-50 hover:bg-mizu-100 text-mizu-800 border border-mizu-200 text-[13.5px] font-semibold transition-all cursor-pointer"
          >
            Acute Hikikomori
          </button>
          <button
            onClick={() => loadPreset("isolated_elderly")}
            className="px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-[13.5px] font-semibold transition-all cursor-pointer"
          >
            Isolated Elderly
          </button>
        </div>
      </div>

      {/* Population Model Mode Switcher */}
      <div className="calm-surface p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-calm">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-mizu-50 border border-mizu-200 text-mizu-700 flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[16px] sm:text-[17px] font-bold text-primaryText">
              Target Population Baseline (母集団適合モデル)
            </div>
            <div className="text-[13.5px] text-secondaryText font-jp mt-0.5">
              Calibrated feature weights prevent misclassifying healthy quiet
              elderly as withdrawing youth
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-[#FAF9F5] p-1.5 rounded-2xl border border-kizunaBorder text-[13.5px]">
          <button
            onClick={() => setPopulation("youth_hikikomori")}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              population === "youth_hikikomori"
                ? "bg-mizu-700 text-white font-bold shadow-xs"
                : "text-secondaryText hover:text-primaryText font-medium"
            }`}
          >
            Youth Hikikomori (Nocturnal Screen weighted)
          </button>
          <button
            onClick={() => setPopulation("elderly_isolation")}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              population === "elderly_isolation"
                ? "bg-mizu-700 text-white font-bold shadow-xs"
                : "text-secondaryText hover:text-primaryText font-medium"
            }`}
          >
            Elderly Isolation (Mobility decay weighted)
          </button>
        </div>
      </div>

      {/* Live Inference Output HUD */}
      {simulationResult && (
        <div className="calm-surface p-6 shadow-calm space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* Score Badge */}
            <div className="flex items-center space-x-5">
              <div className="w-20 h-20 rounded-2xl bg-[#FAF9F5] border border-kizunaBorder flex flex-col items-center justify-center flex-shrink-0">
                <span className="text-[34px] sm:text-[36px] font-bold text-primaryText tracking-tight tabular-nums font-mono">
                  {Math.round(simulationResult.overall_risk_score)}
                </span>
                <span className="text-[11px] text-secondaryText uppercase font-semibold tracking-wider">
                  / 100 PTS
                </span>
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span
                    className={`text-[12.5px] font-semibold px-3 py-0.5 rounded-full uppercase border ${
                      simulationResult.risk_tier === "low"
                        ? "bg-matcha-50 border-matcha-200 text-matcha-800"
                        : simulationResult.risk_tier === "emerging"
                          ? "bg-mizu-50 border-mizu-200 text-mizu-800"
                          : "bg-amber-50 border-amber-200 text-amber-800"
                    }`}
                  >
                    {simulationResult.risk_tier} State
                  </span>
                  <span className="text-[12px] text-secondaryText font-mono">
                    {simulationResult.model_type}
                  </span>
                </div>
                <h3 className="text-[18px] sm:text-[19px] font-bold text-primaryText">
                  Live Evaluated Behavioral Rhythm
                </h3>
                <p className="text-[14.5px] text-secondaryText mt-1 max-w-xl leading-relaxed">
                  {simulationResult.plain_language_summary}
                </p>
              </div>
            </div>

            {/* Subscores Grid */}
            {simulationResult.subscores && (
              <div className="grid grid-cols-2 gap-2.5 text-[13.5px] bg-[#FAF9F5] p-4 rounded-2xl border border-kizunaBorder min-w-[240px]">
                <div className="text-secondaryText">
                  Mobility:{" "}
                  <span className="font-bold text-mizu-800 tabular-nums">
                    {simulationResult.subscores.mobility}%
                  </span>
                </div>
                <div className="text-secondaryText">
                  Circadian:{" "}
                  <span className="font-bold text-mizu-800 tabular-nums">
                    {simulationResult.subscores.circadian}%
                  </span>
                </div>
                <div className="text-secondaryText">
                  Social:{" "}
                  <span className="font-bold text-mizu-800 tabular-nums">
                    {simulationResult.subscores.social}%
                  </span>
                </div>
                <div className="text-secondaryText">
                  Digital:{" "}
                  <span className="font-bold text-mizu-800 tabular-nums">
                    {simulationResult.subscores.digital}%
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Top SHAP Feature Attributions */}
          {simulationResult.shap_breakdown && (
            <div className="pt-3 border-t border-kizunaBorder/60">
              <div className="text-[12.5px] font-bold text-secondaryText uppercase tracking-wider mb-2.5 font-jp">
                SHAP Marginal Feature Drivers (局所的寄与度分析):
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {simulationResult.shap_breakdown
                  .slice(0, 3)
                  .map((f: any, i: number) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-[#FAF9F5] border border-kizunaBorder text-[13px]"
                    >
                      <div className="flex justify-between font-bold text-primaryText text-[14px]">
                        <span>{f.display_name}</span>
                        <span
                          className={
                            f.direction === "increases_risk"
                              ? "text-mizu-700"
                              : "text-matcha"
                          }
                        >
                          {f.direction === "increases_risk"
                            ? `+${f.impact_points}`
                            : f.impact_points}{" "}
                          pts
                        </span>
                      </div>
                      <p className="text-[12.5px] text-secondaryText mt-1.5 leading-relaxed">
                        {f.plain_explanation}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sliders Control Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Group 1: Mobility */}
        <div className="calm-surface p-5 space-y-4 shadow-calm">
          <div className="text-[13.5px] font-bold text-mizu-900 uppercase tracking-wider border-b border-kizunaBorder/60 pb-2.5 flex justify-between">
            <span>1. Spatial Mobility (GPS)</span>
            <span className="font-jp text-secondaryText text-[12.5px]">
              空間移動
            </span>
          </div>

          <div>
            <div className="flex justify-between text-[13.5px] mb-1.5">
              <span className="text-secondaryText font-medium">
                Location Entropy
              </span>
              <span className="font-mono font-bold text-primaryText">
                {entropy}
              </span>
            </div>
            <input
              type="range"
              min="0.05"
              max="1.20"
              step="0.05"
              value={entropy}
              onChange={(e) => setEntropy(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#E8F1EE] rounded appearance-none accent-mizu-700 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-[13.5px] mb-1.5">
              <span className="text-secondaryText font-medium">
                Mobility Radius (km)
              </span>
              <span className="font-mono font-bold text-primaryText">
                {radius} km
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="10.0"
              step="0.2"
              value={radius}
              onChange={(e) => setRadius(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#E8F1EE] rounded appearance-none accent-mizu-700 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-[13.5px] mb-1.5">
              <span className="text-secondaryText font-medium">
                Home Confinement Ratio
              </span>
              <span className="font-mono font-bold text-primaryText">
                {Math.round(homeRatio * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.30"
              max="1.0"
              step="0.05"
              value={homeRatio}
              onChange={(e) => setHomeRatio(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#E8F1EE] rounded appearance-none accent-mizu-700 cursor-pointer"
            />
          </div>
        </div>

        {/* Group 2: Screen & Digital */}
        <div className="calm-surface p-5 space-y-4 shadow-calm">
          <div className="text-[13.5px] font-bold text-mizu-900 uppercase tracking-wider border-b border-kizunaBorder/60 pb-2.5 flex justify-between">
            <span>2. Screen & App Dynamics</span>
            <span className="font-jp text-secondaryText text-[12.5px]">
              端末利用
            </span>
          </div>

          <div>
            <div className="flex justify-between text-[13.5px] mb-1.5">
              <span className="text-secondaryText font-medium">
                Total Screen Time (hrs)
              </span>
              <span className="font-mono font-bold text-primaryText">
                {screenTime} hrs
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="16.0"
              step="0.5"
              value={screenTime}
              onChange={(e) => setScreenTime(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#E8F1EE] rounded appearance-none accent-mizu-700 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-[13.5px] mb-1.5">
              <span className="text-secondaryText font-medium">
                Late-Night Screen (hrs)
              </span>
              <span className="font-mono font-bold text-primaryText">
                {lateNightScreen} hrs
              </span>
            </div>
            <input
              type="range"
              min="0.0"
              max="8.0"
              step="0.5"
              value={lateNightScreen}
              onChange={(e) => setLateNightScreen(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#E8F1EE] rounded appearance-none accent-mizu-700 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-[13.5px] mb-1.5">
              <span className="text-secondaryText font-medium">
                App Switching Freq (/hr)
              </span>
              <span className="font-mono font-bold text-primaryText">
                {appSwitching}/hr
              </span>
            </div>
            <input
              type="range"
              min="1.0"
              max="60.0"
              step="2.0"
              value={appSwitching}
              onChange={(e) => setAppSwitching(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#E8F1EE] rounded appearance-none accent-mizu-700 cursor-pointer"
            />
          </div>
        </div>

        {/* Group 3: Circadian Rhythm */}
        <div className="calm-surface p-5 space-y-4 shadow-calm">
          <div className="text-[13.5px] font-bold text-mizu-900 uppercase tracking-wider border-b border-kizunaBorder/60 pb-2.5 flex justify-between">
            <span>3. Circadian & Sleep</span>
            <span className="font-jp text-secondaryText text-[12.5px]">
              概日睡眠
            </span>
          </div>

          <div>
            <div className="flex justify-between text-[13.5px] mb-1.5">
              <span className="text-secondaryText font-medium">
                Sleep Midpoint Hour
              </span>
              <span className="font-mono font-bold text-primaryText">
                {sleepMidpoint} AM
              </span>
            </div>
            <input
              type="range"
              min="1.0"
              max="12.0"
              step="0.5"
              value={sleepMidpoint}
              onChange={(e) => setSleepMidpoint(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#E8F1EE] rounded appearance-none accent-mizu-700 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-[13.5px] mb-1.5">
              <span className="text-secondaryText font-medium">
                Daily Steps Count
              </span>
              <span className="font-mono font-bold text-primaryText">
                {steps.toLocaleString()} steps
              </span>
            </div>
            <input
              type="range"
              min="200"
              max="10000"
              step="200"
              value={steps}
              onChange={(e) => setSteps(parseInt(e.target.value))}
              className="w-full h-1.5 bg-[#E8F1EE] rounded appearance-none accent-mizu-700 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-[13.5px] mb-1.5">
              <span className="text-secondaryText font-medium">
                Distinct Contacts Contacted
              </span>
              <span className="font-mono font-bold text-primaryText">
                {contacts} people
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={contacts}
              onChange={(e) => setContacts(parseInt(e.target.value))}
              className="w-full h-1.5 bg-[#E8F1EE] rounded appearance-none accent-mizu-700 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
