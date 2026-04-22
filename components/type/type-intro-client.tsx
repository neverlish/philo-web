"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { usePostHog } from 'posthog-js/react'
import { getSajuInfo } from '@/lib/quiz'

export function TypeIntroClient() {
  const router = useRouter()
  const posthog = usePostHog()
  const [birthYear, setBirthYear] = useState('')

  const parsedYear = birthYear ? parseInt(birthYear) : NaN
  const isValidYear = parsedYear >= 1924 && parsedYear <= 2024
  const sajuInfo = isValidYear ? getSajuInfo(parsedYear) : null

  function handleStart() {
    if (isValidYear) {
      sessionStorage.setItem('philo_quiz_birth_year', String(parsedYear))
      posthog?.capture('quiz_birthyear_entered', { birthYear: parsedYear, zodiac: sajuInfo?.zodiac })
    } else {
      sessionStorage.removeItem('philo_quiz_birth_year')
      if (birthYear) posthog?.capture('quiz_birthyear_skipped')
    }
    router.push('/type/quiz')
  }

  return (
    <div>
      <div className="mb-5">
        <p className="text-muted text-xs mb-2 font-sans">
          생년도를 알려주시면 더 정확한 결과를 드려요
          <span className="ml-1 opacity-60">(선택)</span>
        </p>
        <input
          type="number"
          inputMode="numeric"
          placeholder="예: 1995"
          value={birthYear}
          onChange={(e) => setBirthYear(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 text-sm font-sans focus:outline-none focus:border-primary/40 transition-colors"
          min={1924}
          max={2024}
        />
        {sajuInfo && (
          <p className="mt-2 text-xs text-primary font-sans">
            {sajuInfo.zodiacEmoji} {sajuInfo.zodiac}띠 — {sajuInfo.zodiacDesc}
          </p>
        )}
      </div>

      <button
        onClick={handleStart}
        className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-serif font-medium text-sm tracking-wide transition-all active:scale-[0.98] text-white"
        style={{
          background: 'linear-gradient(135deg, #a33900 0%, #ec5b13 100%)',
          boxShadow: '0 4px 24px rgba(236, 91, 19, 0.35)',
        }}
      >
        지금 바로 알아보기
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  )
}
