"use client"

import { useState } from "react"
import Link from "next/link"
import { Mic, CheckCircle2, Circle } from "lucide-react"
import { Header } from "@/components/navigation/header"
import { BottomNav } from "@/components/navigation/bottom-nav"
import type { JourneyItem } from "@/app/journey/page"

interface MonthGroup {
  label: string
  count: number
  items: JourneyItem[]
}

function groupByMonth(items: JourneyItem[]): MonthGroup[] {
  const map = new Map<string, JourneyItem[]>()

  for (const item of items) {
    const date = new Date(item.createdAt)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(item)
  }

  return Array.from(map.entries()).map(([key, groupItems]) => {
    const [year, month] = key.split('-')
    return {
      label: `${year}년 ${parseInt(month)}월`,
      count: groupItems.length,
      items: groupItems,
    }
  })
}

interface JourneyPageProps {
  items: JourneyItem[]
}

function getUniquePhilosophers(items: JourneyItem[]) {
  const countMap = new Map<string, number>()
  for (const item of items) {
    countMap.set(item.philosopherName, (countMap.get(item.philosopherName) ?? 0) + 1)
  }
  const seen = new Set<string>()
  return items
    .filter((item) => {
      if (seen.has(item.philosopherName)) return false
      seen.add(item.philosopherName)
      return true
    })
    .map((item) => ({
      name: item.philosopherName,
      school: item.philosopherSchool,
      count: countMap.get(item.philosopherName) ?? 1,
      initials: item.philosopherName.slice(0, 2),
    }))
}

