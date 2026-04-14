// components/home/philosophers-list.tsx
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { PhilosopherCard } from "./philosopher-card";
import { Loader2 } from "lucide-react";
import type { DbPhilosopher } from "@/types";
import type { CategoryFilter } from "./home-page";

const PAGE_SIZE = 5;

function buildQuery(filter: CategoryFilter, offset: number) {
  const params = new URLSearchParams({ limit: String(PAGE_SIZE), offset: String(offset) });
  if (filter.keyword) params.set("keyword", filter.keyword);
  if (filter.region) params.set("region", filter.region);
  if (filter.era) params.set("era", filter.era);
  if (filter.concerns) params.set("concerns", filter.concerns);
  return `/api/philosophers?${params.toString()}`;
}

interface PhilosophersListProps {
  initialPhilosophers: DbPhilosopher[];
  initialHasMore: boolean;
  filter: CategoryFilter;
}

export function PhilosophersList({ initialPhilosophers, initialHasMore, filter }: PhilosophersListProps) {
  const [philosophers, setPhilosophers] = useState<DbPhilosopher[]>(initialPhilosophers);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(initialPhilosophers.length);

  // 필터 변경 시 리셋 후 첫 페이지 fetch
  useEffect(() => {
    setPhilosophers(initialPhilosophers);
    setHasMore(initialHasMore);
    offsetRef.current = initialPhilosophers.length;

    // 전체 보기가 아닌 필터는 SSR 데이터 없이 시작하므로 즉시 fetch
    if (initialPhilosophers.length === 0) {
      setLoading(true);
      fetch(buildQuery(filter, 0))
        .then((res) => res.ok ? res.json() : { philosophers: [] })
        .then((data) => {
          const next: DbPhilosopher[] = data.philosophers ?? [];
          setPhilosophers(next);
          offsetRef.current = next.length;
          setHasMore(next.length === PAGE_SIZE);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await fetch(buildQuery(filter, offsetRef.current));
      if (!res.ok) return;
      const data = await res.json();
      const next: DbPhilosopher[] = data.philosophers ?? [];
      setPhilosophers((prev) => {
        const seen = new Set(prev.map((p) => p.id));
        return [...prev, ...next.filter((p) => !seen.has(p.id))];
      });
      offsetRef.current += next.length;
      setHasMore(next.length === PAGE_SIZE);
    } catch {
      // 실패 시 그냥 무시
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, filter]);

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

  if (loading && philosophers.length === 0) {
    return (
      <div className="w-full space-y-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-full space-y-3">
            <div className="h-48 w-full rounded-lg bg-primary/10 animate-pulse" />
            <div className="h-3 w-1/3 rounded bg-primary/10 animate-pulse" />
            <div className="h-5 w-2/3 rounded bg-primary/10 animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (!loading && philosophers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted">해당하는 철학자가 없습니다</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      {philosophers.map((philosopher, index) => (
        <PhilosopherCard
          key={philosopher.id}
          index={index}
          philosopher={{
            id: philosopher.id,
            name: philosopher.name,
            nameEn: philosopher.name_en,
            era: philosopher.era,
            school: "",
            description: philosopher.description || "",
          }}
          description={philosopher.core_idea}
          keywords={philosopher.keywords}
          years={philosopher.years}
          region={philosopher.region}
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
