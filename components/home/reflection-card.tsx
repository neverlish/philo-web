"use client"

import { useState } from "react"
import { BookOpen } from "lucide-react"
import { usePostHog } from 'posthog-js/react'

interface ReflectionCardProps {
  prescriptionId: string
  prescriptionTitle: string
  philosopherName: string
  userIntention: string | null
  daysAgo: number
}

export function ReflectionCard({
  prescriptionId,
  prescriptionTitle,
  philosopherName,
  userIntention,
  daysAgo,
}: ReflectionCardProps) {
  const [open, setOpen] = useState(false)
  const [reflection, setReflection] = useState("")
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)
  const posthog = usePostHog()

  const handleSave = async () => {
    if (!reflection.trim() || saving) return
    setSaving(true)
    try {
      const res = await fetch(`/api/prescriptions/${prescriptionId}/reflection`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reflection }),
      })
      if (res.ok) {
        posthog?.capture('reflection_submitted', {
          prescription_id: prescriptionId,
          days_ago: daysAgo,
          reflection_length: reflection.trim().length,
        })
        setDone(true)
      }
    } finally {
      setSaving(false)
    }
  }

  if (done) return null

  return (
    <div className="w-full mb-6 bg-card border border-border rounded-2xl p-5">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
          <BookOpen className="w-4 h-4 text-primary" strokeWidth={1.5} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted mb-1">{daysAgo}일 전 처방</p>
          <p className="text-sm font-medium text-foreground mb-1 truncate">{prescriptionTitle}</p>
          <p className="text-xs text-muted">{philosopherName}</p>
          {userIntention && (
            <p className="text-xs text-primary mt-2">다짐: &ldquo;{userIntention}&rdquo;</p>
          )}
        </div>
      </div>

      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="w-full mt-4 py-2.5 border border-border rounded-xl text-sm text-foreground hover:bg-stone-50 transition-colors"
        >
          지금은 어떤가요? 회고 쓰기
        </button>
      ) : (
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="한 줄로 돌아보기..."
            autoFocus
            className="flex-1 bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary/40"
            maxLength={150}
          />
          <button
            onClick={handleSave}
            disabled={saving || !reflection.trim()}
            className="px-4 py-2.5 bg-foreground text-background rounded-xl text-sm font-medium disabled:opacity-40"
          >
            저장
          </button>
        </div>
      )}
    </div>
  )
}
