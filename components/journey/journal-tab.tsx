"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PenLine, Trash2, Link2 } from "lucide-react"

interface TodayPrescription {
  id: string
  title: string
  philosopher_name: string
}

interface JournalEntry {
  id: string
  content: string
  prescription_id: string | null
  created_at: string
  ai_prescriptions: { title: string; philosopher_name: string } | null
}

interface JournalTabProps {
  initialEntries: JournalEntry[]
  todayPrescription: TodayPrescription | null
}

export function JournalTab({ initialEntries, todayPrescription }: JournalTabProps) {
  const [entries, setEntries] = useState<JournalEntry[]>(initialEntries)
  const [writing, setWriting] = useState(false)
  const [content, setContent] = useState("")
  const [linkPrescription, setLinkPrescription] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!content.trim() || saving) return
    setSaving(true)
    try {
      const res = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          prescriptionId: linkPrescription && todayPrescription ? todayPrescription.id : null,
        }),
      })
      if (res.ok) {
        const { entry } = await res.json()
        const newEntry: JournalEntry = {
          ...entry,
          ai_prescriptions: linkPrescription && todayPrescription
            ? { title: todayPrescription.title, philosopher_name: todayPrescription.philosopher_name }
            : null,
        }
        setEntries([newEntry, ...entries])
        setContent("")
        setLinkPrescription(false)
        setWriting(false)
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    setEntries(entries.filter((e) => e.id !== id))
    await fetch(`/api/journal/${id}`, { method: 'DELETE' })
  }

  return (
    <div className="space-y-4">
      {/* Write Button */}
      {!writing && (
        <button
          onClick={() => setWriting(true)}
          className="w-full flex items-center gap-3 bg-card border border-border rounded-2xl px-5 py-4 text-sm text-muted hover:border-primary/30 hover:text-foreground transition-colors"
        >
          <PenLine className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
          오늘의 생각을 자유롭게 기록하세요...
        </button>
      )}

      {/* Write Form */}
      <AnimatePresence>
        {writing && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="bg-card border border-primary/20 rounded-2xl p-5 space-y-3"
          >
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="오늘 어떤 생각이 드셨나요?"
              autoFocus
              rows={4}
              maxLength={1000}
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted focus:outline-none resize-none leading-relaxed"
            />

            {todayPrescription && (
              <button
                onClick={() => setLinkPrescription(!linkPrescription)}
                className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  linkPrescription
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border text-muted hover:border-primary/30"
                }`}
              >
                <Link2 className="w-3 h-3" strokeWidth={2} />
                {linkPrescription
                  ? `${todayPrescription.philosopher_name}의 처방과 연결됨`
                  : "오늘 처방과 연결하기"}
              </button>
            )}

            <div className="flex justify-between items-center pt-1">
              <span className="text-[11px] text-muted">{content.length}/1000</span>
              <div className="flex gap-2">
                <button
                  onClick={() => { setWriting(false); setContent(""); setLinkPrescription(false) }}
                  className="px-4 py-2 text-sm text-muted hover:text-foreground transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !content.trim()}
                  className="px-4 py-2 bg-foreground text-background rounded-xl text-sm font-medium disabled:opacity-40 transition-opacity"
                >
                  저장
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Entries */}
      {entries.length === 0 && !writing ? (
        <div className="flex flex-col items-center justify-center h-48 text-center">
          <p className="text-muted text-sm leading-relaxed">
            아직 기록이 없어요.<br />오늘의 생각을 자유롭게 남겨보세요.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-card border border-border rounded-2xl p-5"
            >
              {entry.ai_prescriptions && (
                <p className="text-[10px] font-medium tracking-wider uppercase text-primary mb-2">
                  {entry.ai_prescriptions.philosopher_name} · {entry.ai_prescriptions.title}
                </p>
              )}
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap mb-3">
                {entry.content}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted">
                  {new Date(entry.created_at).toLocaleDateString('ko-KR', {
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="text-muted hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
