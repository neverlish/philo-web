// app/philosopher/[id]/page.tsx
import { cache } from 'react'
import { notFound, permanentRedirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Mic } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { DbPhilosopher, DbQuote } from '@/types'
import type { Metadata } from 'next'
import { getPhilosopherPath, getPhilosopherSlug, isPhilosopherId } from '@/lib/philosopher-slugs'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://philo-web.vercel.app'

const getPhilosopher = cache(async (routeParam: string) => {
  if (isPhilosopherId(routeParam)) {
    const { data } = await supabase
      .from('philosophers')
      .select('*')
      .eq('id', routeParam)
      .maybeSingle()

    return data
  }

  const { data } = await supabase
    .from('philosophers')
    .select('*')

  return data?.find((philosopher) => getPhilosopherSlug(philosopher.name_en) === routeParam) ?? null
})

export async function generateStaticParams() {
  const { data } = await supabase
    .from('philosophers')
    .select('name_en')

  return (data ?? [])
    .map((philosopher) => getPhilosopherSlug(philosopher.name_en))
    .filter(Boolean)
    .map((id) => ({ id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const data = await getPhilosopher(id)

  if (!data) return { title: '철학자' }

  const canonicalPath = getPhilosopherPath(data.id, data.name_en)

  return {
    title: `${data.name} 철학: 핵심 사상과 명언`,
    description: data.core_idea,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: `${data.name} 철학: 핵심 사상과 명언`,
      description: data.core_idea,
      url: canonicalPath,
    },
  }
}

export default async function PhilosopherPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const philosopher = await getPhilosopher(id)

  if (!philosopher) notFound()

  const canonicalPath = getPhilosopherPath(philosopher.id, philosopher.name_en)
  if (id !== getPhilosopherSlug(philosopher.name_en)) {
    permanentRedirect(canonicalPath)
  }

  const { data: quotes } = await supabase
    .from('quotes')
    .select('*')
    .eq('philosopher_id', philosopher.id)
    .order('created_at', { ascending: false })

  const p = philosopher as DbPhilosopher
  const quoteList = (quotes ?? []) as DbQuote[]
  const philosopherUrl = `${siteUrl}${canonicalPath}`
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: '오늘의철학',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: p.name,
        item: philosopherUrl,
      },
    ],
  }

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-background shadow-2xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, '\\u003c'),
        }}
      />
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md px-4 py-5 flex items-center">
        <Link href="/" className="p-2 -ml-2 hover:bg-primary/10 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </header>

      <main className="flex-1 px-6 pb-16 overflow-y-auto">
        {/* Philosopher Identity */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-medium tracking-wider uppercase bg-primary/10 text-primary px-2.5 py-1 rounded-full">
              {p.region} · {p.era}
            </span>
            {p.years && (
              <span className="text-[10px] text-muted">{p.years}</span>
            )}
          </div>
          <h1 className="text-3xl font-serif font-normal text-foreground mb-1">{p.name}</h1>
          <p className="text-sm text-muted">{p.name_en}</p>
        </div>

        {/* Core Idea */}
        <section className="mb-8">
          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6">
            <p className="text-[10px] font-medium tracking-widest uppercase text-primary mb-3">핵심 사상</p>
            <p className="font-serif text-lg leading-relaxed text-foreground">{p.core_idea}</p>
          </div>
        </section>

        {/* Description */}
        {p.description && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1 h-4 bg-foreground" />
              <h2 className="text-sm font-bold tracking-widest">소개</h2>
            </div>
            <p className="text-[15px] leading-relaxed text-foreground/80">{p.description}</p>
          </section>
        )}

        {/* Keywords */}
        {p.keywords?.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1 h-4 bg-foreground" />
              <h2 className="text-sm font-bold tracking-widest">키워드</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {p.keywords.map((kw) => (
                <span
                  key={kw}
                  className="text-xs px-3 py-1.5 bg-stone-100 text-muted rounded-full"
                >
                  {kw}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Quotes */}
        {quoteList.length > 0 && (
          <section id="quotes" className="mb-8 scroll-mt-24">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1 h-4 bg-foreground" />
              <h2 className="text-sm font-bold tracking-widest">명언</h2>
            </div>
            <div className="space-y-4">
              {quoteList.map((q) => (
                <div key={q.id} className="bg-card border border-border rounded-2xl p-5">
                  <blockquote className="font-serif text-base leading-relaxed text-foreground mb-3">
                    &ldquo;{q.text}&rdquo;
                  </blockquote>
                  {q.meaning && (
                    <p className="text-sm text-muted leading-relaxed">{q.meaning}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Application */}
        {p.application && (
          <section className="mb-10">
            <div className="bg-primary/10 rounded-2xl p-6">
              <p className="text-[10px] font-medium tracking-widest uppercase text-primary mb-3">오늘 적용하기</p>
              <p className="text-[15px] leading-relaxed text-foreground/90">{p.application}</p>
            </div>
          </section>
        )}

        {/* CTA */}
        <Link
          href="/opening/input"
          className="flex items-center justify-center gap-2 w-full bg-foreground text-background py-4 rounded-xl font-medium text-sm transition-all active:scale-95"
        >
          <Mic className="w-4 h-4" strokeWidth={1.5} />
          이 철학자에게 처방 받기
        </Link>
      </main>
    </div>
  )
}
