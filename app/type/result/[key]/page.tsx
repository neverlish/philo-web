import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, RotateCcw, Quote, Heart, Sparkles } from 'lucide-react'
import { PHILOSOPHER_TYPES, type PhilosopherKey } from '@/lib/quiz'
import { ResultTracker, ResultCta, MbtiBanner } from '@/components/type/result-tracker'

interface Props {
  params: Promise<{ key: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { key } = await params
  const type = PHILOSOPHER_TYPES[key as PhilosopherKey]
  if (!type) return {}
  return {
    title: `나는 ${type.name}형 — ${type.typeName}`,
    description: type.headline,
  }
}

export default async function ResultPage({ params }: Props) {
  const { key } = await params
  const type = PHILOSOPHER_TYPES[key as PhilosopherKey]
  if (!type) notFound()

  const compatibleType = PHILOSOPHER_TYPES[type.compatibleType]

  return (
    <div className="min-h-dvh flex flex-col max-w-md mx-auto bg-background">
      <ResultTracker philosopherKey={type.key} philosopherName={type.name} />
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-md px-4 py-4 flex items-center justify-between">
        <Link
          href="/type"
          className="p-2 -ml-2 hover:bg-primary/10 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <span className="text-sm text-muted font-sans">나의 철학자 유형</span>
        <Link
          href="/type/quiz"
          className="p-2 -mr-2 hover:bg-primary/10 rounded-full transition-colors"
          aria-label="다시 하기"
        >
          <RotateCcw className="w-4 h-4 text-muted" />
        </Link>
      </header>

      <main className="flex-1 px-6 pt-6 pb-16">
        {/* 유형 Hero */}
        <section className="mb-10">
          <p className="text-muted text-xs tracking-widest uppercase mb-3 font-sans">
            나의 철학자 유형
          </p>
          <h1 className="font-serif text-4xl font-bold text-foreground mb-1">
            {type.name}
          </h1>
          <p className="text-primary font-serif text-lg font-medium mb-4">
            {type.typeName}
          </p>
          <p className="text-foreground text-base leading-relaxed font-sans">
            {type.headline}
          </p>
        </section>

        <MbtiBanner philosopherKey={type.key} philosopherName={type.name} />

        {/* 설명 */}
        <section
          className="rounded-2xl p-6 mb-6"
          style={{ background: '#fff' }}
        >
          <p className="text-foreground/80 text-[15px] leading-relaxed font-sans">
            {type.description}
          </p>
        </section>

        {/* 명언 */}
        <section
          className="rounded-2xl p-6 mb-6"
          style={{ background: 'rgba(236,91,19,0.06)' }}
        >
          <Quote className="w-5 h-5 text-primary mb-4 opacity-60" strokeWidth={1.5} />
          <blockquote className="font-serif text-xl font-medium leading-relaxed text-foreground mb-3">
            &ldquo;{type.quote}&rdquo;
          </blockquote>
          <p className="text-muted text-xs leading-relaxed">
            {type.quoteContext}
          </p>
        </section>

        {/* 샘플 처방 */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-primary" strokeWidth={1.5} />
            <h2 className="text-sm font-bold text-foreground">
              {type.name}라면 이렇게 처방했을까요
            </h2>
          </div>
          <div
            className="rounded-2xl p-6"
            style={{
              background: '#2C2420',
              boxShadow: '0 4px 24px rgba(44,36,32,0.12)',
            }}
          >
            <p className="text-white/50 text-xs mb-3 italic font-sans">
              &ldquo;{type.samplePrescription.concern}&rdquo;
            </p>
            <p className="text-white text-[15px] leading-relaxed font-sans">
              {type.samplePrescription.text}
            </p>
          </div>
        </section>

        {/* 궁합 유형 */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-4 h-4 text-primary" strokeWidth={1.5} />
            <h2 className="text-sm font-bold text-foreground">나와 잘 맞는 유형</h2>
          </div>
          <div
            className="rounded-2xl p-5 flex items-center gap-4"
            style={{ background: '#fff' }}
          >
            <div className="flex-1">
              <p className="font-serif font-bold text-foreground text-lg">
                {compatibleType.name}
              </p>
              <p className="text-primary text-sm font-medium mt-0.5">
                {compatibleType.typeName}
              </p>
              <p className="text-muted text-xs mt-2 leading-relaxed">
                {compatibleType.headline}
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <ResultCta philosopherKey={type.key} philosopherName={type.name} />
      </main>
    </div>
  )
}
