import React, { useState } from "react";
import { X, Heart, Check, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "../utils/api";

interface EmaCheckinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckinComplete: () => void;
}

export const EmaCheckinModal: React.FC<EmaCheckinModalProps> = ({
  isOpen,
  onClose,
  onCheckinComplete,
}) => {
  const [mood, setMood] = useState<number>(3);
  const [hadSocial, setHadSocial] = useState<boolean>(false);
  const [socialEnjoyment, setSocialEnjoyment] = useState<number>(3);
  const [internetNature, setInternetNature] = useState<string>("mixed");
  const [quickNote, setQuickNote] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const moodOptions = [
    { value: 1, kanji: "重", label: "Heavy / Tired", sub: "消耗" },
    { value: 2, kanji: "曇", label: "Somewhat Low", sub: "陰り" },
    { value: 3, kanji: "静", label: "Quiet / Calm", sub: "平穏" },
    { value: 4, kanji: "晴", label: "Fairly Good", sub: "明朗" },
    { value: 5, kanji: "和", label: "Peaceful / Great", sub: "調和" },
  ];

  const internetOptions = [
    { id: "mixed", label: "Mixed / Routine Browsing", jp: "通常の利用" },
    {
      id: "passive_escape",
      label: "Passive Escape / Rest",
      jp: "受動的退避",
    },
    { id: "creative_hobby", label: "Creative / Hobby Focus", jp: "趣味・制作" },
    {
      id: "connecting",
      label: "Messaging Friends / Family",
      jp: "他者との対話",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.submitEMACheckin({
        mood_score: mood,
        had_social_contact: hadSocial,
        social_enjoyment_score: socialEnjoyment,
        internet_use_nature: internetNature,
        internet_enjoyment_score: 3,
        quick_note: quickNote,
      });
      setSubmittedSuccess(true);
      setTimeout(() => {
        setSubmittedSuccess(false);
        onCheckinComplete();
        onClose();
      }, 1200);
    } catch (err) {
      console.error("Failed to submit check-in", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primaryText/25 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="w-full max-w-lg rounded-3xl p-6 bg-white border border-kizunaBorder shadow-2xl relative"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-kizunaBorder/60 pb-4 mb-5">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-mizu-50 text-mizu-700 flex items-center justify-center border border-mizu-200 flex-shrink-0">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-[20px] font-bold text-primaryText font-sans">
                  Daily 10-Second Reflection
                </h3>
                <span className="hanko-seal text-[12px] px-1.5 py-0.5 leading-tight">
                  問診
                </span>
              </div>
              <p className="text-[13.5px] text-secondaryText font-jp mt-0.5">
                Take a gentle breath • How does today feel?
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-secondaryText hover:text-primaryText p-2 rounded-xl hover:bg-[#FAF9F5] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedSuccess ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-matcha-100 border border-matcha-200 text-matcha flex items-center justify-center">
              <Check className="w-7 h-7 stroke-[2.5]" />
            </div>
            <h4 className="text-[20px] font-bold text-primaryText font-sans">
              Reflection Saved (記録完了)
            </h4>
            <p className="text-[14.5px] text-secondaryText max-w-xs leading-relaxed">
              Your daily rhythm is noted. Thank you for checking in today.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 1. Mood Level with Noto Sans JP Kanji Character Accent */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[13.5px] font-bold text-primaryText uppercase tracking-wider font-sans">
                  1. Current Energy & Feeling (気分・エネルギー)
                </label>
                <span className="text-[12px] text-secondaryText font-jp">
                  直感で選択
                </span>
              </div>
              <div className="grid grid-cols-5 gap-2.5">
                {moodOptions.map((opt) => {
                  const isSelected = mood === opt.value;

                  return (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      key={opt.value}
                      type="button"
                      onClick={() => setMood(opt.value)}
                      className={`flex flex-col items-center p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-mizu-700 text-white border-mizu-700 shadow-xs"
                          : "bg-[#FAF9F5] border-kizunaBorder text-secondaryText hover:bg-mizu-50 hover:border-mizu-200"
                      }`}
                    >
                      <span
                        className={`font-jp text-2xl font-bold mb-1 ${
                          isSelected ? "text-white" : "text-mizu-800"
                        }`}
                      >
                        {opt.kanji}
                      </span>
                      <span className="text-[12px] font-bold truncate">
                        {opt.sub}
                      </span>
                      <span
                        className={`text-[11px] mt-0.5 ${
                          isSelected ? "text-mizu-200" : "text-[#8B9E9A]"
                        }`}
                      >
                        {opt.value}/5
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* 2. Direct Human Interaction */}
            <div>
              <label className="text-[13.5px] font-bold text-primaryText uppercase tracking-wider block mb-2 font-sans">
                2. Real-World Social Contact Today? (直接対話)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setHadSocial(false)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    !hadSocial
                      ? "bg-mizu-50 border-mizu-600 text-mizu-900 shadow-xs"
                      : "bg-[#FAF9F5] border-kizunaBorder text-secondaryText hover:bg-white"
                  }`}
                >
                  <div className="text-[14.5px] font-bold font-sans text-primaryText">
                    No direct talk
                  </div>
                  <div className="text-[12.5px] text-secondaryText mt-0.5">
                    Quiet solitary space today
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setHadSocial(true)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    hadSocial
                      ? "bg-mizu-50 border-mizu-600 text-mizu-900 shadow-xs"
                      : "bg-[#FAF9F5] border-kizunaBorder text-secondaryText hover:bg-white"
                  }`}
                >
                  <div className="text-[14.5px] font-bold font-sans text-primaryText">
                    Yes, spoke with someone
                  </div>
                  <div className="text-[12.5px] text-secondaryText mt-0.5">
                    Family, store staff, or friend
                  </div>
                </button>
              </div>
            </div>

            {/* 3. Internet Usage Nature */}
            <div>
              <label className="text-[13.5px] font-bold text-primaryText uppercase tracking-wider block mb-2 font-sans">
                3. Primary Digital Screen Nature (ネット利用の質)
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {internetOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setInternetNature(opt.id)}
                    className={`p-3 rounded-xl border text-left text-[13.5px] transition-all cursor-pointer ${
                      internetNature === opt.id
                        ? "bg-mizu-50 border-mizu-600 text-mizu-900 font-bold shadow-xs"
                        : "bg-[#FAF9F5] border-kizunaBorder text-secondaryText hover:bg-white"
                    }`}
                  >
                    <div>{opt.label}</div>
                    <div className="text-[11.5px] text-secondaryText font-jp mt-0.5">
                      {opt.jp}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Optional Note */}
            <div>
              <label className="text-[13.5px] font-bold text-primaryText uppercase tracking-wider block mb-1.5 font-sans">
                4. Private Micro Note (自由メモ - Optional)
              </label>
              <input
                type="text"
                value={quickNote}
                onChange={(e) => setQuickNote(e.target.value)}
                placeholder="Anything on your mind today? Completely confidential."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-kizunaBorder text-[14px] text-primaryText placeholder-[#8B9E9A] focus:outline-none focus:ring-2 focus:ring-mizu-500/20 focus:border-mizu-600"
              />
            </div>

            {/* Footer Submit */}
            <div className="pt-2 flex justify-end space-x-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4.5 py-2.5 rounded-xl border border-kizunaBorder text-[14px] font-semibold text-secondaryText hover:bg-[#FAF9F5] cursor-pointer"
              >
                Close
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="px-5.5 py-2.5 rounded-xl bg-mizu-700 hover:bg-mizu-800 text-white text-[14.5px] font-semibold shadow-xs flex items-center space-x-2 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-mizu-200" />
                <span>{isSubmitting ? "Saving..." : "Save Reflection"}</span>
              </motion.button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};
