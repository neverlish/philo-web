"use client";

import { useState } from "react";
import { Prescription } from "@/types";
import { ArrowLeft, Bookmark, Share2, Clock } from "lucide-react";
import Link from "next/link";
import { usePostHog } from 'posthog-js/react'

interface PrescriptionDetailProps {
  prescription: Prescription;
  isSaved?: boolean;
  prescriptionId?: string;
}

export function PrescriptionDetail({
  prescription,
  isSaved: initialIsSaved = false,
  prescriptionId,
}: PrescriptionDetailProps) {
  const { quote, philosopher, title, subtitle } = prescription;
  const [saved, setSaved] = useState(initialIsSaved);
  const [saving, setSaving] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [shared, setShared] = useState(false);
  const posthog = usePostHog()

  const toggleSave = async () => {
    if (!prescriptionId || saving) return;
    setSaving(true);
    const prevSaved = saved;
    setSaved(!saved);
    if (!prevSaved) {
      posthog?.capture('prescription_saved', { prescription_id: prescriptionId })
    }

    try {
      const method = prevSaved ? 'DELETE' : 'POST';
      const res = await fetch(`/api/prescriptions/${prescriptionId}/save`, { method });
      if (!res.ok && res.status !== 409) {
        setSaved(prevSaved);
      }
    } catch {
      setSaved(prevSaved);
    } finally {
      setSaving(false);
    }
  };

  const handleShare = async () => {
    if (sharing) return;
    setSharing(true);

    const text = `"${quote.text}"\n— ${philosopher.name} (${philosopher.school})\n\n오늘의철학 앱에서 받은 처방입니다.`;
    const shareData = {
      title: `${philosopher.name}의 처방`,
      text,
    };

    try {
      let shareMethod: 'native' | 'clipboard'
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
        shareMethod = 'native'
      } else {
        await navigator.clipboard.writeText(text);
        shareMethod = 'clipboard'
      }
      posthog?.capture('prescription_shared', { share_method: shareMethod })
      setShared(true);
      setTimeout(() => setShared(false), 1500);
    } catch {
      // 사용자가 취소한 경우 무시
    } finally {
      setSharing(false);
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
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-base font-serif text-foreground">
                  {philosopher.name}
                </p>
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

        {/* Footer Actions */}
        <footer className="grid grid-cols-2 gap-4">
          <button
            onClick={handleShare}
            disabled={sharing}
            className="flex items-center justify-center gap-2 bg-card border border-border py-4 rounded-xl font-medium text-sm transition-all active:scale-95 hover:bg-stone-50 disabled:opacity-50"
          >
            <Share2 className="w-4 h-4" strokeWidth={1.5} />
            {shared ? "공유됨" : "공유하기"}
          </button>
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
      </main>
    </div>
  );
}
