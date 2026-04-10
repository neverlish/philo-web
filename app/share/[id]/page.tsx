import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Clock, Mic } from 'lucide-react'
import type { Metadata } from 'next'
import type { Database } from '@/types/supabase'

type Row = Database['public']['Tables']['ai_prescriptions']['Row']

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const { data } = await supabase
    .from('ai_prescriptions')
    .select('title, philosopher_name, quote_text')
    .eq('id', id)
    .single()

  if (!data) return { title: '오늘의철학' }

  return {
    title: `${data.philosopher_name}의 처방 — ${data.title}`,
    description: data.quote_text,
    openGraph: {
      title: `${data.philosopher_name}의 처방`,
      description: data.quote_text,
    },
  }
}

export default async function SharePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const { data, error } = await supabase
    .from('ai_prescriptions')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) notFound()

  const row = data as Row

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-background">
      {/* Header */}
      <header className="px-6 py-6 flex items-center justify-between">
        <Link href="/" className="font-serif text-base font-bold text-foreground">
          오늘의철학
        </Link>
        <span className="text-xs text-muted">공유된 처방</span>
      </header>

      <main className="flex-1 px-6 pb-12">
        {/* Title */}
        <div className="mb-8 text-center">
          {row.concern && (
            <p className="text-xs text-muted mb-3 italic break-keep">
              &ldquo;{row.concern}&rdquo;
            </p>
          )}
          <h1 className="font-serif text-2xl font-bold leading-tight mb-2 text-foreground">
            {row.title}
          </h1>
          <p className="text-muted text-sm">{row.subtitle}</p>
        </div>

        {/* Quote Card */}
        <section className="bg-card rounded-3xl p-8 mb-8 shadow-sm relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-background rounded-full opacity-50" />
          <div className="relative z-10">
            <span className="inline-block border border-foreground rounded-full px-4 py-1 text-xs mb-6 font-serif">
              오늘의 처방
            </span>
            <blockquote className="font-serif text-xl leading-relaxed mb-8 text-foreground">
              {row.quote_text}
            </blockquote>
            <div>
              <p className="font-bold text-base font-serif text-foreground">{row.philosopher_name}</p>
              <p className="text-xs text-muted uppercase tracking-wider mt-1">
                {row.philosopher_school}, &lt;{row.philosopher_era}&gt;
              </p>
            </div>
          </div>
        </section>

        {/* Meaning */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1 h-4 bg-foreground" />
            <h2 className="text-sm font-bold tracking-widest">오늘의 지혜</h2>
          </div>
          <p className="text-foreground/80 text-[15px] leading-relaxed">{row.quote_meaning}</p>
        </section>

        {/* Application */}
        <section className="mb-10">
          <div className="bg-primary/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-card p-1.5 rounded-lg">
                <Clock className="w-4 h-4 text-primary" strokeWidth={2} />
              </div>
              <h3 className="font-bold text-sm">실천하기</h3>
            </div>
            <p className="text-[15px] leading-relaxed text-foreground/90">{row.quote_application}</p>
          </div>
        </section>

        {/* CTA */}
        <section className="pb-4">
          <p className="text-center text-sm text-muted mb-4">
            나도 나만의 철학 처방을 받고 싶다면
          </p>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full bg-foreground text-background py-4 rounded-xl font-medium text-sm transition-all active:scale-95"
          >
            <Mic className="w-4 h-4" strokeWidth={1.5} />
            오늘의 고민 이야기하기
          </Link>
        </section>
      </main>
    </div>
  )
}
