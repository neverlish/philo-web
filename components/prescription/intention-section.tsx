"use client";

import { useState } from "react";
import { usePostHog } from "posthog-js/react";
import { CheckCircle } from "lucide-react";

interface IntentionSectionProps {
  prescriptionId?: string;
  initialIntention?: string | null;
  intentionSuggestions: string[];
  initialReflection?: string | null;
}

export function IntentionSection({
  prescriptionId,
  initialIntention,
  intentionSuggestions,
  initialReflection,
}: IntentionSectionProps) {
  const [intention, setIntention] = useState(initialIntention ?? "");
  const [intentionSaved, setIntentionSaved] = useState(!!initialIntention);
  const [savingIntention, setSavingIntention] = useState(false);
  const [reflection, setReflection] = useState(initialReflection ?? "");
  const [reflectionSaved, setReflectionSaved] = useState(!!initialReflection);
  const [savingReflection, setSavingReflection] = useState(false);
  const posthog = usePostHog();

  const handleSaveIntention = async () => {
    if (!prescriptionId || savingIntention || !intention.trim()) return;
    setSavingIntention(true);
    try {
      const res = await fetch(`/api/prescriptions/${prescriptionId}/intention`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intention }),
      });
      if (res.ok) {
        posthog?.capture("intention_saved", {
          prescription_id: prescriptionId,
          intention_length: intention.trim().length,
        });
        setIntentionSaved(true);
      }
    } finally {
      setSavingIntention(false);
    }
  };

  const handleSaveReflection = async () => {
    if (!prescriptionId || savingReflection || !reflection.trim()) return;
    setSavingReflection(true);
    try {
      const res = await fetch(`/api/prescriptions/${prescriptionId}/reflection`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reflection }),
      });
      if (res.ok) {
        posthog?.capture("reflection_saved", {
          prescription_id: prescriptionId,
          reflection_length: reflection.trim().length,
        });
        setReflectionSaved(true);
      }
    } finally {
      setSavingReflection(false);
    }
  };

  return (
    <section className="mb-8 space-y-4">
      {/* 다짐 */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-1 h-4 bg-foreground" />
          <h2 className="text-sm font-bold tracking-widest">오늘의 다짐</h2>
        </div>
        {!intentionSaved && intentionSuggestions.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {intentionSuggestions.map((chip) => (
              <button
                key={chip}
                onClick={() => { setIntention(chip); setIntentionSaved(false); }}
                className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                  intention === chip
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border bg-card text-muted hover:border-primary/30 hover:text-foreground"
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={intention}
            onChange={(e) => { setIntention(e.target.value); setIntentionSaved(false); }}
            placeholder="직접 입력하거나 위에서 선택하세요"
            className="flex-1 bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-primary/40"
            maxLength={100}
          />
          <button
            onClick={handleSaveIntention}
            disabled={savingIntention || !intention.trim() || intentionSaved}
            className="px-4 py-3 bg-foreground text-background rounded-xl text-sm font-medium disabled:opacity-40 transition-opacity"
          >
            {intentionSaved ? "저장됨" : "저장"}
          </button>
        </div>
      </div>

      {/* 성찰 — 다짐이 저장된 경우에만 표시 */}
      {intentionSaved && (
        <div className="border-t border-border pt-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1 h-4 bg-primary/60" />
            <h2 className="text-sm font-bold tracking-widest">오늘 어떻게 실천했나요?</h2>
          </div>
          {reflectionSaved ? (
            <div className="bg-primary/5 border border-primary/20 rounded-xl px-4 py-3">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-primary" strokeWidth={1.5} />
                <span className="text-xs font-medium text-primary">성찰 완료</span>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">{reflection}</p>
            </div>
          ) : (
            <>
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="오늘 실천하며 느낀 점을 짧게 적어보세요"
                rows={3}
                className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-primary/40 resize-none"
                maxLength={500}
              />
              <button
                onClick={handleSaveReflection}
                disabled={savingReflection || !reflection.trim()}
                className="mt-2 w-full py-3 bg-primary/10 text-primary border border-primary/20 rounded-xl text-sm font-medium disabled:opacity-40 transition-opacity"
              >
                {savingReflection ? "저장 중..." : "기록하기"}
              </button>
            </>
          )}
        </div>
      )}
    </section>
  );
}
