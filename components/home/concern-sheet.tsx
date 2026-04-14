// components/home/concern-sheet.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Mic, MicOff, X, Loader2 } from "lucide-react";
import { usePostHog } from 'posthog-js/react';

type SttStatus = "idle" | "listening" | "error";

interface ConcernSheetProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn?: boolean;
  initialText?: string;
}

export function ConcernSheet({ isOpen, onClose, isLoggedIn = false, initialText }: ConcernSheetProps) {
  const router = useRouter();
  const posthog = usePostHog();
  const [text, setText] = useState("");
  const [sttStatus, setSttStatus] = useState<SttStatus>("idle");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (isOpen) {
      setText(initialText ?? "");
      posthog?.capture('concern_sheet_opened', { is_logged_in: isLoggedIn })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = "ko-KR";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.onstart = () => setSttStatus("listening");
    recognition.onresult = (event: any) => {
      setText(event.results[0][0].transcript);
    };
    recognition.onend = () => setSttStatus("idle");
    recognition.onerror = () => setSttStatus("error");
    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setSttStatus("idle");
  };

  const handleMic = () => {
    if (sttStatus === "listening") stopListening();
    else startListening();
  };

  const handleSubmit = async () => {
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      if (isLoggedIn) {
        const res = await fetch("/api/prescription/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ concern: text.trim() }),
        });
        if (!res.ok) throw new Error();
        const { prescriptionId } = await res.json();
        router.push(`/prescription/ai/${prescriptionId}`);
      } else {
        const res = await fetch("/api/prescription/preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ concern: text.trim() }),
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        const concern = text.trim();
        sessionStorage.setItem("previewPrescription", JSON.stringify({ concern, ...data.prescription }));
        localStorage.setItem("pendingConcern", concern);
        router.push("/preview/prescription");
      }
    } catch {
      setError("잠시 후 다시 시도해주세요");
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    stopListening();
    setText("");
    setError(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={handleClose}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-background rounded-t-3xl px-6 pt-5 pb-10 z-50 shadow-2xl"
          >
            {/* Handle */}
            <div className="w-10 h-1 bg-border rounded-full mx-auto mb-5" />

            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-medium">오늘의 고민</h2>
              <button onClick={handleClose} className="p-1.5 rounded-full hover:bg-stone-100 transition-colors">
                <X className="w-4 h-4 text-muted" />
              </button>
            </div>

            {/* Textarea + Mic */}
            <div className="relative mb-4">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="고민을 자유롭게 적어보세요..."
                rows={4}
                disabled={submitting}
                autoFocus
                className="w-full resize-none rounded-xl border border-primary/20 bg-stone-50 px-4 py-3 pr-12 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-primary/40 leading-relaxed disabled:opacity-60"
              />
              <button
                onClick={handleMic}
                disabled={submitting}
                aria-label={sttStatus === "listening" ? "음성 인식 중지" : "음성으로 말하기"}
                className={`absolute right-3 bottom-3 p-1.5 rounded-lg transition-colors disabled:opacity-40 ${
                  sttStatus === "listening"
                    ? "text-primary bg-primary/10 animate-pulse"
                    : "text-muted hover:text-foreground hover:bg-stone-200"
                }`}
              >
                {sttStatus === "listening" ? (
                  <MicOff className="w-4 h-4" strokeWidth={1.5} />
                ) : (
                  <Mic className="w-4 h-4" strokeWidth={1.5} />
                )}
              </button>
            </div>

            {/* STT hint */}
            {sttStatus === "listening" && (
              <p className="text-xs text-primary mb-3">듣고 있어요... 말씀해주세요</p>
            )}
            {sttStatus === "error" && (
              <p className="text-xs text-destructive mb-3">음성 인식에 실패했어요. 직접 입력해주세요.</p>
            )}
            {error && (
              <p className="text-xs text-destructive mb-3">{error}</p>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!text.trim() || submitting}
              className="relative w-full py-3 rounded-xl text-sm font-serif font-medium tracking-wide transition-all active:scale-[0.98] disabled:opacity-40 flex items-center justify-center gap-2 overflow-hidden group"
              style={
                !text.trim() || submitting
                  ? { background: "var(--foreground)", color: "var(--background)" }
                  : {
                      background: "linear-gradient(135deg, #6b3a1f 0%, #c9872a 50%, #7c4f1a 100%)",
                      boxShadow: "0 4px 20px rgba(180, 100, 20, 0.4)",
                      color: "white",
                    }
              }
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  처방 만드는 중...
                </>
              ) : (
                <>
                  <span className="relative z-10">✦ 철학적 처방 받기</span>
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                </>
              )}
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
