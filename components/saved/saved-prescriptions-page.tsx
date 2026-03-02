// components/saved/saved-prescriptions-page.tsx
"use client";

import { useState } from "react";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { SavedCard, SavedPrescription } from "@/components/saved/saved-card";
import { Header } from "@/components/navigation/header";

const mockSavedPrescriptions: SavedPrescription[] = [
  {
    id: "1",
    philosopher: "마르쿠스 아우렐리우스",
    philosopherId: "marcus-aurelius",
    title: "내면의 요새를 지키는 법",
    excerpt:
      "외부의 혼란이 내면의 평화를 흔들게 하지 마라. 너의 힘으로 통제할 수 없는 것에 대해 걱정하는 대신, 너 자신을 향해 나아가라.",
    savedAt: "2024년 3월 1일",
    category: "스토아 철학",
  },
  {
    id: "2",
    philosopher: "장자",
    philosopherId: "zhuangzi",
    title: "물처럼 부드럽게 흐르는 삶",
    excerpt:
      "물은 가장 부드러운 것이면서 가장 강한 힘을 가지고 있다. 어떤 장애물도 물을 막을 수 없다. 물처럼 유연하게 살아가라.",
    savedAt: "2024년 2월 28일",
    category: "동양 사상",
  },
  {
    id: "3",
    philosopher: "세네카",
    philosopherId: "seneca",
    title: "시간의 짧음에 대하여",
    excerpt:
      "시간이 부족한 것이 아니라, 우리가 시간을 낭비하고 있을 뿐이다. 소유한 시간을 현명하게 사용하라. 인생은 짧지만, 충분히 길다.",
    savedAt: "2024년 2월 25일",
    category: "스토아 철학",
  },
  {
    id: "4",
    philosopher: "노자",
    philosopherId: "laozi",
    title: "무위의 지혜",
    excerpt:
      "하는 것이 없는 것이 모든 것을 하는 것이다. 강요하지 말고 흐름에 맡겨라. 자연의 이치에 따르면 모든 것이 저절로 이루어진다.",
    savedAt: "2024년 2월 20일",
    category: "동양 사상",
  },
  {
    id: "5",
    philosopher: "에피쿠로스",
    philosopherId: "epicurus",
    title: "행복의 네 가지 재료",
    excerpt:
      "행복한 삶을 위해서는 다음이 필요하다: 훌륭한 친구, 자유, 사색, 그리고 단순한 음식. 이것이 에피쿠로스가 말한 진정한 쾌락이다.",
    savedAt: "2024년 2월 15일",
    category: "고대 철학",
  },
];

export function SavedPrescriptionsPage() {
  const [savedPrescriptions, setSavedPrescriptions] = useState<SavedPrescription[]>(
    mockSavedPrescriptions
  );
  const [filter, setFilter] = useState<"all" | "stoic" | "eastern" | "modern">("all");

  const handleDelete = (id: string) => {
    setSavedPrescriptions((prev) => prev.filter((p) => p.id !== id));
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
              <span className="material-symbols-outlined text-3xl text-muted">bookmark_border</span>
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
