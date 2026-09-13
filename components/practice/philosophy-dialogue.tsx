'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { trackPractice, practiceAnalyticsHeaders } from '@/lib/posthog/practice-events'
import { DIALOGUE_GOALS, MAX_DIALOGUE_MESSAGES, OPENING_QUESTION, type DialogueGoal, type DialogueMessage } from '@/lib/philosophy-dialogue'

export function PhilosophyDialogue({ concern, context, entry = false }: { concern: string; context: string; entry?: boolean }) {
  const [started, setStarted] = useState(false)
  const [messages, setMessages] = useState<DialogueMessage[]>([{ role: 'assistant', content: OPENING_QUESTION }])
  const [draft, setDraft] = useState('')
  const [pending, setPending] = useState('')
  const [error, setError] = useState('')
  const [ended, setEnded] = useState(false)
  const [reflection, setReflection] = useState('')
  const [goal, setGoal] = useState<DialogueGoal>('clarify')
  const [rewrite, setRewrite] = useState(concern)
  const [confirmed, setConfirmed] = useState(false)
  const [exercise, setExercise] = useState(false)
  const controller = useRef<AbortController | null>(null)
  const transcript = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLTextAreaElement>(null)
  const follow = useRef(true)
  const reduceMotion = useReducedMotion()
  const atLimit = messages.length + 1 > MAX_DIALOGUE_MESSAGES

  useEffect(() => () => controller.current?.abort(), [])
  useEffect(() => {
    if (follow.current && transcript.current) transcript.current.scrollTop = transcript.current.scrollHeight
  }, [messages, pending])

  function stop() {
    trackPractice('dialogue_ended', { entry, reason: 'manual', interrupted: !!controller.current, turn_count: Math.floor(messages.length / 2) })
    controller.current?.abort()
    controller.current = null
    setPending('')
    setError('')
    setEnded(true)
  }

  async function send(intent: 'explore' | 'summarize' = 'explore') {
    const text = intent === 'summarize' ? '지금까지의 대화를 오늘 할 작은 행동 하나로 정리해주세요.' : draft.trim()
    if (!text || controller.current || atLimit) return
    trackPractice('dialogue_message_submitted', { entry, intent, turn_count: Math.floor(messages.length / 2) + 1 })
    const request = new AbortController()
    controller.current = request
    setPending(text)
    setError('')
    const next: DialogueMessage[] = [...messages, { role: 'user', content: text }]
    const timer = setTimeout(() => request.abort(), 30000)
    try {
      const response = await fetch('/api/prescription/preview', {
        method: 'POST', headers: { 'Content-Type': 'application/json', ...practiceAnalyticsHeaders() }, signal: request.signal,
        body: JSON.stringify({ mode: 'dialogue', concern, context, messages: next, intent, goal }),
      })
      if (response.status === 429) throw new Error('요청이 많아요. 최대 10분 뒤 다시 보내거나, 지금 내 문장으로 마무리해도 괜찮아요.')
      if (!response.ok) throw new Error('답변을 받지 못했어요. 입력은 남겨두었으니 다시 보내거나 여기서 마칠 수 있어요.')
      const data = await response.json()
      if (typeof data.reply !== 'string' || !data.reply.trim()) throw new Error('답변이 비어 있어요. 잠시 후 다시 보내주세요.')
      if (controller.current !== request) return
      trackPractice('dialogue_reply_received', { entry, intent, turn_count: Math.floor(next.length / 2) })
      if (intent === 'summarize') trackPractice('dialogue_ended', { entry, reason: 'summary', turn_count: Math.floor(next.length / 2) })
      setMessages([...next, { role: 'assistant', content: data.reply }])
      if (intent === 'explore') setDraft('')
      if (intent === 'summarize') setEnded(true)
    } catch (failure) {
      if (controller.current === request) trackPractice('dialogue_request_failed', { entry, intent, reason: request.signal.aborted ? 'timeout' : 'request_failed' })
      if (controller.current === request) setError(request.signal.aborted ? '응답 시간이 길어졌어요. 입력은 그대로 남아 있습니다. 다시 보내주세요.' : failure instanceof Error ? failure.message : '잠시 후 다시 보내주세요.')
    } finally {
      clearTimeout(timer)
      if (controller.current === request) { controller.current = null; setPending('') }
    }
  }

  return (
    <section className="ph-no-capture ph-mask my-10 border-y border-primary/20 py-8" aria-labelledby="dialogue-heading">
      <p className="text-xs tracking-widest text-muted">정답보다, 다음 질문</p>
      <h2 id="dialogue-heading" className="mt-3 font-serif text-2xl">{entry ? '오늘은 어떤 대화가 필요하세요?' : '이 생각을 조금 더 나눠볼까요?'}</h2>
      {entry && <div className="mt-5 border-l-2 border-primary/30 pl-4"><p className="text-xs text-muted">처음 적은 고민</p><p className="mt-2 whitespace-pre-wrap break-words font-serif leading-7">{concern}</p></div>}
      <p className="mt-4 text-sm leading-6 text-muted">철학자의 사상에 기반한 AI 해석입니다. 실제 철학자와의 대화나 전문 상담은 아닙니다.</p>
      {!started ? <>
        {entry && <fieldset className="mt-5 space-y-2">
          <legend className="mb-3 text-sm">원하는 방향을 골라도, 그냥 시작해도 괜찮아요.</legend>
          {(Object.entries(DIALOGUE_GOALS) as [DialogueGoal, { label: string; question: string }][]).map(([key, value]) => <label key={key} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-primary/25 px-4 py-3 text-sm">
            <input type="radio" name="dialogue-goal" checked={goal === key} onChange={() => setGoal(key)} />{value.label}
          </label>)}
        </fieldset>}
        <p className="mt-3 text-xs leading-6 text-muted">전송하면 처음 고민·해설과 후속 대화가 AI 제공자에게 전달됩니다. 후속 대화는 계정에 저장하지 않으며 새로고침하면 사라집니다. 초기 처방과 합산해 IP당 10분에 5회 요청할 수 있어요.</p>
        <button onClick={() => { trackPractice('dialogue_started', { entry }); if (entry) setMessages([{ role: 'assistant', content: DIALOGUE_GOALS[goal].question }]); setStarted(true) }} className="mt-5 min-h-12 rounded-xl bg-foreground px-5 py-3 text-sm text-background">{entry ? '이 방향으로 이야기하기' : 'AI와 이어서 생각하기'}</button>
      </> : <>
        <div ref={transcript} role="region" aria-label="대화 내용" tabIndex={0}
          onScroll={() => { const el = transcript.current; if (el) follow.current = el.scrollHeight - el.scrollTop - el.clientHeight < 60 }}
          className="mt-6 max-h-[55dvh] space-y-6 overflow-y-auto overscroll-contain py-3 pr-2">
          {messages.map((message, index) => <motion.div key={index}
            initial={reduceMotion ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.2 }}
            className={message.role === 'user' ? 'ml-6 rounded-2xl bg-primary/10 p-4' : 'border-l-2 border-primary/40 pl-4'}>
            <p className="mb-2 text-xs text-muted">{message.role === 'user' ? '나' : '철학 안내자 · AI'}</p>
            <p className="whitespace-pre-wrap break-words text-[15px] leading-7">{message.content}</p>
          </motion.div>)}
          {pending && <div className="ml-6 rounded-2xl bg-primary/10 p-4"><p className="text-xs text-muted">나 · 보내는 중</p><p className="mt-2 whitespace-pre-wrap break-words text-sm leading-7">{pending}</p></div>}
        </div>
        <p role="status" className="sr-only">{pending ? '답변을 준비하고 있어요.' : messages.length > 1 ? messages[messages.length - 1].content : ''}</p>
        {pending && <p className="mt-3 text-sm text-muted"><span aria-hidden className="mr-2 inline-block motion-safe:animate-pulse">◯</span>답변을 준비하고 있어요…</p>}
        <button className="min-h-11 text-xs underline underline-offset-4" onClick={() => { follow.current = true; if (transcript.current) transcript.current.scrollTop = transcript.current.scrollHeight }}>최근 대화 보기</button>
        {error && <p role="alert" className="my-3 text-sm leading-6 text-destructive">{error}</p>}
        {!ended && !atLimit && <>
          <p className="mt-2 text-xs text-muted">{DIALOGUE_GOALS[goal].label}</p>
          <div className="my-3 flex flex-wrap gap-2">
            {['조금 달라요. 제 상황은 ', '다른 철학 관점으로도 살펴보고 싶어요.'].map(text => <button key={text} disabled={!!pending || !!draft.trim()} className="min-h-11 rounded-full border border-primary/25 px-3 text-xs disabled:opacity-50" onClick={() => { setDraft(text); input.current?.focus() }}>{text.startsWith('조금') ? '조금 달라요' : '다른 관점으로'}</button>)}
          </div>
          <form onSubmit={event => { event.preventDefault(); void send() }}>
            <label htmlFor="dialogue-draft" className="block text-sm">내 생각 이어서 적기</label>
            <textarea ref={input} id="dialogue-draft" maxLength={1000} rows={3} value={draft} disabled={!!pending} onChange={event => setDraft(event.target.value)} className="mt-2 w-full rounded-xl border border-primary/30 bg-background p-3 text-base leading-7" placeholder="맞지 않는 해석은 편하게 고쳐주세요." />
            <button disabled={!!pending || !draft.trim()} className="mt-3 min-h-12 rounded-xl bg-foreground px-5 text-sm text-background disabled:opacity-40">{pending ? '답변 기다리는 중' : '보내기'}</button>
          </form>
          <button disabled={!!pending || !!draft.trim() || messages.length < 3} onClick={() => void send('summarize')} className="mt-3 min-h-11 text-sm underline underline-offset-4 disabled:opacity-40">오늘 할 일로 정리해줘</button>
          <details className="mt-5 border-t border-primary/15 pt-3">
            <summary className="cursor-pointer py-3 font-serif text-lg">내 문장을 다르게 써보기</summary>
            <p className="my-3 text-xs leading-6 text-muted">AI가 정해주는 결론 대신 직접 고쳐보세요. 쓰는 동안에는 전송되지 않습니다.</p>
            <label htmlFor="dialogue-rewrite" className="text-sm">지금의 나는 이렇게 표현하고 싶어요</label>
            <textarea id="dialogue-rewrite" maxLength={900} rows={3} value={rewrite} onChange={event => setRewrite(event.target.value)} className="mt-2 w-full rounded-xl border border-primary/30 bg-background p-3 text-base leading-7" />
            <button disabled={!!pending || !!draft.trim() || !rewrite.trim()} onClick={() => { trackPractice('dialogue_rewrite_used', { entry }); setDraft(`처음 고민을 이렇게 고쳐 표현하고 싶어요: ${rewrite.trim()}\n이 표현을 바탕으로 함께 생각해주세요.`); input.current?.focus() }} className="min-h-11 text-sm underline underline-offset-4 disabled:opacity-40">고친 문장을 입력창에 담기</button>
          </details>
          <div className="mt-3 border-t border-primary/15 pt-3">
            <button aria-expanded={exercise} onClick={() => { if (!exercise) trackPractice('dialogue_experiment_opened', { entry }); setExercise(!exercise) }} className="min-h-11 font-serif text-lg">{exercise ? '사고실험 접기' : '짧은 사고실험을 해볼까요?'}</button>
            {exercise && <div className="mt-2 rounded-xl bg-primary/10 p-4">
              <p className="text-xs text-muted">오늘의철학이 만든 질문 · 건너뛰어도 괜찮아요</p>
              <p className="mt-3 font-serif text-lg leading-7">지금 원하는 것을 아무도 알아주지 않아도, 여전히 그것을 원할까요?</p>
              <div className="mt-3 flex flex-wrap gap-2">{['그래도 원해요', '달라질 것 같아요', '아직 모르겠어요'].map(answer => <button key={answer} disabled={!!pending || !!draft.trim()} className="min-h-11 rounded-lg border border-primary/30 px-3 text-sm disabled:opacity-40" onClick={() => { trackPractice('dialogue_experiment_used', { entry }); setDraft(`사고실험: 지금 원하는 것을 아무도 알아주지 않아도 여전히 원할까요?\n내 답: ${answer}\n이유: `); input.current?.focus() }}>{answer}</button>)}</div>
              <p className="mt-3 text-xs leading-6 text-muted">정답이나 성격 판정은 없습니다. 선택하면 입력창에 담기며, 보내기 전 이유를 덧붙이거나 지울 수 있어요.</p>
            </div>}
          </div>
          {draft.trim() && <p className="mt-2 text-xs text-muted">작성 중인 문장을 보내거나 비우면 다른 질문을 담을 수 있어요.</p>}
        </>}
        {atLimit && !ended && <p className="mt-3 text-sm leading-6">이번 대화의 길이 한도에 도달했어요. 지금 떠오르는 생각을 내 문장으로 정리해보세요.</p>}
        {!ended && <button onClick={stop} className="mt-3 block min-h-11 text-sm underline underline-offset-4">{pending ? '응답 중단하고 내 문장으로 마치기' : '여기서 마치고 내 문장 남기기'}</button>}
        {ended && <div className="mt-5 rounded-xl bg-primary/10 p-5">
          <label htmlFor="dialogue-reflection" className="font-serif text-lg">오늘 내가 발견한 것은…</label>
          <textarea id="dialogue-reflection" maxLength={1000} rows={4} value={reflection} onChange={event => { setReflection(event.target.value); setConfirmed(false) }} className="mt-3 w-full rounded-lg border border-primary/30 bg-background p-3 text-base leading-7" placeholder="AI의 답과 달라도 괜찮아요. 내 말로 적어보세요." />
          <button disabled={!reflection.trim()} onClick={() => { if (!confirmed) trackPractice('dialogue_reflection_compared', { entry }); setConfirmed(true) }} className="mt-3 min-h-11 text-sm underline underline-offset-4 disabled:opacity-40">처음 생각과 나란히 보기</button>
          {confirmed && <motion.div initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduceMotion ? 0 : 0.2 }} className="mt-4 space-y-4 border-y border-primary/20 py-5" aria-label="내 생각의 두 문장">
            <div><p className="text-xs text-muted">처음의 문장</p><p className="mt-2 whitespace-pre-wrap break-words leading-7">{concern}</p></div>
            <div><p className="text-xs text-muted">지금 내가 쓴 문장</p><p className="mt-2 whitespace-pre-wrap break-words font-serif text-lg leading-7">{reflection}</p></div>
            <p className="text-xs leading-6 text-muted">생각이 달라지지 않았어도 괜찮아요. 둘 다 지금의 나를 이해하는 단서입니다.</p>
          </motion.div>}
          <p className="mt-3 text-xs leading-6 text-muted">이 메모는 AI로 보내거나 저장하지 않습니다. 필요하면 직접 복사해두세요. 처방 저장에도 후속 대화와 메모는 포함되지 않습니다.</p>
          {!atLimit && <button className="mt-2 min-h-11 text-sm underline underline-offset-4" onClick={() => { trackPractice('dialogue_resumed', { entry }); setEnded(false) }}>조금 더 이야기하기</button>}
        </div>}
      </>}
    </section>
  )
}