function getThemeInsights(items: JourneyItem[]) {
  const count = new Map<string, number>()
  for (const item of items) {
    for (const tag of item.themeTags ?? []) {
      count.set(tag, (count.get(tag) ?? 0) + 1)
    }
  }
  return Array.from(count.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
}

export function JourneyPage({ items }: JourneyPageProps) {
  const groups = groupByMonth(items)
  const reflectionCount = items.filter((i) => i.reflection !== null).length
  const themeInsights = getThemeInsights(items)
  const uniquePhilosophers = getUniquePhilosophers(items)

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-background shadow-2xl">
      <Header title="나의 여정" />

      <main className="flex-1 pb-32 overflow-y-auto">
        {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-6">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mb-4">
                <Mic className="w-8 h-8 text-muted" strokeWidth={1.5} />
              </div>
              <p className="text-sm text-foreground font-medium mb-2">아직 다짐이 없어요</p>
              <p className="text-xs text-muted mb-6 leading-relaxed">
                처방을 받고 오늘의 다짐을 남기면<br />여기에 여정이 쌓여요
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-5 py-3 bg-foreground text-background rounded-xl text-sm font-medium transition-all active:scale-95"
              >
                <Mic className="w-4 h-4" strokeWidth={1.5} />
                첫 처방 받기
              </Link>
            </div>
          ) : (
            <>
              {/* 성장 요약 */}
              <div className="flex items-center border-b border-border px-6 py-4">
                <div className="flex-1 text-center">
                  <p className="text-2xl font-bold text-foreground">{items.length}</p>
                  <p className="text-[11px] text-muted mt-0.5">다짐</p>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="flex-1 text-center">
                  <p className="text-2xl font-bold text-primary">{reflectionCount}</p>
                  <p className="text-[11px] text-muted mt-0.5">회고 완료</p>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="flex-1 text-center">
                  <p className="text-2xl font-bold text-primary">
                    {items.length > 0 ? Math.round((reflectionCount / items.length) * 100) : 0}%
                  </p>
                  <p className="text-[11px] text-muted mt-0.5">성장률</p>
                </div>
              </div>

              {/* 테마 인사이트 */}
              {themeInsights.length > 0 && (
                <div className="px-6 py-4 border-b border-border">
                  <p className="text-[11px] text-muted mb-2.5">자주 고민하는 것</p>
                  <div className="flex flex-wrap gap-1.5">
                    {themeInsights.map(([tag, count]) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] bg-primary/10 text-primary/80 border border-primary/15"
                      >
                        {tag}
                        <span className="text-primary/50 text-[10px]">{count}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 철학자 컬렉션 */}
              {uniquePhilosophers.length > 0 && (
                <div className="px-6 py-4 border-b border-border">
                  <p className="text-[11px] text-muted mb-2.5">
                    만난 철학자 <span className="text-primary font-medium">{uniquePhilosophers.length}명</span>
                  </p>
                  <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
                    {uniquePhilosophers.map((p) => (
                      <div key={p.name} className="flex flex-col items-center gap-1.5 flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                          <span className="text-xs font-serif font-bold text-primary">{p.initials}</span>
                        </div>
                        <div className="text-center">
                          <p className="text-[11px] font-medium text-foreground">{p.name}</p>
                          <p className="text-[10px] text-muted">{p.count}회</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 타임라인 */}
              <div className="px-6 pt-6 relative">
                {/* 세로 라인 */}
                <div className="absolute left-9 top-0 bottom-0 w-0.5 bg-primary/15" />

                <div className="space-y-8">
                  {groups.map((group) => (
                    <section key={group.label}>
                      {/* 월 헤더 */}
                      <div className="flex items-center gap-3 mb-5 relative">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center z-10 flex-shrink-0">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        </div>
                        <span className="text-sm font-semibold text-foreground">{group.label}</span>
                        <span className="text-xs text-muted">· {group.count}개</span>
                      </div>

                      {/* 아이템들 */}
                      <div className="space-y-3 pl-9">
                        {group.items.map((item) => (
                          <Link key={item.id} href={`/prescription/ai/${item.id}`} className="block">
                            <div className="relative bg-card border border-border rounded-2xl p-4 hover:border-primary/30 transition-colors">
                              {/* 타임라인 연결선 */}
                              <div className="absolute -left-[22px] top-5 w-4 h-0.5 bg-primary/15" />
                              <div className="absolute -left-[26px] top-[15px] w-2.5 h-2.5 rounded-full border-2 border-primary/50 bg-background z-10" />

                              {/* 내용 */}
                              <p className="text-xs text-muted mb-1">
                                {item.philosopherName} · {new Date(item.createdAt).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}
                              </p>
                              <p className="text-sm font-serif text-foreground mb-2">{item.title}</p>
                              <p className="text-sm text-primary font-medium leading-snug">
                                &ldquo;{item.userIntention}&rdquo;
                              </p>

                              {item.reflection && (
                                <>
                                  <div className="h-px bg-border my-3" />
                                  <p className="text-xs text-muted leading-relaxed line-clamp-2">
                                    <span className="text-foreground/50">회고 · </span>
                                    {item.reflection}
                                  </p>
                                </>
                              )}

                              {/* 테마 태그 */}
                              {item.themeTags && item.themeTags.length > 0 && (
                                <div className="flex gap-1 mt-2.5">
                                  {item.themeTags.map((tag) => (
                                    <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] bg-primary/10 text-primary/70 border border-primary/15">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}

                              {/* 진행 단계 */}
                              <div className="flex items-center gap-2 mt-3">
                                <span className="flex items-center gap-1 text-[10px] text-muted">
                                  <CheckCircle2 className="w-3 h-3 text-muted" strokeWidth={2} />
                                  처방
                                </span>
                                <span className="text-muted text-[10px]">→</span>
                                <span className="flex items-center gap-1 text-[10px] text-primary/80">
                                  <CheckCircle2 className="w-3 h-3 text-primary/70" strokeWidth={2} />
                                  다짐
                                </span>
                                <span className="text-muted text-[10px]">→</span>
                                {item.reflection ? (
                                  <span className="flex items-center gap-1 text-[10px] text-primary">
                                    <CheckCircle2 className="w-3 h-3 text-primary" strokeWidth={2} />
                                    회고
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1 text-[10px] text-muted">
                                    <Circle className="w-3 h-3" strokeWidth={1.5} />
                                    회고
                                  </span>
                                )}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              </div>
            </>
          )
        }
      </main>

      <BottomNav />
    </div>
  )
}
