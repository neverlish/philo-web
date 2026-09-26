"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { usePostHog } from "posthog-js/react";

const STORAGE_KEY = "philo_onboarding_v1";

const slides = [
  {
    eyebrow: "오늘의철학 · 첫 장",
    title: "마음에 남은 일\n하나면 충분해요",
    body: "친구에게 서운했던 순간, 내 뜻대로 안 된 하루.\n철학을 몰라도 내 경험에서 시작할 수 있어요.",
    note: "로그인 없는 생활 철학 연습부터 가볍게 만나보세요.",
  },
  {
    eyebrow: "다른 눈으로 보기",
    title: "내 생각 옆에\n다른 질문을 놓아요",
    body: "처음 든 생각을 살펴보고, 다른 사정을 만나보세요.\n생각이 바뀌지 않아도 그 이유가 분명해질 수 있어요.",
    note: "처음의 생각 → 다른 관점 → 생활로 가져갈 질문",
  },
  {
    eyebrow: "다시 돌아올 자리",
    title: "작은 질문 하나를\n생활로 가져가요",
    body: "오늘 해볼 작은 실험을 고르고, 나중에 돌아보세요.\n못 했어도 괜찮아요. 지금의 생각에서 이어가면 돼요.",
    note: "생활 철학 기록은 원할 때만 이 기기에 저장해요.",
  },
];

interface OnboardingSlidesProps {
  onDone: () => void;
}

export function OnboardingSlides({ onDone }: OnboardingSlidesProps) {
  const [current, setCurrent] = useState(0);
  const reducedMotion = useReducedMotion();
  const posthog = usePostHog();

  useEffect(() => {
    posthog?.capture("onboarding_started");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isLast = current === slides.length - 1;

  const handleNext = () => {
    if (isLast) {
      handleDone("completed");
    } else {
      setCurrent((c) => c + 1);
    }
  };

  const handleDone = (reason: "completed" | "dismissed") => {
    try { localStorage.setItem(STORAGE_KEY, "1"); } catch { /* Closing must work without browser storage. */ }
    posthog?.capture("onboarding_" + reason, { slide: current });
    onDone();
  };

  const slide = slides[current];

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-background max-w-md mx-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      {/* Dismiss */}
      <div className="flex justify-end px-6 pt-5">
        <button
          onClick={() => handleDone("dismissed")}
          className="p-2 text-muted/50 hover:text-muted transition-colors"
          aria-label="건너뛰기"
        >
          <X className="w-5 h-5" strokeWidth={1.5} />
        </button>
      </div>

      {/* Slide content */}
      <div className="min-h-0 flex-1 overflow-y-auto px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: reducedMotion ? 0 : 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: reducedMotion ? 0 : -24 }}
            transition={{ duration: reducedMotion ? 0 : 0.25 }}
          >
            <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted mb-3">
              {slide.eyebrow}
            </p>
            <h2 id="onboarding-title" className="text-3xl font-serif font-normal leading-tight text-foreground mb-4 break-keep whitespace-pre-line">
              {slide.title}
            </h2>
            <p className="text-muted text-sm leading-relaxed whitespace-pre-line">
              {slide.body}
            </p>
            <div className="mt-8 border-y border-[#35463d]/25 py-6">
              <p className="mb-4 font-serif text-4xl text-[#35463d]/60" aria-hidden="true">0{current + 1}</p>
              <p className="text-sm leading-7 text-[#35463d]">{slide.note}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom controls */}
      <div className="shrink-0 px-8 pb-8">
        {/* Dots */}
        <div className="flex items-center justify-center gap-1.5 mb-8">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i === current ? "w-4 h-1.5 bg-[#35463d]" : "w-1.5 h-1.5 bg-border"
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="min-h-12 w-full bg-[#35463d] py-4 text-sm font-medium text-background focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          {isLast ? "내 하루에서 시작하기" : "다음"}
        </button>
      </div>
    </div>
  );
}

export function useOnboarding() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let shouldShow = true;
    try {
      shouldShow = !localStorage.getItem(STORAGE_KEY);
    } catch { /* Storage is optional; keep the introduction dismissible. */ }
    // Browser-only preference must be read after hydration to match server markup.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShow(shouldShow);
  }, []);

  return { show, done: () => setShow(false) };
}
