"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { usePostHog } from "posthog-js/react";

const STORAGE_KEY = "philo_onboarding_v1";

const slides = [
  {
    eyebrow: "지혜의 다리",
    title: "고민이 있나요?",
    body: "소크라테스, 노자, 니체가 당신의 말을 듣습니다.\n2천 년의 지혜가 오늘을 위해 준비돼 있어요.",
    visual: (
      <div className="flex items-center justify-center gap-4 py-6">
        {["소크라테스", "노자", "니체"].map((name) => (
          <div key={name} className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl">✦</span>
            </div>
            <span className="text-xs text-muted">{name}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    eyebrow: "사용법",
    title: "2분이면\n처방을 받아요",
    body: "고민을 말하면 AI가 어울리는 철학자를 찾아\n당신만의 처방을 만들어줍니다.",
    visual: (
      <div className="flex items-center justify-center gap-2 py-6">
        {[
          { step: "01", label: "고민 입력" },
          { step: "02", label: "처방 생성" },
          { step: "03", label: "실천하기" },
        ].map(({ step, label }, i, arr) => (
          <div key={step} className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-xl bg-card border border-border">
              <span className="text-[11px] font-mono font-bold text-primary">{step}</span>
              <span className="text-[11px] text-foreground font-medium whitespace-nowrap">{label}</span>
            </div>
            {i < arr.length - 1 && <span className="text-muted/40 text-sm">→</span>}
          </div>
        ))}
      </div>
    ),
  },
  {
    eyebrow: "시작하기",
    title: "나의 철학자\n유형은 무엇일까요?",
    body: "7가지 질문으로 나와 가장 잘 맞는 철학자를 알 수 있어요.\n처음이라면 퀴즈부터 시작해보세요.",
    visual: (
      <div className="flex items-center justify-center py-6">
        <div
          className="flex items-center gap-3 px-5 py-3.5 rounded-xl"
          style={{
            background: "linear-gradient(135deg, #2C2420 0%, #5a3820 60%, #ec5b13 100%)",
          }}
        >
          <span className="text-white/80 text-xl">✦</span>
          <div>
            <p className="font-serif text-white text-sm font-bold leading-snug">나의 철학자 유형은?</p>
            <p className="text-white/60 text-[11px]">7가지 질문 · 약 2분</p>
          </div>
        </div>
      </div>
    ),
  },
];

interface OnboardingSlidesProps {
  onDone: () => void;
}

export function OnboardingSlides({ onDone }: OnboardingSlidesProps) {
  const [current, setCurrent] = useState(0);
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
    localStorage.setItem(STORAGE_KEY, "1");
    posthog?.capture("onboarding_" + reason, { slide: current });
    onDone();
  };

  const slide = slides[current];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background max-w-md mx-auto">
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
      <div className="flex-1 flex flex-col justify-center px-8 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
          >
            <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted mb-3">
              {slide.eyebrow}
            </p>
            <h2 className="text-3xl font-serif font-normal leading-tight text-foreground mb-4 break-keep whitespace-pre-line">
              {slide.title}
            </h2>
            <p className="text-muted text-sm leading-relaxed whitespace-pre-line">
              {slide.body}
            </p>
            {slide.visual}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom controls */}
      <div className="px-8 pb-12">
        {/* Dots */}
        <div className="flex items-center justify-center gap-1.5 mb-8">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i === current ? "w-4 h-1.5 bg-primary" : "w-1.5 h-1.5 bg-border"
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="w-full py-4 rounded-xl bg-foreground text-background text-sm font-medium transition-all active:scale-95"
        >
          {isLast ? "시작하기" : "다음"}
        </button>
      </div>
    </div>
  );
}

export function useOnboarding() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem(STORAGE_KEY)) {
      setShow(true);
    }
  }, []);

  return { show, done: () => setShow(false) };
}
