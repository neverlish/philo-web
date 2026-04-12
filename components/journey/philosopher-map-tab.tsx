"use client"

import { useState } from "react"
import Link from "next/link"
import { Sparkles } from "lucide-react"
import type { PhilosopherItem } from "@/app/journey/page"

interface PhilosopherMapTabProps {
  philosophers: PhilosopherItem[]
  encounteredNames: string[]
}

const ERA_ORDER = ['고대', '근대', '현대']
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

  return (
    <div>
      {/* 진행 현황 */}
      <div className="flex items-center gap-3 mb-5 px-1">
        <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${total > 0 ? (metCount / total) * 100 : 0}%` }}
          />
        </div>
        <span className="text-xs text-muted flex-shrink-0">
          <span className="text-primary font-medium">{metCount}</span> / {total}명 만남
        </span>
      </div>

      {/* 필터 */}
      <div className="flex gap-2 mb-5">
        {REGION_FILTERS.map((r) => (
          <button
            key={r}
            onClick={() => setRegionFilter(r)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
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
      <div className="space-y-6">
        {byEra.map(({ era, items }) => (
          <section key={era}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[11px] font-semibold tracking-widest text-muted">{era}</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {items.map((p) => {
                const met = encountered.has(p.name)
                return (
                  <Link key={p.id} href={`/philosopher/${p.id}`}>
                    <div className={`rounded-2xl p-4 border transition-colors hover:border-primary/30 ${
                      met ? 'bg-primary/5 border-primary/20' : 'bg-card border-border'
                    }`}>
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-sm font-serif font-semibold text-foreground leading-snug">{p.name}</p>
                        {met && <Sparkles className="w-3 h-3 text-primary flex-shrink-0" strokeWidth={1.5} />}
                      </div>
                      {p.years && <p className="text-[10px] text-muted mb-2">{p.years}</p>}
                      <p className="text-[11px] text-foreground/70 leading-relaxed line-clamp-2 mb-2.5">
                        {p.coreIdea}
                      </p>
                      {p.keywords && (
                        <div className="flex flex-wrap gap-1">
                          {p.keywords.slice(0, 3).map((k) => (
                            <span key={k} className="px-1.5 py-0.5 rounded-full text-[10px] bg-border/60 text-muted">
                              {k}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
