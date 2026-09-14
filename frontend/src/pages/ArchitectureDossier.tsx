import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Check,
  X,
  AlertTriangle,
  HeartHandshake,
  Compass,
  Cpu,
  BookOpen,
  Lock,
  Sparkles,
} from "lucide-react";

export const ArchitectureDossier: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pb-14"
    >
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-borderSoft pb-5">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-[30px] sm:text-[34px] font-bold tracking-tight text-primaryText font-sans">
              Architecture, Ethics & Scientific Positioning
            </h1>
            <span className="hanko-seal text-[12px] px-2.5 py-0.5">
              設計根拠
            </span>
          </div>
          <p className="text-[14.5px] text-secondaryText mt-1.5 font-sans">
            Evidence-based clinical grounding (CRAFT, MHFA, EMA) • Responsible
            AI • Sovereign Privacy
          </p>
        </div>
        <div className="flex items-center space-x-2 text-[13px] text-mizuTeal font-medium bg-softMint/70 px-3.5 py-1.5 rounded-full border border-borderSoft">
          <BookOpen className="w-4 h-4 text-mizuTeal" />
          <span className="font-sans">White Paper & Dossier</span>
        </div>
      </div>

      {/* Why This Beats a Single-Approach Design */}
      <div className="calm-surface rounded-2xl p-6 bg-white border border-borderSoft shadow-calm space-y-4">
        <div className="border-b border-borderSoft/60 pb-3 flex items-center justify-between">
          <div>
            <span className="text-[12.5px] font-bold uppercase tracking-wider text-mizuTeal font-sans">
              Core Technical & Ethical Thesis
            </span>
            <h2 className="text-[20px] sm:text-[22px] font-bold text-primaryText mt-1 font-sans">
              Why Kizuna Beats Single-Approach Designs
              (単一アプローチを超える理由)
            </h2>
          </div>
          <span className="text-[11px] font-mono text-secondaryText">
            Psychological & Clinical Review
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-[13.5px]">
          <div className="p-4 rounded-xl bg-[#FAF9F5] border border-borderSoft flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-1.5 text-primaryText font-bold mb-2 text-[15.5px]">
                <X className="w-4 h-4 text-secondaryText" />
                <span className="font-sans">Detection Alone</span>
              </div>
              <p className="text-secondaryText leading-relaxed text-[13.5px]">
                Technically impressive ML demo, but clinically inert without an
                empathetic human loop. Knowing someone is isolated does not
                bridge them back.
              </p>
            </div>
            <div className="mt-3 text-[11px] text-secondaryText font-mono font-bold">
              Clinically Inert
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF9F5] border border-borderSoft flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-1.5 text-primaryText font-bold mb-2 text-[15.5px]">
                <X className="w-4 h-4 text-secondaryText" />
                <span className="font-sans">AI Companion Alone</span>
              </div>
              <p className="text-secondaryText leading-relaxed text-[13.5px]">
                Psychiatric researchers warn that AI "friends" enable avoidance,
                replace real human contact, and deepen social withdrawal through
                synthetic attachment.
              </p>
            </div>
            <div className="mt-3 text-[11px] text-secondaryText font-mono font-bold">
              Avoidance-Enabling
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-1.5 text-attentionAmber font-bold mb-2 text-[15.5px]">
                <AlertTriangle className="w-4 h-4 text-attentionAmber" />
                <span className="font-sans">Virtual "Ikigai" Worlds</span>
              </div>
              <p className="text-primaryText/80 leading-relaxed text-[13.5px]">
                Speculative 3D metaverses risk substituting one virtual retreat
                for another, failing to activate physical sensory presence in
                the real world.
              </p>
            </div>
            <div className="mt-3 text-[11px] text-attentionAmber font-mono font-bold">
              Virtual Substitution
            </div>
          </div>

          <div className="p-4 rounded-xl bg-softMint border border-freshTeal/30 shadow-calm flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-1.5 text-mizuTeal-dark font-bold mb-2 text-[15.5px]">
                <Check className="w-4 h-4 text-matchaGreen stroke-[2.5]" />
                <span className="font-sans">Kizuna Combined Pipeline</span>
              </div>
              <p className="text-primaryText leading-relaxed text-[13.5px]">
                Passive interpretable sensing → EMA daily reflections →
                CRAFT/MHFA family bridge → Warm clinical hand-off. Ethically
                grounded with all safeguards built-in.
              </p>
            </div>
            <div className="mt-3 text-[11px] text-mizuTeal font-mono font-bold">
              Integrated Solution
            </div>
          </div>
        </div>
      </div>

      {/* Positioning Matrix Table */}
      <div className="calm-surface rounded-2xl p-6 bg-white border border-borderSoft shadow-calm space-y-4">
        <div className="border-b border-borderSoft/60 pb-3 flex items-center justify-between">
          <div>
            <span className="text-[12.5px] font-bold uppercase tracking-wider text-mizuTeal font-sans">
              Architectural Differentiation
            </span>
            <h2 className="text-[20px] sm:text-[22px] font-bold text-primaryText mt-1 font-sans">
              Comparative Analysis with Existing Paradigms
            </h2>
          </div>
          <span className="text-[11px] font-mono text-secondaryText">
            Systematic Comparison
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-borderSoft text-secondaryText text-[12px] uppercase tracking-wider font-sans">
                <th className="py-3 px-3.5">Dimension</th>
                <th className="py-3 px-3.5">Surveillance Apps</th>
                <th className="py-3 px-3.5">AI Friend Chatbots</th>
                <th className="py-3 px-3.5 text-mizuTeal font-bold bg-softMint/40 rounded-t-lg">
                  Kizuna (絆)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderSoft/60 text-primaryText text-[13.5px]">
              <tr>
                <td className="py-3.5 px-3.5 font-semibold text-primaryText font-sans">
                  Data Privacy
                </td>
                <td className="py-3.5 px-3.5 text-secondaryText">
                  Exposes raw GPS & keystrokes
                </td>
                <td className="py-3.5 px-3.5 text-secondaryText">
                  Logs personal conversations
                </td>
                <td className="py-3.5 px-3.5 text-mizuTeal font-semibold bg-softMint/30">
                  Edge-processed; raw data never transmitted
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-3.5 font-semibold text-primaryText font-sans">
                  Family Dynamic
                </td>
                <td className="py-3.5 px-3.5 text-secondaryText">
                  Causes hostility & mistrust
                </td>
                <td className="py-3.5 px-3.5 text-secondaryText">
                  Replaces family interaction
                </td>
                <td className="py-3.5 px-3.5 text-mizuTeal font-semibold bg-softMint/30">
                  CRAFT protocol de-escalates parental panic
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-3.5 font-semibold text-primaryText font-sans">
                  Explainability
                </td>
                <td className="py-3.5 px-3.5 text-secondaryText">
                  No interpretation provided
                </td>
                <td className="py-3.5 px-3.5 text-secondaryText">
                  Hallucinatory LLM reasoning
                </td>
                <td className="py-3.5 px-3.5 text-mizuTeal font-semibold bg-softMint/30">
                  Random Forest + TreeSHAP plain language
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-3.5 font-semibold text-primaryText font-sans">
                  Action Goal
                </td>
                <td className="py-3.5 px-3.5 text-secondaryText">
                  Passive monitoring only
                </td>
                <td className="py-3.5 px-3.5 text-secondaryText">
                  Deepens screen attachment
                </td>
                <td className="py-3.5 px-3.5 text-mizuTeal font-semibold bg-softMint/30">
                  Grounded real-world behavioral micro-steps
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 5 Non-Negotiable Ethical Axioms */}
      <div className="calm-surface rounded-2xl p-6 bg-white border border-borderSoft shadow-calm space-y-4">
        <div className="border-b border-borderSoft/60 pb-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-mizuTeal" />
            <h3 className="text-[18px] sm:text-[20px] font-bold text-primaryText font-sans">
              5 Non-Negotiable Ethical Axioms of Kizuna
            </h3>
          </div>
          <span className="hanko-seal text-[11px] px-2 py-0.5">倫理綱領</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-4 rounded-xl bg-[#FAF9F5] border border-borderSoft flex flex-col justify-between">
            <div>
              <span className="font-mono text-mizuTeal font-bold block mb-1 text-[12px]">
                Axiom 1
              </span>
              <div className="font-bold text-primaryText mb-1.5 font-sans text-[15px]">
                Never an AI Friend
              </div>
              <p className="text-secondaryText leading-relaxed text-[13px]">
                Kizuna rejects synthetic companion personas that foster
                artificial dependency and enable social avoidance.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-borderSoft/40 text-[11px] text-mizuTeal font-medium">
              Human-first principle
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF9F5] border border-borderSoft flex flex-col justify-between">
            <div>
              <span className="font-mono text-mizuTeal font-bold block mb-1 text-[12px]">
                Axiom 2
              </span>
              <div className="font-bold text-primaryText mb-1.5 font-sans text-[15px]">
                No Black Boxes
              </div>
              <p className="text-secondaryText leading-relaxed text-[13px]">
                Every assessment is mathematically explained via TreeSHAP into
                everyday language anyone can understand.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-borderSoft/40 text-[11px] text-mizuTeal font-medium">
              Mathematical interpretability
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF9F5] border border-borderSoft flex flex-col justify-between">
            <div>
              <span className="font-mono text-mizuTeal font-bold block mb-1 text-[12px]">
                Axiom 3
              </span>
              <div className="font-bold text-primaryText mb-1.5 font-sans text-[15px]">
                Sovereign Consent
              </div>
              <p className="text-secondaryText leading-relaxed text-[13px]">
                Youth maintain granular opt-in control with a live "What
                Caregiver Sees" mirror. No covert surveillance.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-borderSoft/40 text-[11px] text-mizuTeal font-medium">
              Self-determination
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF9F5] border border-borderSoft flex flex-col justify-between">
            <div>
              <span className="font-mono text-mizuTeal font-bold block mb-1 text-[12px]">
                Axiom 4
              </span>
              <div className="font-bold text-primaryText mb-1.5 font-sans text-[15px]">
                Grounded Action
              </div>
              <p className="text-secondaryText leading-relaxed text-[13px]">
                Interventions focus strictly on physical sensory activation
                (fresh air, tactile hobbies, real-world contact).
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-borderSoft/40 text-[11px] text-mizuTeal font-medium">
              Real-world reconnection
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF9F5] border border-borderSoft flex flex-col justify-between">
            <div>
              <span className="font-mono text-mizuTeal font-bold block mb-1 text-[12px]">
                Axiom 5
              </span>
              <div className="font-bold text-primaryText mb-1.5 font-sans text-[15px]">
                Zero Audio Storage
              </div>
              <p className="text-secondaryText leading-relaxed text-[13px]">
                Voice analysis extracts only acoustic cadence; audio is never
                recorded, stored, or speech-to-text transcribed.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-borderSoft/40 text-[11px] text-mizuTeal font-medium">
              Acoustic privacy
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
