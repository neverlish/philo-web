"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock, Sparkles, Lock, Flame, Bell } from "lucide-react";
import Link from "next/link";
import { LoginModal } from "@/components/auth/LoginModal";

interface PreviewPrescription {
  concern: string;
  philosopher: { name: string; school: string; era: string };
  quote: { text: string; meaning: string; application: string };
  title: string;
  subtitle: string;
}

export default function PreviewPrescriptionPage() {
  const router = useRouter();
  const [data, setData] = useState<PreviewPrescription | null>(null);
  const [showLogin, setShowLogin] = useState(false);

  const openLoginWithSaveIntent = () => {
    sessionStorage.setItem('pendingPreviewSave', 'true');
    setShowLogin(true);
  };

  useEffect(() => {
    const stored = sessionStorage.getItem("previewPrescription");
    if (!stored) {
      router.replace("/");
      return;
    }
    try {
      setData(JSON.parse(stored));
    } catch {
      router.replace("/");
    }
  }, [router]);

  if (!data) return null;

  const { philosopher, quote, title, subtitle } = data;

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md px-4 py-6 flex items-center">
        <Link href="/" className="p-2 -ml-2 hover:bg-primary/10 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-serif text-xl font-bold flex-1 text-center pr-8">미리보기 처방</h1>
      </header>

      {/* Preview Banner */}
      <div className="mx-6 mb-2 mt-1 flex items-center gap-2 bg-primary/10 rounded-xl px-4 py-3">
        <Sparkles className="w-4 h-4 text-primary flex-shrink-0" strokeWidth={1.5} />
        <p className="text-xs text-primary leading-relaxed">
          회원가입하면 이 처방을 저장하고 매일 새로운 처방을 받을 수 있어요
        </p>
      </div>

      {/* Content */}
      <main className="flex-1 px-6 py-4">
        {/* Title */}
        <header className="mb-10 text-center">
          {data.concern && (
            <p className="text-xs text-muted mb-3 italic break-keep">
              &ldquo;{data.concern}&rdquo;
            </p>
          )}
          <h2 className="font-serif text-2xl font-bold leading-tight mb-2 text-foreground">
            {title}
          </h2>
          <p className="text-muted text-sm">{subtitle}</p>
        </header>

        {/* Quote Card */}
        <section className="bg-card rounded-3xl p-8 mb-8 shadow-sm relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-background rounded-full opacity-50" />
          <div className="relative z-10">
            <span className="inline-block border border-foreground rounded-full px-4 py-1 text-xs mb-6 font-serif">
              오늘의 처방
            </span>
            <blockquote className="font-serif text-xl leading-relaxed mb-8 text-foreground">
              {quote.text}
            </blockquote>
            <div>
              <p className="font-bold text-base font-serif text-foreground">{philosopher.name}</p>
              <p className="text-xs text-muted uppercase tracking-wider mt-1">
                {philosopher.school}, &lt;{philosopher.era}&gt;
              </p>
            </div>
          </div>
        </section>

        {/* Meaning */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1 h-4 bg-foreground" />
            <h2 className="text-sm font-bold tracking-widest">오늘의 지혜</h2>
          </div>
          <p className="text-foreground/80 text-[15px] leading-relaxed">{quote.meaning}</p>
        </section>

        {/* Application — 블러 처리, 회원가입 후 공개 */}
        <section className="mb-12 relative">
          <div className="bg-primary/10 rounded-2xl p-6 blur-sm select-none pointer-events-none" aria-hidden>
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-card p-1.5 rounded-lg">
                <Clock className="w-4 h-4 text-primary" strokeWidth={2} />
              </div>
              <h3 className="font-bold text-sm">실천하기</h3>
            </div>
            <p className="text-[15px] leading-relaxed text-foreground/90">{quote.application}</p>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl bg-background/60 backdrop-blur-[2px]">
            <div className="flex items-center gap-2 text-foreground">
              <Lock className="w-4 h-4" strokeWidth={1.5} />
              <p className="text-sm font-medium">실천 방법은 회원만 볼 수 있어요</p>
            </div>
            <button
              onClick={() => openLoginWithSaveIntent()}
              className="px-5 py-2 rounded-full bg-foreground text-background text-xs font-medium transition-all active:scale-95"
            >
              회원가입하고 확인하기
            </button>
          </div>
        </section>

        {/* Streak Teaser */}
        <section className="mb-8">
          <div className="border border-foreground/10 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="w-4 h-4 text-orange-400" strokeWidth={1.5} />
              <h3 className="text-sm font-bold">오늘이 1일차!</h3>
            </div>
            <div className="flex items-center gap-2 mb-4">
              {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                <div
                  key={day}
                  className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl text-xs font-medium transition-all ${
                    day === 1
                      ? "bg-orange-400/20 text-orange-400 border border-orange-400/30"
                      : "bg-foreground/5 text-foreground/20"
                  }`}
                >
                  <span>{day}</span>
                  <span className="text-[9px] opacity-70">일</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted leading-relaxed">
              회원가입하면 오늘부터 연속 기록이 시작돼요. 매일 처방을 받으며 철학적 사유의 습관을 만들어보세요.
            </p>
          </div>
        </section>

        {/* Notification Hook */}
        <section className="mb-8">
          <button
            onClick={() => openLoginWithSaveIntent()}
            className="w-full flex items-center gap-4 bg-foreground/5 hover:bg-foreground/10 rounded-2xl p-5 text-left transition-colors active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
              <Bell className="w-4 h-4 text-primary" strokeWidth={1.5} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">내일도 처방 받기</p>
              <p className="text-xs text-muted mt-0.5">회원가입하면 매일 오전 알림을 보내드려요</p>
            </div>
            <ArrowLeft className="w-4 h-4 text-muted rotate-180 flex-shrink-0" />
          </button>
        </section>

        {/* CTA */}
        <section className="pb-12">
          <button
            onClick={() => openLoginWithSaveIntent()}
            className="relative flex items-center justify-center w-full py-4 rounded-xl font-serif font-medium text-sm tracking-wide transition-all active:scale-[0.98] overflow-hidden group"
            style={{
              background: "linear-gradient(135deg, #6b3a1f 0%, #c9872a 50%, #7c4f1a 100%)",
              boxShadow: "0 4px 24px rgba(180, 100, 20, 0.4)",
              color: "white",
            }}
          >
            <span className="relative z-10">✦ 구글로 회원가입하고 저장하기</span>
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
          </button>
        </section>
      </main>

      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </div>
  );
}
