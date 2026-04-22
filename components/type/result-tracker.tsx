"use client";

import { useEffect, useState } from "react";
import { usePostHog } from "posthog-js/react";
import Link from "next/link";
import { Share2, Link2, ChevronUp } from "lucide-react";
import { type PhilosopherKey, getSajuInfo, type SajuInfo } from "@/lib/quiz";

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

interface SajuBannerProps {
  philosopherName: string;
}

export function SajuBanner({ philosopherName }: SajuBannerProps) {
  const [sajuInfo, setSajuInfo] = useState<SajuInfo | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('philo_quiz_birth_year')
    if (!stored) return
    const year = parseInt(stored)
    if (year >= 1924 && year <= 2024) {
      setSajuInfo(getSajuInfo(year))
    }
  }, []);

  if (!sajuInfo) return null;

  return (
    <section
      className="rounded-2xl px-5 py-4 mb-6 flex items-center gap-3"
      style={{ background: 'rgba(236,91,19,0.06)', border: '1px solid rgba(236,91,19,0.12)' }}
    >
      <span className="text-2xl">{sajuInfo.zodiacEmoji}</span>
      <div>
        <p className="text-xs text-primary font-medium font-sans">
          {sajuInfo.zodiac}띠의 철학자
        </p>
        <p className="text-xs text-muted font-sans mt-0.5">
          {sajuInfo.zodiacDesc} — {philosopherName}와 공명합니다
        </p>
      </div>
    </section>
  );
}

interface ResultCtaProps {
  philosopherKey: PhilosopherKey;
  philosopherName: string;
}

export function ResultCta({ philosopherKey, philosopherName }: ResultCtaProps) {
  const posthog = usePostHog();
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [sajuInfo, setSajuInfo] = useState<SajuInfo | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('philo_quiz_birth_year')
    if (!stored) return
    const year = parseInt(stored)
    if (year >= 1924 && year <= 2024) {
      setSajuInfo(getSajuInfo(year))
    }
  }, []);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : ''
  const shareUrl = `${baseUrl}/type/result/${philosopherKey}?utm_source=share&utm_medium=type_quiz`
  const shareText = sajuInfo
    ? `${sajuInfo.zodiacEmoji} 나는 ${sajuInfo.zodiac}띠 ${philosopherName}형!\n나의 철학 사주는?`
    : `나는 ${philosopherName}형 철학자예요! 나의 철학자 유형은?`

  const handleNativeShare = async () => {
    if (sharing) return;
    setSharing(true);
    try {
      await navigator.share({ title: shareText, url: shareUrl });
      posthog?.capture("quiz_result_shared", { philosopher: philosopherKey, share_method: "native", hasSaju: !!sajuInfo });
    } catch {
      // 사용자가 취소한 경우 무시
    } finally {
      setSharing(false);
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      posthog?.capture("quiz_result_shared", { philosopher: philosopherKey, share_method: "clipboard", hasSaju: !!sajuInfo });
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
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

      {/* 공유 드롭업 */}
      <div className="relative">
        {showShareMenu && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowShareMenu(false)} />
            <div className="absolute bottom-full mb-2 left-0 right-0 z-20 bg-card border border-border rounded-xl overflow-hidden shadow-lg">
              <button
                onClick={() => { handleNativeShare(); setShowShareMenu(false); }}
                disabled={sharing}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-sm font-medium hover:bg-stone-50 transition-colors disabled:opacity-50"
              >
                <Share2 className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                앱으로 공유
              </button>
              <div className="border-t border-border" />
              <button
                onClick={() => { handleCopyUrl(); setShowShareMenu(false); }}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-sm font-medium hover:bg-stone-50 transition-colors"
              >
                <Link2 className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                {copied ? "복사됨" : "링크 복사"}
              </button>
            </div>
          </>
        )}
        <button
          onClick={() => setShowShareMenu((v) => !v)}
          className="flex w-full items-center justify-center gap-2 py-3.5 rounded-xl font-medium text-sm transition-all active:scale-95 hover:bg-stone-50"
          style={{ background: "#fff" }}
        >
          <Share2 className="w-4 h-4 text-muted" strokeWidth={1.5} />
          <span className="text-muted">결과 공유하기</span>
          <ChevronUp
            className={`w-4 h-4 text-muted transition-transform duration-200 ${showShareMenu ? "" : "rotate-180"}`}
            strokeWidth={1.5}
          />
        </button>
      </div>

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
