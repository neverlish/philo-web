'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { PhilosophyDialogue } from '@/components/practice/philosophy-dialogue'
import { trackPractice, practiceAnalyticsHeaders } from '@/lib/posthog/practice-events'

export default function DialoguePage() {
  const router = useRouter()
  const [concern, setConcern] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const requestRef = useRef<AbortController | null>(null)
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('dialogueConcern')
      if (!stored?.trim() || stored.length > 1000) { router.replace('/'); return }
      // Restore this tab's concern only after hydration.
      setConcern(stored)
    } catch { router.replace('/') }
    return () => requestRef.current?.abort()
  }, [router])

  async function showPrescription() {
    if (!concern || requestRef.current) return
    trackPractice('dialogue_prescription_requested')
    const request = new AbortController()
    requestRef.current = request
    setLoading(true)
    setError('')
    const timeout = setTimeout(() => request.abort(), 30000)
    try {
      const response = await fetch('/api/prescription/preview', { method: 'POST', headers: { 'Content-Type': 'application/json', ...practiceAnalyticsHeaders() }, body: JSON.stringify({ concern }), signal: request.signal })
      if (response.status === 429) throw new Error('요청이 많아요. 최대 10분 뒤 다시 시도해주세요. 대화 메모는 계속 작성할 수 있어요.')
      if (!response.ok) throw new Error('처방을 받지 못했어요. 잠시 후 다시 시도해주세요.')
      const data = await response.json()
      if (!data.prescription?.quote?.application) throw new Error('처방을 받지 못했어요. 다시 시도해주세요.')
      sessionStorage.setItem('previewPrescription', JSON.stringify({ concern, ...data.prescription }))
      localStorage.setItem('pendingConcern', concern)
      trackPractice('dialogue_prescription_received')
      router.push('/preview/prescription')
    } catch (failure) {
      trackPractice('dialogue_prescription_failed', { reason: request.signal.aborted ? 'timeout' : 'request_failed' })
      setError(request.signal.aborted ? '응답 시간이 길어졌어요. 다시 시도해주세요.' : failure instanceof Error ? failure.message : '잠시 후 다시 시도해주세요.')
    } finally { clearTimeout(timeout); requestRef.current = null; setLoading(false) }
  }

  return <main className="mx-auto min-h-dvh max-w-xl px-6 py-8">
    <Link href="/" className="text-sm underline underline-offset-4">← 오늘의철학</Link>
    <header className="pb-3 pt-12">
      <p className="text-xs tracking-widest text-muted">나를 알아가는 짧은 대화</p>
      <h1 className="mt-4 font-serif text-4xl leading-tight">답을 서두르지<br />않아도 괜찮아요.</h1>
    </header>
    {concern ? <>
      <PhilosophyDialogue concern={concern} context="" entry />
      <details className="mb-10 border-t border-primary/20 pt-6">
        <summary className="cursor-pointer py-3 text-sm">대신 철학 처방을 바로 읽고 싶어요</summary>
        <p className="mt-3 text-xs leading-6 text-muted">처음 고민을 AI에 보내 해설과 실천 방법을 만듭니다. 대화와 같은 호출 한도를 사용합니다. 이동하면 현재 후속 대화와 메모는 사라지니 필요한 내용은 먼저 복사해주세요.</p>
        <button disabled={loading} onClick={() => void showPrescription()} className="mt-4 min-h-12 rounded-xl border border-primary/30 px-5 text-sm disabled:opacity-50">{loading ? '처방 준비 중…' : '처방 만들어 읽기'}</button>
        {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
      </details>
    </> : <p role="status" className="py-12 text-sm text-muted">고민을 불러오고 있어요…</p>}
    <Link href="/wisdom" className="text-sm underline underline-offset-4">대신 고민별 철학 읽기</Link>
  </main>
}
