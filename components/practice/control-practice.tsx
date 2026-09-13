'use client'

import { useRef, useState } from 'react'
import { trackPractice } from '@/lib/posthog/practice-events'

const fields = [
  { key: 'concern', label: '지금 마음에 걸리는 일', placeholder: '예: 면접 결과가 걱정된다' },
  { key: 'choice', label: '내가 선택할 수 있는 행동', placeholder: '예: 예상 질문을 10분 연습하기' },
  { key: 'outside', label: '내 뜻대로 정할 수 없는 결과', placeholder: '예: 면접관의 평가와 최종 합격 여부' },
  { key: 'action', label: '오늘 할 작은 행동 하나', placeholder: '예: 저녁 7시에 자기소개를 한 번 읽기' },
] as const
const empty = { concern: '', choice: '', outside: '', action: '' }

export function ControlPractice() {
  const started = useRef(false)
  const [values, setValues] = useState(empty)
  const [done, setDone] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)
  const hasInput = Object.values(values).some(Boolean)

  return (
    <section className="ph-no-capture ph-mask mb-12" aria-label="나의 통제 구분 연습" data-private>
      <p className="mb-6 text-xs leading-6 text-[#655D56]">입력은 이 화면에서만 사용하며 서버나 AI로 보내지 않습니다. 저장되지 않으며 새로고침하면 사라집니다.</p>
      <form onSubmit={(event) => { event.preventDefault(); if (!done) trackPractice('control_practice_completed'); setDone(true) }}>
        <div className="grid gap-6 sm:grid-cols-2">
          {fields.map((field, index) => (
            <div key={field.key} className={index === 0 || index === 3 ? 'sm:col-span-2' : ''}>
              <label htmlFor={field.key} className="mb-3 block font-serif text-lg">{field.label}</label>
              <textarea id={field.key} required maxLength={500} rows={3} autoComplete="off"
                className="ph-no-capture ph-mask w-full resize-y rounded-none border border-[#766D65] bg-white/40 p-4 text-base leading-7 outline-offset-4 focus:outline-2 focus:outline-[#9A5B38]"
                placeholder={field.placeholder} value={values[field.key]}
                onChange={(event) => { if (!started.current && event.target.value.trim()) { started.current = true; trackPractice('control_practice_started') } setValues({ ...values, [field.key]: event.target.value }); setDone(false); setConfirmReset(false) }} />
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button type="submit" disabled={!Object.values(values).every(value => value.trim())} className="min-h-12 bg-[#29231F] px-6 py-3 text-[#F4F0E8] disabled:cursor-not-allowed disabled:opacity-50">오늘의 한 걸음 정하기</button>
          <button type="button" disabled={!hasInput} onClick={() => setConfirmReset(true)} className="min-h-12 px-3 underline underline-offset-4 disabled:opacity-40">모두 지우기</button>
        </div>
        {confirmReset && <div className="mt-5 border border-[#766D65] p-4" role="group" aria-label="내용 삭제 확인">
          <p className="text-sm">입력한 내용을 모두 지울까요? 되돌릴 수 없습니다.</p>
          <button type="button" onClick={() => { trackPractice('control_practice_reset'); started.current = false; setValues(empty); setDone(false); setConfirmReset(false) }} className="mr-5 min-h-12 underline">네, 지울게요</button>
          <button type="button" onClick={() => setConfirmReset(false)} className="min-h-12 underline">취소</button>
        </div>}
      </form>
      <div role="status" className="mt-6">
        {done && <div className="border-l-2 border-[#9A5B38] bg-[#EAE2D5] p-6">
          <h2 className="font-serif text-xl">오늘의 한 걸음을 정했어요</h2>
          <p className="mt-3 whitespace-pre-wrap break-words leading-7">{values.action}</p>
          <p className="mt-4 text-sm text-[#655D56]">결과를 보장하기보다, 정한 행동을 시도했는지 돌아보세요. 이 내용은 저장되지 않습니다.</p>
        </div>}
      </div>
    </section>
  )
}
