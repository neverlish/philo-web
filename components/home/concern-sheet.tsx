// components/home/concern-sheet.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Mic, MicOff, X, Loader2 } from "lucide-react";
import { usePostHog } from 'posthog-js/react';
import { trackConcernEntry, type ConcernMode } from '@/lib/posthog/concern-entry-events';
import { practiceAnalyticsHeaders } from '@/lib/posthog/practice-events';

const EMOTION_CHIPS = [
  { label: "인간관계", concern: "소중한 사람과의 관계가 힘들고 어떻게 해야 할지 모르겠어요." },
  { label: "직장·일", concern: "일이 너무 힘들고 지쳐있어요. 의욕이 생기지 않아요." },
  { label: "진로·미래", concern: "앞으로 어떻게 살아야 할지, 방향을 모르겠어요." },
  { label: "자존감", concern: "자신이 부족하게 느껴지고 자존감이 낮아진 것 같아요." },
  { label: "불안", concern: "이유 모를 불안함과 두려움이 자꾸 찾아와요." },
  { label: "외로움", concern: "외롭고 고립된 느낌이 들어요." },
  { label: "삶의 의미", concern: "삶의 의미를 잃은 것 같은 허무감이 있어요." },
  { label: "변화·선택", concern: "중요한 선택 앞에서 결정을 못 하고 계속 망설이고 있어요." },
]

type SttStatus = "idle" | "listening" | "error";

interface SpeechInput {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onstart: () => void;
  onresult: (event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void;
  onend: () => void;
  onerror: () => void;
  start: () => void;
  stop: () => void;
}

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
  const [mode, setMode] = useState<ConcernMode | null>(null);
  const [sttStatus, setSttStatus] = useState<SttStatus>("idle");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechInput | null>(null);
  const requestRef = useRef<AbortController | null>(null);
  const submitLock = useRef(false);

  useEffect(() => () => {
    requestRef.current?.abort();
    recognitionRef.current?.stop();
  }, []);

