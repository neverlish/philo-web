"use client";

import { useState } from "react";
import { usePostHog } from "posthog-js/react";

interface IntentionSectionProps {
  prescriptionId?: string;
  initialIntention?: string | null;
  intentionSuggestions: string[];
}

export function IntentionSection({
  prescriptionId,
  initialIntention,
  intentionSuggestions,
}: IntentionSectionProps) {
  const [intention, setIntention] = useState(initialIntention ?? "");
  const [intentionSaved, setIntentionSaved] = useState(!!initialIntention);
  const [savingIntention, setSavingIntention] = useState(false);
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

  return (
    <section className="mb-8">
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
    </section>
  );
}
