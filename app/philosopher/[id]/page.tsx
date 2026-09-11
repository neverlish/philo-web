// app/philosopher/[id]/page.tsx
import { cache } from 'react'
import { notFound, permanentRedirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Mic } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { DbPhilosopher, DbQuote } from '@/types'
import type { Metadata } from 'next'
import { getPhilosopherPath, getPhilosopherSlug, isPhilosopherId } from '@/lib/philosopher-slugs'
import { PHILOSOPHER_GUIDES } from '@/lib/philosopher-guides'
import { WISDOM_TOPIC_LIST } from '@/lib/wisdom-topics'

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
  const guide = PHILOSOPHER_GUIDES[getPhilosopherSlug(data.name_en)]

  return {
    title: `${data.name} 철학: 핵심 사상과 명언`,
    description: guide?.description ?? data.core_idea,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: `${data.name} 철학: 핵심 사상과 명언`,
      description: guide?.description ?? data.core_idea,
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
  const slug = getPhilosopherSlug(p.name_en)
  const guide = PHILOSOPHER_GUIDES[slug]
  const relatedTopics = WISDOM_TOPIC_LIST.filter((topic) => topic.philosophers.some((item) => item.slug === slug))
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
        <Link href="/" aria-label="홈으로" className="p-2 -ml-2 hover:bg-primary/10 rounded-full transition-colors">
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

        {guide && (
          <section aria-labelledby="philosophy-guide" className="mb-10 border-y border-foreground/10 py-7">
            <h2 id="philosophy-guide" className="font-serif text-2xl">{p.name} 철학 쉽게 읽기</h2>
            <p className="mt-3 text-xs leading-6 text-muted">아래는 참고 자료를 바탕으로 풀어 쓴 해설입니다.</p>
            {guide.sections.map((section) => (
              <div key={section.title} className="mt-7">
                <h3 className="font-serif text-lg leading-7">{section.title}</h3>
                <p className="mt-3 text-[15px] leading-7 text-muted">{section.text}</p>
              </div>
            ))}
            <h3 className="mt-8 font-serif text-lg">일상에 적용해보기</h3>
            <p className="mt-2 text-xs text-muted">오늘의철학이 제안하는 연습</p>
            <p className="mt-3 text-[15px] leading-7 text-muted">{guide.practice}</p>
            <h3 className="mt-8 font-serif text-lg">대표 읽을거리와 해설 출처</h3>
            {guide.reading.map((reading) => (
              <div key={reading.url} className="mt-4 rounded-xl border border-foreground/10 p-4">
                <a href={reading.url} className="text-sm font-medium text-primary-readable underline underline-offset-4">{reading.title}</a>
                <p className="mt-3 text-sm leading-6 text-muted">{reading.note}</p>
              </div>
            ))}
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

        <section aria-labelledby="related-guides" className="mb-10 border-t border-foreground/10 pt-7">
          <h2 id="related-guides" className="font-serif text-xl">고민과 연결해서 읽기</h2>
          {relatedTopics.map((topic) => (
            <Link key={topic.slug} href={`/wisdom/${topic.slug}`} className="mt-4 block rounded-xl border border-foreground/10 p-4 transition-colors hover:bg-primary/5">
              <h3 className="font-serif text-lg">{topic.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{topic.philosophers.find((item) => item.slug === slug)?.idea}</p>
            </Link>
          ))}
          <Link href="/wisdom" className="mt-4 inline-block py-2 text-sm text-primary-readable underline underline-offset-4">고민별 철학 가이드 전체 보기</Link>
        </section>

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
