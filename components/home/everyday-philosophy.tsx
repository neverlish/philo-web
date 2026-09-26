'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { trackHomePractice } from '@/lib/posthog/home-practice-events'

const scenes = [
  { label: '친구에게 마음이 걸려요', title: '친구에게 화가 난 날', eyebrow: '첫 번째 장면 · 관계', question: '나를 가볍게 여긴 걸까요, 아직 모르는 사정이 있는 걸까요?', image: 'aristotle', alt: '오래된 실내의 탁자와 인물들로 대화의 상황을 표현한 그림', caption: '아리스토텔레스의 질문을 해석한 AI 생성 그림', href: '/practice/friendship', note: '로그인 없이 · 적지 않고 생각만 해도 괜찮아요', invitation: '처음의 생각을 놓아보고, 다른 사정을 만나고, 생활로 가져갈 질문 하나를 남겨요.' },
  { label: '내 뜻대로 되지 않아요', title: '내 뜻대로 되지 않는 날', eyebrow: '두 번째 장면 · 선택', question: '결과를 정할 수 없어도, 지금 내가 선택할 행동은 있을까요?', image: 'descartes', alt: '창가의 오래된 책상 위에 물 한 잔이 놓인 조용한 방', caption: '잠시 생각을 멈춰볼 자리 · AI 생성 그림', href: '/practice/control', note: '로그인 없이 · 작성 내용은 저장되지 않아요', invitation: '마음에 걸리는 일을 적고, 결과와 행동을 나눈 뒤, 오늘 시도할 작은 한 걸음을 정해요.' },
] as const

export function EverydayPhilosophy() {
  const [selected, setSelected] = useState(0)
  const scene = scenes[selected]
  return <section aria-labelledby="everyday-heading" className="mb-9 pt-6 text-[#29372f]">
    <p className="mb-4 text-[10px] tracking-[0.22em] text-muted">오늘의철학 · 생활 속 사유</p>
    <h1 id="everyday-heading" className="font-serif text-[30px] leading-[1.65] tracking-tight break-keep">오늘 마음에<br />남은 일이 있나요?</h1>
    <p className="mt-4 text-sm leading-7 text-muted">정답을 서두르지 않아도 괜찮아요.<br />익숙한 일을 다른 눈으로 보는 데서 시작해요.</p>

    <fieldset className="ph-no-capture mt-6" data-private>
      <legend className="mb-3 text-xs text-muted">지금 가까운 장면을 골라보세요</legend>
      <div className="flex flex-wrap gap-2">{scenes.map((item, index) => <button key={item.href} type="button" aria-pressed={selected === index} aria-controls="everyday-scene" onClick={() => { if (selected !== index) { setSelected(index); trackHomePractice('home_practice_scene_changed') } }} className={`min-h-11 border px-3 py-3 text-xs focus-visible:outline-2 focus-visible:outline-offset-4 ${selected === index ? 'border-[#35463d] bg-[#35463d] text-white' : 'border-[#35463d]/30 text-[#35463d]'}`}>{item.label}</button>)}</div>
    </fieldset>
    <article id="everyday-scene" className="mt-5 border border-[#35463d]/20 bg-[#eeece3] p-3">
      <figure>
        <Image src={`/explorer/${scene.image}-scene-v2.webp`} alt={scene.alt} width={1536} height={1024} sizes="(max-width: 448px) calc(100vw - 74px), 374px" preload={selected === 0} className="h-auto w-full" />
        <figcaption className="mt-2 text-right text-[10px] text-muted">{scene.caption}</figcaption>
      </figure>
      <div className="px-2 pb-3 pt-6">
        <div aria-live="polite" aria-atomic="true">
          <p className="text-[10px] tracking-widest text-muted">{scene.eyebrow}</p>
          <h2 className="mt-3 font-serif text-2xl leading-relaxed">{scene.title}</h2>
          <p className="mt-3 text-sm leading-7 text-muted">{scene.question}</p>
        </div>
        <Link href={scene.href} prefetch={false} onClick={() => trackHomePractice('home_practice_opened', selected === 0 ? 'friendship' : 'control')} className="mt-6 flex min-h-12 items-center justify-between gap-3 bg-[#35463d] px-4 py-3 text-sm text-[#faf9f5] hover:bg-[#29372f] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#35463d]">이 장면에서 시작하기 <span aria-hidden="true">→</span></Link>
        <p className="mt-3 text-[11px] leading-6 text-muted">{scene.note}</p>
      </div>
    </article>

    <p className="mt-6 font-serif text-base leading-8">{scene.invitation}</p>
    <Link href="/practice/friendship" prefetch={false} onClick={() => trackHomePractice('home_reflection_resume_clicked')} className="mt-3 inline-flex min-h-11 items-center text-xs underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4">지난번 이 기기에 남긴 생각 이어보기 →</Link>
    <p className="text-[11px] leading-6 text-muted">‘친구에게 화가 난 날’에서 저장한 기록이 있을 때만 이어볼 수 있어요. 연습 페이지에서 ‘기록 이어보기’를 눌러주세요.</p>

    <Link href="/practice/control" prefetch={false} onClick={() => trackHomePractice('home_practice_opened', 'control')} className="mt-7 flex min-h-11 items-center justify-between gap-4 border-y border-[#35463d]/20 py-5 focus-visible:outline-2 focus-visible:outline-offset-4">
      <span><span className="block text-[10px] tracking-widest text-muted">다른 마음에서 시작하기</span><span className="mt-2 block font-serif text-lg">내 뜻대로 되지 않는 날</span><span className="mt-2 block text-xs leading-6 text-muted">내가 바꿀 수 있는 것부터 나누어봐요.</span></span><span aria-hidden="true">→</span>
    </Link>
  </section>
}