  useEffect(() => {
    if (isOpen) {
      setText(initialText ?? "");
      setMode(null);
      setError(null);
      setSubmitting(false);
      submitLock.current = false;
      posthog?.capture('concern_sheet_opened', { is_logged_in: isLoggedIn })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) return;
    const speechWindow = window as Window & { SpeechRecognition?: new () => SpeechInput; webkitSpeechRecognition?: new () => SpeechInput };
    const SpeechRecognition = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = "ko-KR";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.onstart = () => setSttStatus("listening");
    recognition.onresult = (event) => {
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
    if (!text.trim() || !mode || submitLock.current) return;
    if (text.trim().length > 1000) { setError('고민은 1000자 이내로 적어주세요.'); return; }
    setSubmitting(true);
    submitLock.current = true;
    stopListening();
    trackConcernEntry('concern_entry_submitted', mode);
    setError(null);
    const request = new AbortController();
    requestRef.current = request;
    const timeout = setTimeout(() => request.abort(), 30000);
    try {
      if (mode === 'dialogue') {
        sessionStorage.setItem("dialogueConcern", text.trim());
        router.push("/preview/dialogue");
      } else {
        const res = await fetch(isLoggedIn ? "/api/prescription/generate" : "/api/prescription/preview", {
          method: "POST",
          headers: { "Content-Type": "application/json", ...practiceAnalyticsHeaders() },
          body: JSON.stringify({ concern: text.trim() }),
          signal: request.signal,
        });
        if (res.status === 429) throw new Error('요청이 많아요. 잠시 후 다시 시도해주세요. 입력은 그대로 남아 있어요.');
        if (res.status === 401) throw new Error('로그인이 만료됐어요. 입력을 복사한 뒤 다시 로그인해주세요.');
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (request.signal.aborted) throw new Error();
        if (isLoggedIn) {
          if (typeof data.prescriptionId !== 'string' || !data.prescriptionId) throw new Error();
          router.push(`/prescription/ai/${data.prescriptionId}`);
        } else {
          const p = data.prescription;
          if (![p?.title, p?.subtitle, p?.philosopher?.name, p?.philosopher?.school, p?.philosopher?.era, p?.quote?.text, p?.quote?.meaning, p?.quote?.application].every(value => typeof value === 'string' && value.trim())) throw new Error();
          sessionStorage.setItem('previewPrescription', JSON.stringify({ ...p, concern: text.trim() }));
          router.push('/preview/prescription');
        }
      }
    } catch (failure) {
      trackConcernEntry('concern_entry_failed', mode);
      setError(request.signal.aborted ? '응답 시간이 길어졌어요. 입력은 그대로 남아 있어요.' : failure instanceof Error && failure.message.startsWith('요청이 많아요') ? failure.message : failure instanceof Error && failure.message.startsWith('로그인이 만료') ? failure.message : '이동하거나 결과를 준비하지 못했어요. 입력은 그대로 남아 있으니 잠시 후 다시 시도해주세요.');
      setSubmitting(false);
      submitLock.current = false;
    } finally {
      clearTimeout(timeout);
      requestRef.current = null;
    }
  };

  const handleClose = () => {
    if (submitLock.current) return;
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
            className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md max-h-[90dvh] overflow-y-auto bg-background rounded-t-3xl px-6 pt-5 pb-10 z-50 shadow-2xl"
          >
            {/* Handle */}
            <div className="w-10 h-1 bg-border rounded-full mx-auto mb-5" />

            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-medium">오늘의 고민</h2>
              <button onClick={handleClose} disabled={submitting} aria-label="닫기" className="p-1.5 rounded-full hover:bg-stone-100 transition-colors disabled:opacity-40">
                <X className="w-4 h-4 text-muted" />
              </button>
            </div>

            <fieldset className="mb-5 border-y border-primary/20 py-4" disabled={submitting}>
              <legend className="px-2 font-serif text-sm">어떻게 생각해보고 싶나요?</legend>
              {([
                ['dialogue', '대화하며 생각하기', '질문을 주고받으며 내 생각을 살펴봐요.'],
                ['reading', '정리된 관점 읽기', 'AI 해설과 실천 제안을 한 번에 읽어요.'],
              ] as const).map(([value, label, description]) => (
                <label key={value} className="flex cursor-pointer items-start gap-3 py-2">
                  <input type="radio" name="concern-mode" value={value} checked={mode === value} onChange={() => {
                    setMode(value);
                    setError(null);
                    trackConcernEntry('concern_mode_selected', value);
                  }} className="mt-1 accent-primary" />
                  <span><span className="block font-serif text-sm">{label}</span><span className="block mt-1 text-xs text-muted">{description}</span></span>
                </label>
              ))}
            </fieldset>

            {/* 감정 칩 */}
            <div className="flex flex-wrap gap-2 mb-4">
              {EMOTION_CHIPS.map(({ label, concern }) => (
                <button
                  key={label}
                  onClick={() => { setText(concern); posthog?.capture('concern_chip_selected', { chip: label }); }}
                  disabled={submitting}
                  className="px-3 py-1.5 rounded-full bg-stone-100 text-xs text-foreground font-medium hover:bg-stone-200 transition-colors disabled:opacity-40"
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Textarea + Mic */}
            <div className="relative mb-4">
              <textarea
                maxLength={1000}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="고민을 자유롭게 적어보세요..."
                rows={4}
                disabled={submitting}
                autoFocus
                className="ph-no-capture ph-mask w-full resize-none rounded-xl border border-primary/20 bg-stone-50 px-4 py-3 pr-12 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-primary/40 leading-relaxed disabled:opacity-60"
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
              <p role="alert" className="text-xs text-destructive mb-3">{error}</p>
            )}

            {/* Submit */}
            <p className="mb-3 text-xs leading-relaxed text-muted" aria-live="polite">
              {mode === 'dialogue' ? '로그인 여부와 관계없이 대화를 체험해요. 처음 고민은 이 탭에 임시 보관하며, 메시지를 보내면 AI에 전달돼요. 대화는 계정에 저장되지 않고 화면을 떠나면 사라져요.' : mode === 'reading' ? isLoggedIn ? '입력을 AI에 보내 해설을 만들고 계정 기록에 저장해요.' : '입력을 AI에 보내 해설을 만들어요. 결과는 이 탭에 임시 보관하며, 계정에 저장하려면 결과 화면에서 로그인해야 해요.' : '두 방식 모두 선택할 수 있어요. 먼저 원하는 방식을 골라주세요.'}
              {mode && ' AI 응답은 틀릴 수 있으며 기존 요청 한도가 적용돼요.'}
            </p>
            <button
              onClick={handleSubmit}
              disabled={!text.trim() || !mode || submitting}
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
                  {mode === 'reading' ? '해설 만드는 중...' : '대화로 이동 중...'}
                </>
              ) : (
                <>
                  <span className="relative z-10">{mode === 'reading' ? '✦ 해설 만들어 읽기' : mode === 'dialogue' ? '✦ 이 고민으로 대화 시작하기' : '생각할 방식을 선택해주세요'}</span>
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
