"use client";

import { useState, useEffect } from "react";
import { Prescription } from "@/types";
import { ArrowLeft, Bookmark, Clock } from "lucide-react";
import { getPhilosopherSymbol } from "@/lib/philosopher-symbols";
import Link from "next/link";
import { usePostHog } from 'posthog-js/react'
import { PushPromptBanner } from "@/components/notification/push-prompt-banner"
import { ShareDropup } from "./share-dropup"
import { IntentionSection } from "./intention-section"

interface PrescriptionDetailProps {
  prescription: Prescription;
  isSaved?: boolean;
  prescriptionId?: string;
  userIntention?: string | null;
  userReflection?: string | null;
  concern?: string | null;
  intentionSuggestions?: string[];
}

export function PrescriptionDetail({
  prescription,
  isSaved: initialIsSaved = false,
  prescriptionId,
  userIntention,
  userReflection,
  concern,
  intentionSuggestions = [],
}: PrescriptionDetailProps) {
  const { quote, philosopher, title, subtitle } = prescription;
  const philosopherSymbol = getPhilosopherSymbol(philosopher.name);
  const [saved, setSaved] = useState(initialIsSaved);
  const [saving, setSaving] = useState(false);
  const posthog = usePostHog()

  useEffect(() => {
    if (prescriptionId) {
      posthog?.capture('prescription_viewed', {
        prescription_id: prescriptionId,
        philosopher: philosopher.name,
        is_saved: initialIsSaved,
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prescriptionId])
  const toggleSave = async () => {
    if (!prescriptionId || saving) return;
    setSaving(true);
    const prevSaved = saved;
    setSaved(!saved);

    try {
      const method = prevSaved ? 'DELETE' : 'POST';
      const res = await fetch(`/api/prescriptions/${prescriptionId}/save`, { method });
      if (!res.ok && res.status !== 409) {
        setSaved(prevSaved);
      } else if (!prevSaved) {
        posthog?.capture('prescription_saved', { prescription_id: prescriptionId })
      }
    } catch {
      setSaved(prevSaved);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md px-4 py-6 flex items-center justify-between">
        <Link href="/" className="p-2 -ml-2 hover:bg-primary/10 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-serif text-xl font-bold flex-1 text-center pr-8">오늘의 처방</h1>
      </header>

      {/* Content */}
      <main className="flex-1 px-6 py-4">
        {/* Header Section */}
        <header className="mb-10 text-center">
          {concern && (
            <p className="text-xs text-muted mb-3 italic break-keep">
              &ldquo;{concern}&rdquo;
            </p>
          )}
          <h2 className="font-serif text-2xl font-bold leading-tight mb-2 text-foreground">
            {title}
          </h2>
          <p className="text-muted text-sm">{subtitle}</p>
        </header>

        {/* Quote Card */}
        <section className="bg-card rounded-3xl p-8 mb-8 shadow-sm relative overflow-hidden">
          <span
            className="absolute -top-3 -right-2 text-[88px] font-light text-foreground pointer-events-none select-none leading-none"
            style={{ opacity: 0.07 }}
            aria-hidden
          >
            {philosopherSymbol}
          </span>
          <div className="relative z-10">
            <span className="inline-block border border-foreground rounded-full px-4 py-1 text-xs mb-6 font-serif">
              오늘의 처방
            </span>
            <blockquote className="font-serif text-xl leading-relaxed mb-8 text-foreground">
              {quote.text}
            </blockquote>
            <div className="flex items-center justify-between">
              <div>
                {philosopher.id !== 'ai-generated' ? (
                  <Link href={`/philosopher/${philosopher.id}`} className="font-bold text-base font-serif text-foreground hover:text-primary transition-colors underline underline-offset-2">
                    {philosopher.name}
                  </Link>
                ) : (
                  <p className="font-bold text-base font-serif text-foreground">
                    {philosopher.name}
                  </p>
                )}
                <p className="text-xs text-muted uppercase tracking-wider mt-1">
                  {philosopher.school}, &lt;{philosopher.era}&gt;
                </p>
              </div>
              <button
                onClick={toggleSave}
                disabled={saving || !prescriptionId}
                className="p-3 bg-background rounded-full hover:bg-stone-100 transition-colors disabled:opacity-50"
              >
                <Bookmark
                  className="w-5 h-5"
                  strokeWidth={1.5}
                  fill={saved ? "currentColor" : "none"}
                />
              </button>
            </div>
          </div>
        </section>

        {/* Interpretation Section */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1 h-4 bg-foreground" />
            <h2 className="text-sm font-bold tracking-widest">오늘의 지혜</h2>
          </div>
          <div className="space-y-4 text-foreground/80 text-[15px] leading-relaxed">
            <p>{quote.meaning}</p>
          </div>
        </section>

        {/* Action Item Section */}
        <section className="mb-12">
          <div className="bg-primary/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-card p-1.5 rounded-lg">
                <Clock className="w-4 h-4 text-primary" strokeWidth={2} />
              </div>
              <h3 className="font-bold text-sm">실천하기</h3>
            </div>
            <p className="text-[15px] leading-relaxed text-foreground/90">
              {quote.application}
            </p>
          </div>
        </section>

        <IntentionSection
          prescriptionId={prescriptionId}
          initialIntention={userIntention}
          intentionSuggestions={intentionSuggestions}
          initialReflection={userReflection}
        />

        {/* Footer Actions */}
        <footer className="flex flex-col gap-3 mb-8">
          <ShareDropup
            prescriptionId={prescriptionId}
            concern={concern}
            quote={quote.text}
            philosopherName={philosopher.name}
            philosopherSchool={philosopher.school}
          />
          <button
            onClick={toggleSave}
            disabled={saving || !prescriptionId}
            className={`flex items-center justify-center gap-2 py-4 rounded-xl font-medium text-sm transition-all active:scale-95 disabled:opacity-50 ${
              saved
                ? "bg-primary/10 text-primary border border-primary/20"
                : "bg-foreground text-background"
            }`}
          >
            <Bookmark
              className="w-4 h-4"
              strokeWidth={1.5}
              fill={saved ? "currentColor" : "none"}
            />
            {saved ? "저장됨" : "저장하기"}
          </button>
        </footer>

        {/* Next Action */}
        <div className="pb-8">
          <Link
            href="/"
            className="flex items-center justify-center w-full py-3.5 rounded-xl text-sm text-muted font-sans transition-all active:scale-[0.98]"
            style={{ background: '#fff' }}
          >
            홈으로 가기
          </Link>
        </div>
      </main>
      <PushPromptBanner />
    </div>
  );
}
