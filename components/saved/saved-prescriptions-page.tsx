// components/saved/saved-prescriptions-page.tsx
"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { SavedCard, SavedPrescription } from "@/components/saved/saved-card";
import { Header } from "@/components/navigation/header";

export function SavedPrescriptionsPage({ savedPrescriptions: initialPrescriptions }: { savedPrescriptions: SavedPrescription[] }) {
  const [savedPrescriptions, setSavedPrescriptions] = useState<SavedPrescription[]>(
    initialPrescriptions
  );
  const [filter, setFilter] = useState<"all" | "stoic" | "eastern" | "modern">("all");

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
    { id: "stoic" as const, label: "스토아" },
    { id: "eastern" as const, label: "동양" },
    { id: "modern" as const, label: "현대" },
  ];

  const filteredPrescriptions =
    filter === "all"
      ? savedPrescriptions
      : savedPrescriptions.filter((p) => {
          if (filter === "stoic") return p.category === "스토아 철학";
          if (filter === "eastern") return p.category === "동양 사상";
          if (filter === "modern") return p.category === "현대 철학";
          return true;
        });

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-background shadow-2xl">
      <Header title="저장된 처방" />

      <main className="flex-1 flex flex-col px-6 pt-2 pb-32 overflow-y-auto">
        {/* Info Text */}
        <div className="w-full mb-6 mt-2">
          <p className="text-sm text-muted leading-relaxed">
            마음에 드는 철학적 처방을 저장해두고 언제든 다시 찾아볼 수 있습니다.
          </p>
        </div>

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

        {/* Results Count */}
        <div className="w-full mb-4">
          <p className="text-xs text-muted">
            총 <span className="font-medium text-foreground">{filteredPrescriptions.length}</span>개의
            처방
          </p>
        </div>

        {/* Saved Prescriptions List */}
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
            <p className="text-xs text-muted">
              철학자 카드에서 마음에 드는 처방을 저장해보세요
            </p>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
