import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { WISDOM_TOPIC_LIST } from '@/lib/wisdom-topics'

export const metadata: Metadata = {
  title: '고민별 철학 가이드',
  description: '불안, 인간관계, 삶의 의미처럼 오늘의 마음을 흔드는 고민을 철학자의 관점으로 천천히 살펴보세요.',
  alternates: { canonical: '/wisdom' },
  openGraph: {
    title: '고민별 철학 가이드',
    description: '오늘의 고민을 오래된 철학의 언어로 다시 바라봅니다.',
    url: '/wisdom',
  },
}

export default function WisdomPage() {
  return (
    <div className="min-h-dvh bg-[#F4F0E8] text-[#29231F]">
      <main className="mx-auto max-w-3xl px-5 pb-24 pt-6 sm:px-10 sm:pt-10">
        <Link href="/" className="inline-flex items-center gap-2 text-xs tracking-[0.16em] text-[#766D65] transition-colors hover:text-[#29231F]">
          <ArrowLeft className="h-4 w-4" strokeWidth={1.4} />
          오늘의철학
        </Link>

        <header className="border-b border-[#29231F]/15 pb-12 pt-16 sm:pb-16 sm:pt-24">
          <p className="mb-5 text-[10px] font-semibold tracking-[0.3em] text-[#9A5B38]">WISDOM INDEX · 01—03</p>
          <h1 className="max-w-xl font-serif text-5xl font-medium leading-[1.08] tracking-[-0.03em] sm:text-7xl">
            마음의 문제를<br />철학의 질문으로
          </h1>
          <p className="mt-7 max-w-lg text-[15px] leading-7 text-[#655D56] sm:text-base">
            정답을 서둘러 건네기보다, 지금의 고민을 다른 각도에서 바라볼 수 있는 질문을 모았습니다.
          </p>
        </header>

        <section aria-label="고민별 철학 가이드" className="divide-y divide-[#29231F]/15">
          {WISDOM_TOPIC_LIST.map((topic, index) => (
            <Link
              key={topic.slug}
              href={`/wisdom/${topic.slug}`}
              className="group grid grid-cols-[3rem_1fr] gap-3 py-10 sm:grid-cols-[5rem_1fr_auto] sm:items-end sm:py-14"
            >
              <span className="font-mono text-xs text-[#958A80]">0{index + 1}</span>
              <div>
                <p className="mb-3 text-[10px] font-semibold tracking-[0.22em]" style={{ color: topic.accent }}>{topic.eyebrow}</p>
                <h2 className="font-serif text-3xl leading-tight transition-transform duration-300 group-hover:translate-x-1 sm:text-4xl">{topic.title}</h2>
                <p className="mt-4 max-w-lg text-sm leading-6 text-[#6F665E]">{topic.description}</p>
              </div>
              <ArrowRight className="hidden h-5 w-5 text-[#766D65] transition-transform duration-300 group-hover:translate-x-2 sm:block" strokeWidth={1.3} />
            </Link>
          ))}
        </section>
      </main>
    </div>
  )
}
