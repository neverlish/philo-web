'use client'

import Link from 'next/link'
import { useId, useRef, useState } from 'react'
import { AristotleTable } from '@/components/explorer/aristotle-table'
import { EXPERIMENTS, REFLECTION_KEY, parseReflection, type ReflectionRecord } from '@/lib/friendship-reflection'
import { trackExplorer } from '@/lib/posthog/explorer-events'

const button = 'min-h-11 border border-[#35463d] px-5 py-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-4 disabled:opacity-40'
const field = 'mt-3 block min-h-28 w-full border border-[#35463d]/35 bg-[#faf9f5] p-4 text-base leading-7 focus-visible:outline-2 focus-visible:outline-[#35463d]'

export function FriendshipReflection() {
  const id = useId(), heading = useRef<HTMLHeadingElement>(null)
  const [step, setStep] = useState(0)
  const [before, setBefore] = useState(''), [after, setAfter] = useState('')
  const [experiment, setExperiment] = useState(2), [review, setReview] = useState('')
  const [message, setMessage] = useState(''), [error, setError] = useState('')
  const [resumed, setResumed] = useState(false), [reviewPrompt, setReviewPrompt] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const once = useRef(new Set<string>())
  function go(next: number) {
    setStep(next); setMessage(''); setError('')
    requestAnimationFrame(() => heading.current?.focus())
  }
  function milestone(event: 'explorer_reflection_started' | 'explorer_reflection_compared' | 'explorer_reflection_reviewed') {
    if (!once.current.has(event)) { once.current.add(event); trackExplorer(event, 'aristotle') }
  }
  function save() {
    try {
      const record: ReflectionRecord = { version: 1, savedAt: Date.now(), before, after, experiment, review }
      localStorage.setItem(REFLECTION_KEY, JSON.stringify(record))
      setError(''); setMessage('이 브라우저에 저장했어요. 다음에 이 페이지에서 “기록 이어보기”를 눌러주세요.')
      trackExplorer('explorer_reflection_saved', 'aristotle')
    } catch {
      setError('이 브라우저에 저장하지 못했어요. 작성한 내용은 화면에 남아 있어요.'); setMessage('')
      trackExplorer('explorer_reflection_storage_failed', 'aristotle')
    }
  }
  function load() {
    try {
      const raw = localStorage.getItem(REFLECTION_KEY)
      if (!raw) { setMessage('이 브라우저에 저장한 기록이 없어요.'); return }
      const record = parseReflection(raw)
      if (!record) { setError('기록이 오래됐거나 읽을 수 없어요. 아래에서 이 기기의 기록을 지울 수 있어요.'); return }
      setBefore(record.before); setAfter(record.after); setExperiment(record.experiment); setReview(record.review)
      setResumed(true); go(4)
      trackExplorer('explorer_reflection_resumed', 'aristotle')
    } catch { setError('이 브라우저의 저장소를 읽을 수 없어요. 저장 없이도 시작할 수 있어요.'); trackExplorer('explorer_reflection_storage_failed', 'aristotle') }
  }
  const titles = ['친구에게 화가 난 날', '내 첫 생각은 어땠나요?', '모르던 사정이 있었다면?', '처음과 지금을 나란히', resumed ? '그 질문으로 지내보니, 어땠나요?' : '오늘은 작은 실험 하나만']
  return <section className="ph-no-capture ph-mask mx-auto max-w-3xl px-6 py-12 text-[#29372f]" data-private>
    <Link href="/explore/aristotle" className="inline-flex min-h-11 items-center text-sm underline underline-offset-4">← 아리스토텔레스 체험</Link>
    <p className="mb-3 mt-8 text-xs tracking-widest">생활 속 철학 · {step === 0 ? '한 가지 상황에서 시작하기' : `${step} / 4`}</p>
    <h1 ref={heading} tabIndex={-1} className="mb-6 font-serif text-3xl leading-relaxed focus:outline-none sm:text-4xl">{titles[step]}</h1>
    {step === 0 && <>
      <p className="text-base leading-8">친구가 약속에 늦었어요. 기다리는 동안 “나를 가볍게 여기는 걸까?”라는 생각이 들었어요. 이 장면에서 내 판단을 천천히 살펴볼까요?</p>
      <p className="mt-4 text-sm leading-7">제작진의 가상 상황입니다. 실제 일을 적어도, 이 예시로만 생각해도 괜찮아요. 이름 같은 개인 정보는 쓰지 않아도 됩니다.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <button className={`${button} bg-[#35463d] text-white`} onClick={() => { milestone('explorer_reflection_started'); go(1) }}>내 생각 살펴보기</button>
        <button className={button} onClick={load}>기록 이어보기</button>
      </div>
    </>}
    {step === 1 && <>
      <p className="mb-5 text-sm leading-8">무엇이 일어났고, 나는 거기에 어떤 뜻을 붙였나요? 감정을 고치려 하기보다 내 판단의 출발점을 적어보세요.</p>
      <label htmlFor={`${id}-before`}>첫 생각 · 선택 입력</label>
      <textarea id={`${id}-before`} className={field} maxLength={600} value={before} onChange={e => setBefore(e.target.value)} placeholder="예: 늦었다는 사실을 나를 존중하지 않는다는 뜻으로 받아들였어요." />
      <button className={`${button} mt-6`} onClick={() => go(2)}>다른 사정 살펴보기</button>
    </>}
    {step === 2 && <>
      <AristotleTable />
      <p className="mt-6 text-sm leading-8">아리스토텔레스의 중용은 단순한 중간이 아니라 상황에 맞는 판단을 묻습니다. 사정을 살피는 것과 내 불편을 말하는 것은 함께 가능할까요?</p>
      <button className={`${button} mt-6`} onClick={() => { milestone('explorer_reflection_compared'); go(3) }}>내 첫 생각과 비교하기</button>
    </>}
    {step === 3 && <>
      <p className="text-sm leading-8">생각이 그대로여도 괜찮아요. 그 이유가 더 분명해졌나요? 상대의 사정을 이해하는 것이 내 기다림을 중요하지 않게 만드는지도 물어보세요.</p>
      <div className="my-6 border-l-2 border-[#9b9377] pl-5"><p className="text-xs">처음의 생각</p><p className="mt-2 whitespace-pre-wrap break-words leading-8">{before || '말로 적지 않고 생각했어요.'}</p></div>
      <label htmlFor={`${id}-after`}>지금의 생각 · 선택 입력</label>
      <textarea id={`${id}-after`} className={field} maxLength={600} value={after} onChange={e => setAfter(e.target.value)} />
      <button className={`${button} mt-6`} onClick={() => go(4)}>생활로 가져가기</button>
    </>}
    {step === 4 && <>
      <div className="mb-8 grid gap-5 border-y border-[#35463d]/20 py-6 sm:grid-cols-2">
        {[['처음', before], ['다시 생각한 뒤', after]].map(([label, value]) => <div key={label}><p className="text-xs tracking-widest">{label}</p><p className="mt-2 whitespace-pre-wrap break-words text-sm leading-7">{value || '적지 않고 생각했어요.'}</p></div>)}
      </div>
      <fieldset><legend className="mb-4 font-serif text-xl">해보고 싶은 작은 실험</legend>
        {EXPERIMENTS.map((text, index) => <label key={text} className="flex min-h-11 cursor-pointer items-start gap-3 py-3 text-sm leading-7"><input type="radio" name={`${id}-experiment`} checked={experiment === index} onChange={() => setExperiment(index)} className="mt-2 accent-[#35463d]" />{text}</label>)}
      </fieldset>
      {resumed && <div className="mt-8">
        <p className="font-serif text-xl">정해둔 실험은 어땠나요?</p>
        <div className="my-4 flex flex-wrap gap-2">{[
          ['해봤어요', '예상과 달랐던 점이 있었나요?'], ['아직 못 했어요', '지금 해보기 어렵게 만드는 사정은 무엇인가요?'], ['생각이 달라졌어요', '어떤 경험이 생각을 바꾸었나요?'],
        ].map(([label, prompt]) => <button key={label} className={button} aria-pressed={reviewPrompt === prompt} onClick={() => { setReviewPrompt(prompt); milestone('explorer_reflection_reviewed') }}>{label}</button>)}</div>
        <p role="status" className="mb-3 text-sm leading-7">{reviewPrompt || '못 했어도 괜찮아요. 지금의 생각에서 이어가세요.'}</p>
        <label htmlFor={`${id}-review`}>돌아본 메모 · 선택 입력</label><textarea id={`${id}-review`} className={field} maxLength={600} value={review} onChange={e => setReview(e.target.value)} />
      </div>}
      <p className="mt-8 text-xs leading-6">저장은 선택이에요. 저장 버튼을 누를 때만 기존 기록 1건을 덮어씁니다. 이 브라우저에 암호화 없이 보관되므로 공용 기기에서는 저장하지 마세요. 서버·AI로 보내지 않으며, 브라우저 데이터를 지우면 복구할 수 없어요. 저장 후 30일이 지난 기록은 이어보지 않습니다.</p>
      <button className={`${button} mt-4 bg-[#35463d] text-white`} onClick={save}>이 기기에 저장하기</button>
      <p className="mt-4 text-sm leading-7">저장하지 않고 나가도 괜찮아요. 저장했다면 다음에 이 페이지의 “기록 이어보기”에서 돌아볼 수 있어요.</p>
    </>}
    {step > 0 && <button className={`${button} mt-6 mr-3`} onClick={() => go(step - 1)}>이전으로</button>}
    <div className="mt-8 border-t border-[#35463d]/20 pt-6">
      <p className="mb-3 text-xs leading-6">철학적 바탕: 아리스토텔레스 『니코마코스 윤리학』 제2권의 중용. 상황과 질문은 이를 생활에 적용해보도록 제작한 예시이며, 철학자의 직접 인용이나 정답 판정이 아닙니다.</p>
      <p className="text-xs leading-6">작성 내용은 기본적으로 이 화면에만 남고 새로고침하면 사라져요. 입력 문장과 실험·후기 선택 내용은 분석 이벤트에 포함하지 않습니다.</p>
      {!confirmDelete ? <button className="mt-3 min-h-11 text-xs underline" onClick={() => setConfirmDelete(true)}>이 기기의 저장 기록 삭제</button> : <div className="mt-3">
        <p className="text-sm">저장 기록 1건을 삭제할까요? 복구할 수 없습니다. 지금 화면의 작성 내용은 남습니다.</p>
        <button className={`${button} mr-3 mt-3`} onClick={() => {
          try { localStorage.removeItem(REFLECTION_KEY); setConfirmDelete(false); setError(''); setMessage('이 기기의 저장 기록을 삭제했어요.'); trackExplorer('explorer_reflection_deleted', 'aristotle') }
          catch { setError('저장 기록을 삭제하지 못했어요. 브라우저 설정에서 사이트 데이터를 확인해주세요.'); trackExplorer('explorer_reflection_storage_failed', 'aristotle') }
        }}>삭제 확인</button><button className={button} onClick={() => setConfirmDelete(false)}>취소</button>
      </div>}
      {message && <p role="status" className="mt-4 text-sm leading-7">{message}</p>}
      {error && <p role="alert" className="mt-4 text-sm leading-7">{error}</p>}
    </div>
  </section>
}
