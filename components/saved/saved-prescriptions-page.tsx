// components/saved/saved-prescriptions-page.tsx
"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { SavedCard, SavedPrescription } from "@/components/saved/saved-card";
import { Header } from "@/components/navigation/header";

interface HistoryItem extends SavedPrescription {
  isSaved?: boolean
}

export function SavedPrescriptionsPage({
  savedPrescriptions: initialPrescriptions,
  history = [],
}: {
  savedPrescriptions: SavedPrescription[]
  history?: HistoryItem[]
}) {
  const [tab, setTab] = useState<"saved" | "history">("saved")
  const [savedPrescriptions, setSavedPrescriptions] = useState<SavedPrescription[]>(
    initialPrescriptions
  );
  const [filter, setFilter] = useState<"all" | "anxiety" | "relationship" | "freedom" | "meaning">("all");

  const handleDelete = async (id: string) => {
    const prescription = savedPrescriptions.find((p) => p.id === id)
    if (!prescription) return

    setSavedPrescriptions((prev) => prev.filter((p) => p.id !== id));

    try {
      await fetch(`/api/prescriptions/${prescription.prescriptionId}/save`, {
        method: 'DELETE',
      })
    } catch {
      // 실패해도 UI는 그대로 유지 (낙관적 업데이트)
    }
  };

  const categories = [
    { id: "all" as const, label: "전체" },
    { id: "anxiety" as const, label: "불안·두려움" },
    { id: "relationship" as const, label: "인간관계" },
    { id: "freedom" as const, label: "자유·선택" },
    { id: "meaning" as const, label: "삶의 의미" },
  ];

  const filteredPrescriptions =
    filter === "all"
      ? savedPrescriptions
      : savedPrescriptions.filter((p) => {
          const cat = p.category;
          if (filter === "anxiety") return cat.includes("스토아") || cat.includes("Stoic") || cat.includes("Epictetus") || cat.includes("에픽");
          if (filter === "relationship") return cat.includes("유가") || cat.includes("유교") || cat.includes("공자") || cat.includes("Confucian");
          if (filter === "freedom") return cat.includes("실존") || cat.includes("Existential") || cat.includes("사르트르") || cat.includes("카뮈");
          if (filter === "meaning") return cat.includes("에피쿠로스") || cat.includes("불교") || cat.includes("도가") || cat.includes("Buddhist") || cat.includes("Taoist") || cat.includes("하이데거");
          return true;
        });

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-background shadow-2xl">
      <Header title="처방함" />

      {/* Tabs */}
      <div className="flex border-b border-border px-6">
        <button
          onClick={() => setTab("saved")}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            tab === "saved"
              ? "text-foreground border-b-2 border-foreground"
              : "text-muted hover:text-foreground"
          }`}
        >
          저장됨 {savedPrescriptions.length > 0 && <span className="ml-1 text-xs text-primary">{savedPrescriptions.length}</span>}
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
        {tab === "saved" ? (
          <>
            {/* Category Filters */}
            <div className="w-full mb-6">
              <div className="flex gap-3 overflow-x-auto pb-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setFilter(category.id)}
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

            {filteredPrescriptions.length > 0 ? (
              <div className="w-full space-y-4">
                {filteredPrescriptions.map((prescription, index) => (
                  <SavedCard
                    key={prescription.id}
                    prescription={prescription}
                    index={index}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mb-4">
                  <Bookmark className="w-8 h-8 text-muted" strokeWidth={1.5} />
                </div>
                <p className="text-sm text-muted mb-2">저장된 처방이 없습니다</p>
                <p className="text-xs text-muted">처방 페이지에서 북마크를 눌러보세요</p>
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
              <div className="flex-1 flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mb-4">
                  <Bookmark className="w-8 h-8 text-muted" strokeWidth={1.5} />
                </div>
                <p className="text-sm text-muted mb-2">아직 받은 처방이 없어요</p>
                <p className="text-xs text-muted">오늘의 고민을 말해보세요</p>
              </div>
            )}
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
