"use client"

import { useState } from "react"
import Link from "next/link"
import { Mic, CheckCircle2, Circle } from "lucide-react"
import { Header } from "@/components/navigation/header"
import { BottomNav } from "@/components/navigation/bottom-nav"
import { JournalTab } from "@/components/journey/journal-tab"
import type { JourneyItem, JournalEntry, TodayPrescription } from "@/app/journey/page"

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
  journalEntries: JournalEntry[]
  todayPrescription: TodayPrescription | null
}

export function JourneyPage({ items, journalEntries, todayPrescription }: JourneyPageProps) {
  const groups = groupByMonth(items)
  const [tab, setTab] = useState<'journey' | 'journal'>('journey')
  const reflectionCount = items.filter((i) => i.reflection !== null).length

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-background shadow-2xl">
      <Header title="나의 여정" />

      {/* Tabs */}
      <div className="flex border-b border-border px-6">
        <button
          onClick={() => setTab('journey')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            tab === 'journey'
              ? 'text-foreground border-b-2 border-foreground'
              : 'text-muted hover:text-foreground'
          }`}
        >
          다짐 여정
        </button>
        <button
          onClick={() => setTab('journal')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            tab === 'journal'
              ? 'text-foreground border-b-2 border-foreground'
              : 'text-muted hover:text-foreground'
          }`}
        >
          저널
        </button>
      </div>

      <main className="flex-1 pb-32 overflow-y-auto">
        {tab === 'journey' ? (
          items.length === 0 ? (
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
        ) : (
          <div className="px-6 pt-4">
            <JournalTab
              initialEntries={journalEntries}
              todayPrescription={todayPrescription}
            />
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
