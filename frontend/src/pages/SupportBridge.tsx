import React, { useState, useEffect } from "react";
import {
  Users,
  Phone,
  Globe,
  MapPin,
  Clock,
  FileText,
  Check,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Heart,
} from "lucide-react";
import { motion } from "framer-motion";
import { SupportResource } from "../types";
import { api } from "../utils/api";

export const SupportBridge: React.FC = () => {
  const [resources, setResources] = useState<SupportResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCenter, setSelectedCenter] = useState<SupportResource | null>(
    null,
  );
  const [notes, setNotes] = useState("");
  const [handoffResult, setHandoffResult] = useState<any>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    setLoading(true);
    try {
      const data = await api.getSupportResources();
      setResources(data);
      if (data.length > 0) setSelectedCenter(data[0]);
    } catch (err) {
      console.error("Failed to load resources", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateHandoff = async () => {
    if (!selectedCenter) return;
    setGenerating(true);
    try {
      const res = await api.createWarmHandoff(selectedCenter.id, 1, notes);
      setHandoffResult(res);
    } catch (err) {
      console.error("Failed to generate warm handoff", err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pb-12"
    >
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-kizunaBorder/80 pb-5">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-[30px] sm:text-[34px] font-bold tracking-tight text-primaryText">
              Human Support & Clinical Warm Hand-off
            </h1>
            <span className="hanko-seal text-[12px] px-2.5 py-0.5">
              専門連携
            </span>
          </div>
          <p className="text-[14.5px] text-secondaryText mt-1.5 font-jp">
            “Technology helps us notice. Humans help us connect.” • Bridging to
            verified community centers and clinicians
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Support Centers Directory */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-[13.5px] font-bold text-mizu-900 uppercase tracking-wider">
              Verified Japanese Support Centers & Hotlines ({resources.length})
            </span>
            <span className="text-[12px] text-secondaryText font-jp">
              公認支援機関連携
            </span>
          </div>

          <div className="space-y-3.5">
            {resources.map((res) => {
              const isSelected = selectedCenter?.id === res.id;
              return (
                <div
                  key={res.id}
                  onClick={() => setSelectedCenter(res)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? "calm-surface border-mizu-700 bg-mizu-50/40 shadow-calm ring-1 ring-mizu-700"
                      : "bg-white border-kizunaBorder hover:border-[#B4D4CC] shadow-xs"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                        <h4 className="text-[17px] sm:text-[18px] font-bold text-primaryText">
                          {res.name}
                        </h4>
                        <span className="text-[11px] px-2.5 py-0.5 rounded bg-[#FAF9F5] text-mizu-800 uppercase font-mono font-medium border border-kizunaBorder">
                          {res.organization_type.replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-[14px] text-secondaryText mt-1.5 leading-relaxed">
                        {res.description}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 mt-3 pt-3 border-t border-kizunaBorder/60 text-[12.5px] text-secondaryText">
                    <div className="flex items-center space-x-1.5 truncate">
                      <Phone className="w-3.5 h-3.5 text-mizu-700 flex-shrink-0" />
                      <span>{res.phone || "Online text only"}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-mizu-700 flex-shrink-0" />
                      <span>{res.location}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 truncate">
                      <Clock className="w-3.5 h-3.5 text-[#8B9E9A] flex-shrink-0" />
                      <span>{res.operating_hours}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 truncate">
                      <Globe className="w-3.5 h-3.5 text-[#8B9E9A] flex-shrink-0" />
                      <span>{res.languages}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 1-Click Clinical Warm Hand-off Generator */}
        <div className="lg:col-span-5 space-y-4">
          <div className="calm-surface p-5 sm:p-6 shadow-calm space-y-4">
            <div className="flex items-center justify-between border-b border-kizunaBorder/60 pb-3">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-mizu-700" />
                <h3 className="text-[17px] font-bold text-primaryText">
                  1-Click Clinical Intake Brief
                </h3>
              </div>
              <span className="text-[11px] text-secondaryText font-mono">
                Sovereign Export
              </span>
            </div>

            <p className="text-[14px] text-secondaryText leading-relaxed">
              Compile an anonymous, structured intake summary for{" "}
              <strong className="text-primaryText font-semibold">
                {selectedCenter?.name || "the selected center"}
              </strong>
              . Prevents the anxiety of retelling painful history from scratch.
            </p>

            <div>
              <label className="text-[12.5px] font-semibold text-primaryText uppercase tracking-wider block mb-1.5">
                Caregiver / Patient Context Note (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="e.g. Ren prefers messaging rather than phone calls initially..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-kizunaBorder text-[13.5px] text-primaryText placeholder-[#8B9E9A] focus:outline-none focus:ring-2 focus:ring-mizu-500/20 focus:border-mizu-600"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerateHandoff}
              disabled={generating || !selectedCenter}
              className="w-full py-3 rounded-xl bg-mizu-700 hover:bg-mizu-800 text-white text-[14.5px] font-semibold shadow-xs flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-mizu-200" />
              <span>
                {generating
                  ? "Compiling Intake Brief..."
                  : "Generate Clinical Intake Brief"}
              </span>
            </motion.button>
          </div>

          {/* Generated Result Card in Soft Mint */}
          {handoffResult && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="calm-surface p-5 bg-mizu-50/70 border border-mizu-200 shadow-calm space-y-3"
            >
              <div className="flex items-center justify-between border-b border-mizu-200 pb-2">
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-matcha stroke-[2.5]" />
                  <span className="text-[14px] font-bold text-mizu-900">
                    Clinical Referral Brief Generated
                  </span>
                </div>
                <span className="text-[11px] font-mono text-mizu-800">
                  {handoffResult.protocol_reference}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-mizu-200/80 text-[13.5px] text-primaryText space-y-2">
                <div>
                  <span className="font-bold text-primaryText">
                    Recipient:{" "}
                  </span>
                  {handoffResult.center_name}
                </div>
                <div>
                  <span className="font-bold text-primaryText">
                    Baseline Trajectory:{" "}
                  </span>
                  {handoffResult.clinical_summary?.trajectory_summary}
                </div>
                <div>
                  <span className="font-bold text-primaryText">
                    Observed Strengths:{" "}
                  </span>
                  {handoffResult.clinical_summary?.patient_strengths}
                </div>
                <div>
                  <span className="font-bold text-primaryText">
                    Suggested Opening Approach:{" "}
                  </span>
                  {handoffResult.clinical_summary?.suggested_intake_approach}
                </div>
              </div>

              <div className="text-[11.5px] text-mizu-800 flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-mizu-700" />
                <span>
                  All identifying credentials anonymized per HIPAA / APPI
                  regulations.
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
