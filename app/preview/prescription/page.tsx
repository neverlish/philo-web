"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock, Sparkles } from "lucide-react";
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

        {/* Application */}
        <section className="mb-12">
          <div className="bg-primary/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-card p-1.5 rounded-lg">
                <Clock className="w-4 h-4 text-primary" strokeWidth={2} />
              </div>
              <h3 className="font-bold text-sm">실천하기</h3>
            </div>
            <p className="text-[15px] leading-relaxed text-foreground/90">{quote.application}</p>
          </div>
        </section>

        {/* CTA */}
        <section className="pb-12">
          <button
            onClick={() => setShowLogin(true)}
            className="flex items-center justify-center w-full bg-foreground text-background py-4 rounded-xl font-medium text-sm transition-all active:scale-95"
          >
            구글로 회원가입하고 저장하기
          </button>
        </section>
      </main>

      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </div>
  );
}
