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
      {/* 전환 유인 카드 */}
      <Link
        href="/opening"
        onClick={() => posthog?.capture("quiz_result_cta_clicked", { philosopher: philosopherKey })}
        className="block rounded-2xl p-6 transition-all active:scale-[0.98]"
        style={{
          background: "linear-gradient(135deg, #2C2420 0%, #5a3820 55%, #ec5b13 100%)",
          boxShadow: "0 8px 32px rgba(44,36,32,0.18)",
        }}
      >
        <p className="text-white/50 text-[11px] tracking-widest uppercase mb-2 font-sans">
          오늘의 철학 처방
        </p>
        <h3 className="font-serif text-white text-xl font-bold leading-snug mb-3">
          {philosopherName}가 오늘<br />당신의 고민을 듣습니다
        </h3>
        <p className="text-white/65 text-sm leading-relaxed mb-5 font-sans">
          지금 마음을 어지럽히는 것을 말해보세요.<br />
          2천 년의 지혜로 오늘만의 처방을 드려요.
        </p>
        {/* 미리보기 처방 힌트 */}
        <div className="rounded-xl px-4 py-3 mb-5" style={{ background: "rgba(255,255,255,0.08)" }}>
          <p className="text-white/40 text-xs mb-1.5 font-sans italic">&ldquo;인간관계가 너무 힘들어요&rdquo;</p>
          <p className="text-white/70 text-sm leading-relaxed font-sans line-clamp-2">
            {philosopherName}라면 이렇게 말했을 거예요 —
            오늘 당신의 고민에 맞는 처방이 기다리고 있어요.
          </p>
        </div>
        <div
          className="flex items-center justify-center w-full py-3.5 rounded-xl font-serif font-medium text-sm tracking-wide text-white"
          style={{
            background: "linear-gradient(135deg, #a33900 0%, #ec5b13 100%)",
            boxShadow: "0 4px 16px rgba(236,91,19,0.4)",
          }}
        >
          ✦ 지금 처방 받으러 가기
        </div>
      </Link>

      {/* 공유 */}
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
