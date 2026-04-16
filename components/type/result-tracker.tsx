"use client";

import { useEffect, useState } from "react";
import { usePostHog } from "posthog-js/react";
import Link from "next/link";
import { Share2, Check } from "lucide-react";
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
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = `${window.location.origin}/type/result/${philosopherKey}`;
    const text = `나는 ${philosopherName}형 철학자예요! 나의 철학자 유형은?`;
    posthog?.capture("quiz_result_shared", { philosopher: philosopherKey });

    if (navigator.share) {
      await navigator.share({ title: text, url });
    } else {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
      <button
        onClick={handleShare}
        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-sans text-sm font-medium transition-all active:scale-[0.98]"
        style={{ background: "#fff" }}
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-primary" strokeWidth={2} />
            <span className="text-primary">링크 복사됨!</span>
          </>
        ) : (
          <>
            <Share2 className="w-4 h-4 text-muted" strokeWidth={1.5} />
            <span className="text-muted">결과 공유하기</span>
          </>
        )}
      </button>
      <Link
        href="/type/quiz"
        onClick={() => posthog?.capture("quiz_retaken", { philosopher: philosopherKey })}
        className="flex items-center justify-center w-full py-3 rounded-xl font-sans text-xs text-muted/60 transition-all active:scale-[0.98]"
      >
        다시 테스트하기
      </Link>
    </div>
  );
}
