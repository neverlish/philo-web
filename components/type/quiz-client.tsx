"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { QUESTIONS } from "@/lib/quiz";
import { calculateResult } from "@/lib/quiz";
import { usePostHog } from 'posthog-js/react';

export function QuizClient() {
  const router = useRouter();
  const posthog = usePostHog();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(QUESTIONS.length).fill(null)
  );
  const [selected, setSelected] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const startedRef = useRef(false);

  const question = QUESTIONS[currentQ];
  const progress = ((currentQ) / QUESTIONS.length) * 100;
  const isLast = currentQ === QUESTIONS.length - 1;

  function handleSelect(idx: number) {
    if (isTransitioning) return;
    setSelected(idx);
    // 첫 선택 시 퀴즈 시작 이벤트
    if (!startedRef.current && currentQ === 0) {
      startedRef.current = true;
      posthog?.capture('quiz_started');
    }
  }

  function handleNext() {
    if (selected === null || isTransitioning) return;

    const newAnswers = [...answers];
    newAnswers[currentQ] = selected;
    setAnswers(newAnswers);

    if (isLast) {
      const result = calculateResult(newAnswers as number[]);
      posthog?.capture('quiz_completed', { result_philosopher: result });
      router.push(`/type/result/${result}`);
      return;
    }

    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentQ((q) => q + 1);
      setSelected(null);
      setIsTransitioning(false);
    }, 200);
  }

  function handleBack() {
    if (currentQ === 0) return;
    setCurrentQ((q) => q - 1);
    setSelected(answers[currentQ - 1]);
  }

  return (
    <div className="min-h-dvh flex flex-col max-w-md mx-auto bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-md px-4 py-4">
        <div className="flex items-center gap-3 mb-4">
          {currentQ === 0 ? (
            <Link
              href="/type"
              className="p-2 -ml-2 hover:bg-primary/10 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
          ) : (
            <button
              onClick={handleBack}
              className="p-2 -ml-2 hover:bg-primary/10 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <span className="flex-1 text-center text-sm text-muted font-sans">
            {currentQ + 1} / {QUESTIONS.length}
          </span>
          <div className="w-9" />
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-border rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #a33900, #ec5b13)',
            }}
          />
        </div>
      </header>

      {/* Question */}
      <main className="flex-1 px-6 pt-10 pb-6 flex flex-col">
        <h2
          className="font-serif text-2xl font-bold leading-snug text-foreground mb-10 transition-opacity duration-200"
          style={{ opacity: isTransitioning ? 0 : 1 }}
        >
          {question.question}
        </h2>

        {/* Choices */}
        <div
          className="flex flex-col gap-3 flex-1 transition-opacity duration-200"
          style={{ opacity: isTransitioning ? 0 : 1 }}
        >
          {question.choices.map((choice, idx) => {
            const isChosen = selected === idx;
            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                className="relative w-full text-left px-5 py-4 rounded-2xl transition-all duration-200 active:scale-[0.98]"
                style={{
                  background: isChosen ? 'rgba(236,91,19,0.08)' : '#ffffff',
                  border: isChosen
                    ? '1.5px solid rgba(236,91,19,0.4)'
                    : '1.5px solid transparent',
                  boxShadow: '0 2px 12px rgba(44,36,32,0.06)',
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center transition-all"
                    style={{
                      background: isChosen ? '#ec5b13' : 'transparent',
                      border: isChosen ? 'none' : '1.5px solid #e7e5e4',
                    }}
                  >
                    {isChosen && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                  </div>
                  <span
                    className="text-[15px] leading-relaxed font-sans"
                    style={{ color: isChosen ? '#a33900' : '#2C2420' }}
                  >
                    {choice.text}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Next button */}
        <div className="pt-8 pb-4">
          <button
            onClick={handleNext}
            disabled={selected === null}
            className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-serif font-medium text-sm tracking-wide transition-all active:scale-[0.98] text-white disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
            style={{
              background: 'linear-gradient(135deg, #a33900 0%, #ec5b13 100%)',
              boxShadow: selected !== null ? '0 4px 24px rgba(236, 91, 19, 0.35)' : 'none',
            }}
          >
            {isLast ? '결과 보기' : '다음'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
}
