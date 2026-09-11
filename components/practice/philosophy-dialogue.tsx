'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { MAX_DIALOGUE_MESSAGES, OPENING_QUESTION, type DialogueMessage } from '@/lib/philosophy-dialogue'

export function PhilosophyDialogue({ concern, context }: { concern: string; context: string }) {
  const [started, setStarted] = useState(false)
  const [messages, setMessages] = useState<DialogueMessage[]>([{ role: 'assistant', content: OPENING_QUESTION }])
  const [draft, setDraft] = useState('')
  const [pending, setPending] = useState('')
  const [error, setError] = useState('')
  const [ended, setEnded] = useState(false)
  const [reflection, setReflection] = useState('')
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
    controller.current?.abort()
    controller.current = null
    setPending('')
    setError('')
    setEnded(true)
  }

  async function send(intent: 'explore' | 'summarize' = 'explore') {
    const text = intent === 'summarize' ? '지금까지의 대화를 오늘 할 작은 행동 하나로 정리해주세요.' : draft.trim()
    if (!text || controller.current || atLimit) return
    const request = new AbortController()
    controller.current = request
    setPending(text)
    setError('')
    const next: DialogueMessage[] = [...messages, { role: 'user', content: text }]
    const timer = setTimeout(() => request.abort(), 30000)
    try {
      const response = await fetch('/api/prescription/preview', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: request.signal,
        body: JSON.stringify({ mode: 'dialogue', concern, context, messages: next, intent }),
      })
      if (response.status === 429) throw new Error('요청이 많아요. 최대 10분 뒤 다시 보내거나, 지금 내 문장으로 마무리해도 괜찮아요.')
      if (!response.ok) throw new Error('답변을 받지 못했어요. 입력은 남겨두었으니 다시 보내거나 여기서 마칠 수 있어요.')
      const data = await response.json()
      if (typeof data.reply !== 'string' || !data.reply.trim()) throw new Error('답변이 비어 있어요. 잠시 후 다시 보내주세요.')
      if (controller.current !== request) return
      setMessages([...next, { role: 'assistant', content: data.reply }])
      if (intent === 'explore') setDraft('')
      if (intent === 'summarize') setEnded(true)
    } catch (failure) {
      if (controller.current === request) setError(request.signal.aborted ? '응답 시간이 길어졌어요. 입력은 그대로 남아 있습니다. 다시 보내주세요.' : failure instanceof Error ? failure.message : '잠시 후 다시 보내주세요.')
    } finally {
      clearTimeout(timer)
      if (controller.current === request) { controller.current = null; setPending('') }
    }
  }

  return (
    <section className="ph-no-capture ph-mask my-10 border-y border-primary/20 py-8" aria-labelledby="dialogue-heading">
      <p className="text-xs tracking-widest text-muted">정답보다, 다음 질문</p>
      <h2 id="dialogue-heading" className="mt-3 font-serif text-2xl">이 생각을 조금 더 나눠볼까요?</h2>
      <p className="mt-4 text-sm leading-6 text-muted">철학자의 사상에 기반한 AI 해석입니다. 실제 철학자와의 대화나 전문 상담은 아닙니다.</p>
      {!started ? <>
        <p className="mt-3 text-xs leading-6 text-muted">전송하면 처음 고민·해설과 후속 대화가 AI 제공자에게 전달됩니다. 후속 대화는 계정에 저장하지 않으며 새로고침하면 사라집니다. 초기 처방과 합산해 IP당 10분에 5회 요청할 수 있어요.</p>
        <button onClick={() => setStarted(true)} className="mt-5 min-h-12 rounded-xl bg-foreground px-5 py-3 text-sm text-background">AI와 이어서 생각하기</button>
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
          <div className="my-3 flex flex-wrap gap-2">
            {['조금 달라요. 제 상황은 ', '다른 철학 관점으로도 살펴보고 싶어요.'].map(text => <button key={text} disabled={!!pending} className="min-h-11 rounded-full border border-primary/25 px-3 text-xs disabled:opacity-50" onClick={() => { setDraft(text); input.current?.focus() }}>{text.startsWith('조금') ? '조금 달라요' : '다른 관점으로'}</button>)}
          </div>
          <form onSubmit={event => { event.preventDefault(); void send() }}>
            <label htmlFor="dialogue-draft" className="block text-sm">내 생각 이어서 적기</label>
            <textarea ref={input} id="dialogue-draft" maxLength={1000} rows={3} value={draft} disabled={!!pending} onChange={event => setDraft(event.target.value)} className="mt-2 w-full rounded-xl border border-primary/30 bg-background p-3 text-base leading-7" placeholder="맞지 않는 해석은 편하게 고쳐주세요." />
            <button disabled={!!pending || !draft.trim()} className="mt-3 min-h-12 rounded-xl bg-foreground px-5 text-sm text-background disabled:opacity-40">{pending ? '답변 기다리는 중' : '보내기'}</button>
          </form>
          <button disabled={!!pending || !!draft.trim() || messages.length < 3} onClick={() => void send('summarize')} className="mt-3 min-h-11 text-sm underline underline-offset-4 disabled:opacity-40">오늘 할 일로 정리해줘</button>
        </>}
        {atLimit && !ended && <p className="mt-3 text-sm leading-6">이번 대화의 길이 한도에 도달했어요. 지금 떠오르는 생각을 내 문장으로 정리해보세요.</p>}
        {!ended && <button onClick={stop} className="mt-3 block min-h-11 text-sm underline underline-offset-4">{pending ? '응답 중단하고 내 문장으로 마치기' : '여기서 마치고 내 문장 남기기'}</button>}
        {ended && <div className="mt-5 rounded-xl bg-primary/10 p-5">
          <label htmlFor="dialogue-reflection" className="font-serif text-lg">오늘 내가 발견한 것은…</label>
          <textarea id="dialogue-reflection" maxLength={1000} rows={4} value={reflection} onChange={event => setReflection(event.target.value)} className="mt-3 w-full rounded-lg border border-primary/30 bg-background p-3 text-base leading-7" placeholder="AI의 답과 달라도 괜찮아요. 내 말로 적어보세요." />
          <p className="mt-3 text-xs leading-6 text-muted">이 메모는 AI로 보내거나 저장하지 않습니다. 필요하면 직접 복사해두세요. 처방 저장에도 후속 대화와 메모는 포함되지 않습니다.</p>
          {!atLimit && <button className="mt-2 min-h-11 text-sm underline underline-offset-4" onClick={() => setEnded(false)}>조금 더 이야기하기</button>}
        </div>}
      </>}
    </section>
  )
}
