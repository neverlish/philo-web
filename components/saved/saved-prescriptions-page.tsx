// components/saved/saved-prescriptions-page.tsx
"use client";

import { useState } from "react";
import { PenLine, Mic } from "lucide-react";
import Link from "next/link";
import { usePostHog } from "posthog-js/react";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { SavedCard, SavedPrescription } from "@/components/saved/saved-card";
import { Header } from "@/components/navigation/header";

interface HistoryItem extends SavedPrescription {
  isSaved?: boolean
}

export function SavedPrescriptionsPage({
  intentions: initialIntentions,
  history = [],
}: {
  intentions: SavedPrescription[]
  history?: HistoryItem[]
}) {
  const [tab, setTab] = useState<"intention" | "history">("intention")
  const [filter, setFilter] = useState<"all" | "reflection" | "incomplete">("all");
  const posthog = usePostHog();

  const categories = [
    { id: "all" as const, label: "전체" },
    { id: "reflection" as const, label: "✓ 성찰 완료" },
    { id: "incomplete" as const, label: "미성찰" },
  ];

  const filteredIntentions =
    filter === "all"
      ? initialIntentions
      : initialIntentions.filter((p) => {
          if (filter === "reflection") return !!p.hasReflection;
          if (filter === "incomplete") return !p.hasReflection;
          return true;
        });

  return (
    <div className="min-h-dvh flex flex-col max-w-md mx-auto bg-background shadow-2xl">
      <Header title="처방함" />

      {/* Tabs */}
      <div className="flex border-b border-border px-6">
        <button
          onClick={() => setTab("intention")}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            tab === "intention"
              ? "text-foreground border-b-2 border-foreground"
              : "text-muted hover:text-foreground"
          }`}
        >
          실천 중 {initialIntentions.length > 0 && <span className="ml-1 text-xs text-primary">{initialIntentions.length}</span>}
        </button>
        <button
          onClick={() => setTab("history")}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            tab === "history"
              ? "text-foreground border-b-2 border-foreground"
              : "text-muted hover:text-foreground"
          }`}
        >
          전체 기록 {history.length > 0 && <span className="ml-1 text-xs text-primary">{history.length}</span>}
        </button>
      </div>

      <main className="flex-1 flex flex-col px-6 pt-4 pb-32 overflow-y-auto">
        {tab === "intention" ? (
          <>
            {/* Filters */}
            <div className="w-full mb-6">
              <div className="flex gap-3 overflow-x-auto pb-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setFilter(category.id)
                      posthog?.capture('saved_filter_changed', { filter: category.id })
                    }}
                    className={`flex-none px-5 py-2.5 rounded-full border font-serif text-sm whitespace-nowrap transition-colors ${
                      filter === category.id
                        ? "border-primary/20 bg-stone-100 text-foreground"
                        : "border-primary/20 bg-transparent text-muted hover:bg-stone-50 hover:text-foreground"
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            {filteredIntentions.length > 0 ? (
              <div className="w-full space-y-4">
                {filteredIntentions.map((prescription, index) => (
                  <SavedCard
                    key={prescription.id}
                    prescription={prescription}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mb-4">
                  <PenLine className="w-8 h-8 text-muted" strokeWidth={1.5} />
                </div>
                <p className="text-sm text-foreground font-medium mb-2">아직 다짐이 없어요</p>
                <p className="text-xs text-muted mb-6 leading-relaxed">
                  처방을 받고 오늘의 다짐을 남기면<br />여기에 쌓여요
                </p>
                <Link
                  href="/opening/input"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-foreground text-background rounded-xl text-sm font-medium transition-all active:scale-95"
                >
                  <Mic className="w-4 h-4" strokeWidth={1.5} />
                  처방 받으러 가기
                </Link>
              </div>
            )}
          </>
        ) : (
          <>
            {history.length > 0 ? (
              <div className="w-full space-y-3">
                {history.map((item, index) => (
                  <SavedCard
                    key={item.id}
                    prescription={item}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mb-4">
                  <Mic className="w-8 h-8 text-muted" strokeWidth={1.5} />
                </div>
                <p className="text-sm text-foreground font-medium mb-2">첫 처방을 받아보세요</p>
                <p className="text-xs text-muted mb-6 leading-relaxed">
                  오늘의 고민을 말하면<br />소크라테스, 노자, 니체가 처방해드려요
                </p>
                <Link
                  href="/opening/input"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-foreground text-background rounded-xl text-sm font-medium transition-all active:scale-95"
                >
                  <Mic className="w-4 h-4" strokeWidth={1.5} />
                  지금 고민 말하기
                </Link>
              </div>
            )}
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
