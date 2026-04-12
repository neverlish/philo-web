"use client"

import { useState } from "react"
import Link from "next/link"
import { BookLock } from "lucide-react"
import type { PhilosopherItem } from "@/app/journey/page"

interface PhilosopherMapTabProps {
  philosophers: PhilosopherItem[]
  encounteredNames: string[]
}

const ERA_ORDER = ['고대', '근대', '현대']
const ERA_LABEL: Record<string, string> = {
  '고대': 'Antiqua',
  '근대': 'Moderna',
  '현대': 'Contemporanea',
}
const REGION_FILTERS = ['전체', '동양', '서양'] as const

export function PhilosopherMapTab({ philosophers, encounteredNames }: PhilosopherMapTabProps) {
  const [regionFilter, setRegionFilter] = useState<string>('전체')
  const encountered = new Set(encounteredNames)

  const filtered = regionFilter === '전체' ? philosophers : philosophers.filter((p) => p.region === regionFilter)
  const byEra = ERA_ORDER
    .map((era) => ({ era, items: filtered.filter((p) => p.era === era) }))
    .filter((g) => g.items.length > 0)

  const total = philosophers.length
  const metCount = philosophers.filter((p) => encountered.has(p.name)).length
  const pct = total > 0 ? Math.round((metCount / total) * 100) : 0

  return (
    <div>
      {/* 열전 헤더 */}
      <div className="mb-6 text-center py-5 border-y border-border">
        <p className="text-[10px] tracking-[0.3em] text-muted uppercase mb-1">Philosophi Conspectus</p>
        <h2 className="font-serif text-xl font-bold text-foreground mb-3">철인열전 哲人列傳</h2>
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="flex-1 max-w-32 h-px bg-border" />
          <span className="text-sm font-bold text-primary">{metCount}명</span>
          <span className="text-xs text-muted">/ {total}명 만남</span>
          <div className="flex-1 max-w-32 h-px bg-border" />
        </div>
        <div className="h-1 bg-border rounded-full overflow-hidden max-w-48 mx-auto">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-[11px] text-muted mt-2 italic">
          {metCount === 0
            ? '첫 처방을 받아 철학자를 만나보세요'
            : metCount === total
            ? '모든 지혜를 섭렵하셨습니다'
            : `${total - metCount}인의 사상이 아직 미지(未知)로 남아 있습니다`}
        </p>
      </div>

      {/* 필터 */}
      <div className="flex gap-2 mb-6">
        {REGION_FILTERS.map((r) => (
          <button
            key={r}
            onClick={() => setRegionFilter(r)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
              regionFilter === r
                ? 'bg-foreground text-background'
                : 'bg-card border border-border text-muted hover:text-foreground'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* 시대별 그룹 */}
      <div className="space-y-7 pb-4">
        {byEra.map(({ era, items }) => (
          <section key={era}>
            <div className="flex items-center gap-3 mb-3">
              <div className="text-center flex-shrink-0">
                <p className="text-[9px] tracking-widest text-muted uppercase">{ERA_LABEL[era]}</p>
                <p className="text-sm font-serif font-bold text-foreground">{era}</p>
              </div>
              <div className="flex-1 h-px bg-border" />
              <span className="text-[10px] text-muted flex-shrink-0">
                {items.filter((p) => encountered.has(p.name)).length}/{items.length}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {items.map((p) => {
                const met = encountered.has(p.name)
                return met ? (
                  <Link key={p.id} href={`/philosopher/${p.id}`}>
                    <div className="rounded-2xl p-4 border border-primary/25 bg-primary/5 hover:border-primary/40 transition-colors h-full">
                      <div className="flex items-start justify-between gap-1 mb-0.5">
                        <p className="text-sm font-serif font-bold text-foreground leading-snug">{p.name}</p>
                        <span className="text-primary text-[10px] mt-0.5 flex-shrink-0">✦</span>
                      </div>
                      {p.years && (
                        <p className="text-[10px] text-muted mb-2 font-mono">{p.years}</p>
                      )}
                      <p className="text-[11px] text-foreground/70 leading-relaxed italic line-clamp-2 mb-2.5">
                        {p.coreIdea}
                      </p>
                      {p.keywords && (
                        <div className="flex flex-wrap gap-1">
                          {p.keywords.slice(0, 3).map((k) => (
                            <span key={k} className="px-1.5 py-0.5 rounded-full text-[10px] bg-primary/10 text-primary/80 border border-primary/15">
                              {k}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                ) : (
                  <div key={p.id} className="rounded-2xl p-4 border border-border bg-card/50 h-full">
                    <div className="flex items-start justify-between gap-1 mb-0.5">
                      <p className="text-sm font-serif font-bold text-muted/60 leading-snug">{p.name}</p>
                      <BookLock className="w-3 h-3 text-muted/40 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                    </div>
                    {p.years && (
                      <p className="text-[10px] text-muted/40 mb-2 font-mono">{p.years}</p>
                    )}
                    <div className="space-y-1.5 mb-2.5">
                      <div className="h-1.5 bg-border/60 rounded-full w-full" />
                      <div className="h-1.5 bg-border/60 rounded-full w-4/5" />
                      <div className="h-1.5 bg-border/60 rounded-full w-3/5" />
                    </div>
                    <p className="text-[10px] text-muted/40 italic">처방을 통해 만남</p>
                  </div>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
