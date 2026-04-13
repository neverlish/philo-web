"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

type Props = {
  streak: number
  checkInDates: string[]
  last7Days: string[]
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

export function StreakCard({ streak, checkInDates, last7Days }: Props) {
  const [open, setOpen] = useState(false)

  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const checkInSet = new Set(checkInDates)

  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDow = getFirstDayOfWeek(viewYear, viewMonth)

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    const now = new Date()
    if (viewYear > now.getFullYear() || (viewYear === now.getFullYear() && viewMonth >= now.getMonth())) return
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
  }

  const isToday = (day: number) => {
    return viewYear === today.getFullYear() && viewMonth === today.getMonth() && day === today.getDate()
  }

  const isCheckedIn = (day: number) => {
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return checkInSet.has(dateStr)
  }

  const isFuture = (day: number) => {
    const d = new Date(viewYear, viewMonth, day)
    return d > today
  }

  const isNextDisabled = viewYear > today.getFullYear() ||
    (viewYear === today.getFullYear() && viewMonth >= today.getMonth())

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-card border border-border rounded-xl p-4 text-center w-full"
      >
        <p className="text-2xl font-serif font-normal text-primary mb-1">{streak}</p>
        <p className="text-xs text-muted mb-2">연속 일수</p>
        <div className="flex justify-center gap-1">
          {last7Days.map((date) => (
            <div
              key={date}
              className={`w-2 h-2 rounded-full ${checkInSet.has(date) ? "bg-primary" : "bg-border"}`}
            />
          ))}
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-3xl shadow-2xl max-w-md mx-auto"
            >
              <div className="p-6">
                {/* Handle */}
                <div className="w-10 h-1 bg-border rounded-full mx-auto mb-5" />

                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-base font-medium">체크인 기록</h3>
                  <button onClick={() => setOpen(false)} className="p-1 text-muted-foreground">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Month nav */}
                <div className="flex items-center justify-between mb-4">
                  <button onClick={prevMonth} className="p-2 hover:bg-muted rounded-lg">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <p className="text-sm font-medium">
                    {viewYear}년 {viewMonth + 1}월
                  </p>
                  <button
                    onClick={nextMonth}
                    disabled={isNextDisabled}
                    className="p-2 hover:bg-muted rounded-lg disabled:opacity-30"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Day labels */}
                <div className="grid grid-cols-7 mb-2">
                  {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
                    <div key={d} className="text-center text-xs text-muted-foreground py-1">{d}</div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-y-1">
                  {Array.from({ length: firstDow }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                    const checkedIn = isCheckedIn(day)
                    const todayFlag = isToday(day)
                    const future = isFuture(day)
                    return (
                      <div key={day} className="flex items-center justify-center py-1">
                        <div className={`
                          w-8 h-8 rounded-full flex items-center justify-center text-xs
                          ${checkedIn ? "bg-primary text-primary-foreground font-medium" : ""}
                          ${todayFlag && !checkedIn ? "ring-1 ring-primary text-primary" : ""}
                          ${future ? "text-muted-foreground/30" : !checkedIn ? "text-foreground" : ""}
                        `}>
                          {day}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-4 h-4 rounded-full bg-primary" />
                    <span>체크인 완료</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-4 h-4 rounded-full ring-1 ring-primary" />
                    <span>오늘</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
