"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { usePostHog } from 'posthog-js/react'
import { getMbtiMapping } from '@/lib/quiz'

const AXES = [
  { left: 'E', right: 'I', leftLabel: '외향형', rightLabel: '내향형' },
  { left: 'S', right: 'N', leftLabel: '감각형', rightLabel: '직관형' },
  { left: 'T', right: 'F', leftLabel: '사고형', rightLabel: '감정형' },
  { left: 'J', right: 'P', leftLabel: '판단형', rightLabel: '인식형' },
]

export function TypeIntroClient() {
  const router = useRouter()
  const posthog = usePostHog()
  // null = 미선택, 0 = left, 1 = right
  const [selected, setSelected] = useState<(0 | 1 | null)[]>([null, null, null, null])

  const mbti = selected.every((v) => v !== null)
    ? selected.map((v, i) => (v === 0 ? AXES[i].left : AXES[i].right)).join('')
    : null

  const mapping = mbti ? getMbtiMapping(mbti) : null

  function toggle(axisIdx: number, side: 0 | 1) {
    setSelected((prev) => {
      const next = [...prev] as (0 | 1 | null)[]
      next[axisIdx] = prev[axisIdx] === side ? null : side
      return next
    })
  }

  function handleStart(withMbti: boolean) {
    if (withMbti && mbti) {
      sessionStorage.setItem('philo_quiz_mbti', mbti)
      posthog?.capture('quiz_mbti_entered', { mbti })
    } else {
      sessionStorage.removeItem('philo_quiz_mbti')
      if (!withMbti) posthog?.capture('quiz_mbti_skipped')
    }
    router.push('/type/quiz')
  }

  return (
    <div>
      <p className="text-muted text-xs mb-3 font-sans">
        MBTI를 알고 계신가요? 더 정확한 결과를 드려요
        <span className="ml-1 opacity-60">(선택)</span>
      </p>

      {/* 4축 토글 */}
      <div className="flex flex-col gap-2 mb-4">
        {AXES.map((axis, axisIdx) => (
          <div key={axisIdx} className="flex gap-2">
            <button
              onClick={() => toggle(axisIdx, 0)}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium font-sans transition-all"
              style={{
                background: selected[axisIdx] === 0 ? 'rgba(236,91,19,0.10)' : '#f5f5f4',
                border: selected[axisIdx] === 0 ? '1.5px solid rgba(236,91,19,0.4)' : '1.5px solid transparent',
                color: selected[axisIdx] === 0 ? '#a33900' : '#78716c',
              }}
            >
              <span className="font-bold">{axis.left}</span>
              <span className="text-xs ml-1 opacity-70">{axis.leftLabel}</span>
            </button>
            <button
              onClick={() => toggle(axisIdx, 1)}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium font-sans transition-all"
              style={{
                background: selected[axisIdx] === 1 ? 'rgba(236,91,19,0.10)' : '#f5f5f4',
                border: selected[axisIdx] === 1 ? '1.5px solid rgba(236,91,19,0.4)' : '1.5px solid transparent',
                color: selected[axisIdx] === 1 ? '#a33900' : '#78716c',
              }}
            >
              <span className="font-bold">{axis.right}</span>
              <span className="text-xs ml-1 opacity-70">{axis.rightLabel}</span>
            </button>
          </div>
        ))}
      </div>

      {/* MBTI 미리보기 */}
      {mbti && mapping && (
        <div
          className="rounded-xl px-4 py-3 mb-4 flex items-center gap-3"
          style={{ background: 'rgba(236,91,19,0.06)', border: '1px solid rgba(236,91,19,0.12)' }}
        >
          <div>
            <p className="text-xs font-bold text-primary font-sans">
              {mbti} 유형이 감지됐어요
            </p>
            <p className="text-xs text-muted font-sans mt-0.5">
              {mapping.combinedTitle}에 가까울 것 같아요
            </p>
          </div>
        </div>
      )}

      {/* CTA */}
      <button
        onClick={() => handleStart(!!mbti)}
        className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-serif font-medium text-sm tracking-wide transition-all active:scale-[0.98] text-white"
        style={{
          background: 'linear-gradient(135deg, #a33900 0%, #ec5b13 100%)',
          boxShadow: '0 4px 24px rgba(236, 91, 19, 0.35)',
        }}
      >
        {mbti ? `${mbti}로 알아보기` : '지금 바로 알아보기'}
        <ArrowRight className="w-4 h-4" />
      </button>

      {mbti && (
        <button
          onClick={() => handleStart(false)}
          className="w-full text-center text-xs text-muted/50 mt-2 py-1 font-sans"
        >
          MBTI 없이 시작하기
        </button>
      )}
    </div>
  )
}
