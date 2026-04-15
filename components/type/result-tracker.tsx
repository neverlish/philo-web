"use client";

import { useEffect } from "react";
import { usePostHog } from "posthog-js/react";
import Link from "next/link";
import { type PhilosopherKey } from "@/lib/quiz";

interface ResultTrackerProps {
  philosopherKey: PhilosopherKey;
  philosopherName: string;
}

export function ResultTracker({ philosopherKey, philosopherName }: ResultTrackerProps) {
  const posthog = usePostHog();

  useEffect(() => {
    posthog?.capture("quiz_result_viewed", { philosopher: philosopherKey });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

interface ResultCtaProps {
  philosopherKey: PhilosopherKey;
  philosopherName: string;
}

export function ResultCta({ philosopherKey, philosopherName }: ResultCtaProps) {
  const posthog = usePostHog();

  return (
    <div className="flex flex-col gap-3">
      <Link
        href="/opening"
        onClick={() => posthog?.capture("quiz_result_cta_clicked", { philosopher: philosopherKey })}
        className="flex items-center justify-center w-full py-4 rounded-xl font-serif font-medium text-sm tracking-wide transition-all active:scale-[0.98] text-white"
        style={{
          background: "linear-gradient(135deg, #a33900 0%, #ec5b13 100%)",
          boxShadow: "0 4px 24px rgba(236, 91, 19, 0.35)",
        }}
      >
        ✦ {philosopherName}의 처방 받으러 가기
      </Link>
      <Link
        href="/type/quiz"
        onClick={() => posthog?.capture("quiz_retaken", { philosopher: philosopherKey })}
        className="flex items-center justify-center w-full py-3.5 rounded-xl font-sans text-sm text-muted transition-all active:scale-[0.98]"
        style={{ background: "#fff" }}
      >
        다시 테스트하기
      </Link>
    </div>
  );
}
