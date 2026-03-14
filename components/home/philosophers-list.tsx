// components/home/philosophers-list.tsx
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { PhilosopherCard } from "./philosopher-card";
import { Loader2 } from "lucide-react";
import type { DbPhilosopher } from "@/types";

const PAGE_SIZE = 5;

const descriptions = [
  "내면의 요새를 지키는 법",
  "물처럼 부드럽게 흐르는 삶",
  "시간의 짧음에 대하여",
  "무위자연의 지혜",
  "덕으로 이루는 행복",
  "자기 성찰의 용기",
  "흐름에 몸을 맡기는 삶",
  "통제할 수 없는 것을 놓아주기",
];

interface PhilosophersListProps {
  initialPhilosophers: DbPhilosopher[];
  initialHasMore: boolean;
}

export function PhilosophersList({ initialPhilosophers, initialHasMore }: PhilosophersListProps) {
  const [philosophers, setPhilosophers] = useState<DbPhilosopher[]>(initialPhilosophers);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(initialPhilosophers.length);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/philosophers?limit=${PAGE_SIZE}&offset=${offsetRef.current}`);
      if (!res.ok) return;
      const data = await res.json();
      const next: DbPhilosopher[] = data.philosophers ?? [];
      setPhilosophers((prev) => [...prev, ...next]);
      offsetRef.current += next.length;
      setHasMore(next.length === PAGE_SIZE);
    } catch {
      // 실패 시 그냥 무시
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    if (!hasMore) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "200px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore, hasMore]);

  if (philosophers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted">철학자 데이터가 없습니다</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      {philosophers.map((philosopher, index) => (
        <PhilosopherCard
          key={philosopher.id}
          philosopher={{
            id: philosopher.id,
            name: philosopher.name,
            nameEn: philosopher.name_en,
            era: philosopher.era,
            school: "",
            description: philosopher.description || "",
          }}
          description={descriptions[index % descriptions.length]}
        />
      ))}

      {/* 인피니트 스크롤 센티널 */}
      {hasMore && (
        <div ref={sentinelRef} className="flex justify-center py-4">
          {loading && <Loader2 className="w-5 h-5 text-muted animate-spin" />}
        </div>
      )}
    </div>
  );
}
