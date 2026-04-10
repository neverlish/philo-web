"use client"

import { useState } from "react"
import Link from "next/link"
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

      <main className="flex-1 px-6 pt-4 pb-32 overflow-y-auto">
        {tab === 'journey' ? (
          items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <p className="text-muted text-sm leading-relaxed">
                처방을 받고 다짐을 남기면<br />여기에 쌓여요
              </p>
            </div>
          ) : (
            <div className="space-y-10">
              {groups.map((group) => (
                <section key={group.label}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-sm font-medium text-foreground">{group.label}</span>
                    <span className="text-xs text-muted">다짐 {group.count}개</span>
                    <div className="flex-1 h-px bg-border" />
                  </div>

                  <div className="space-y-3">
                    {group.items.map((item) => (
                      <Link
                        key={item.id}
                        href={`/prescription/ai/${item.id}`}
                        className="block"
                      >
                        <div className="bg-card border border-border rounded-2xl p-5 hover:border-primary/30 transition-colors">
                          <div className="mb-3">
                            <p className="text-xs text-muted mb-1">{item.philosopherName} · {item.philosopherSchool}</p>
                            <p className="text-base font-serif text-foreground">{item.title}</p>
                          </div>
                          <p className="text-sm text-primary font-medium">
                            &ldquo;{item.userIntention}&rdquo;
                          </p>
                          {item.reflection && (
                            <>
                              <div className="h-px bg-border my-3" />
                              <p className="text-xs text-muted">
                                <span className="text-foreground/60">회고: </span>
                                {item.reflection}
                              </p>
                            </>
                          )}
                          <p className="text-[11px] text-muted mt-3">
                            {new Date(item.createdAt).toLocaleDateString('ko-KR', {
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )
        ) : (
          <JournalTab
            initialEntries={journalEntries}
            todayPrescription={todayPrescription}
          />
        )}
      </main>

      <BottomNav />
    </div>
  )
}
