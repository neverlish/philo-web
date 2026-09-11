import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { WISDOM_TOPICS, WISDOM_TOPIC_LIST } from '@/lib/wisdom-topics'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://philo-web.vercel.app'

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return WISDOM_TOPIC_LIST.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const topic = WISDOM_TOPICS[slug]
  if (!topic) return {}

  const path = `/wisdom/${topic.slug}`
  return {
    title: topic.title,
    description: topic.description,
    alternates: { canonical: path },
    openGraph: {
      type: 'article',
      title: topic.title,
      description: topic.description,
      url: path,
    },
  }
}

export default async function WisdomTopicPage({ params }: Props) {
  const { slug } = await params
  const topic = WISDOM_TOPICS[slug]
  if (!topic) notFound()

  const pageUrl = `${siteUrl}/wisdom/${topic.slug}`
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: topic.title,
      description: topic.description,
      mainEntityOfPage: pageUrl,
      author: { '@type': 'Organization', name: '오늘의철학', url: siteUrl },
      publisher: { '@type': 'Organization', name: '오늘의철학', url: siteUrl },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: '오늘의철학', item: siteUrl },
        { '@type': 'ListItem', position: 2, name: '고민별 철학', item: `${siteUrl}/wisdom` },
        { '@type': 'ListItem', position: 3, name: topic.shortTitle, item: pageUrl },
      ],
    },
  ]

  const otherTopics = WISDOM_TOPIC_LIST.filter((item) => item.slug !== topic.slug)

  return (
    <div className="min-h-dvh bg-[#F4F0E8] text-[#29231F]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }}
      />

      <main className="mx-auto max-w-3xl px-5 pb-24 pt-6 sm:px-10 sm:pt-10">
        <nav aria-label="현재 위치" className="flex items-center gap-2 text-xs text-[#766D65]">
          <Link href="/wisdom" className="inline-flex items-center gap-2 transition-colors hover:text-[#29231F]">
            <ArrowLeft className="h-4 w-4" strokeWidth={1.4} />
            고민별 철학
          </Link>
          <span aria-hidden>/</span>
          <span>{topic.shortTitle}</span>
        </nav>

        <article>
          <header className="relative border-b border-[#29231F]/15 pb-12 pt-16 sm:pb-16 sm:pt-24">
            <span className="absolute right-0 top-10 select-none font-serif text-[8rem] leading-none opacity-[0.06] sm:text-[12rem]" aria-hidden>{topic.symbol}</span>
            <p className="mb-5 text-[10px] font-semibold tracking-[0.28em]" style={{ color: topic.accent }}>{topic.eyebrow}</p>
            <h1 className="relative max-w-2xl font-serif text-5xl font-medium leading-[1.1] tracking-[-0.035em] sm:text-7xl">{topic.title}</h1>
            <p className="relative mt-8 max-w-xl font-serif text-lg leading-8 text-[#5F574F] sm:text-xl sm:leading-9">{topic.lead}</p>
          </header>

          <div className="py-4 sm:py-8">
            {topic.sections.map((section, index) => (
              <section key={section.title} className="grid gap-5 border-b border-[#29231F]/10 py-10 sm:grid-cols-[3rem_1fr] sm:gap-8 sm:py-14">
                <span className="font-mono text-xs text-[#9B9188]">0{index + 1}</span>
                <div>
                  <h2 className="font-serif text-2xl leading-snug sm:text-3xl">{section.title}</h2>
                  <div className="mt-6 space-y-5 text-[15px] leading-7 text-[#554E48] sm:text-base sm:leading-8">
                    {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  </div>
                </div>
              </section>
            ))}
          </div>

          <section className="my-10 rounded-[2rem] bg-[#29231F] px-6 py-9 text-[#F4F0E8] sm:px-10 sm:py-12">
            <p className="text-[10px] font-semibold tracking-[0.26em] text-[#D6A46F]">TODAY&apos;S PRACTICE</p>
            <h2 className="mt-4 font-serif text-3xl">오늘 해볼 세 가지</h2>
            <ol className="mt-8 divide-y divide-white/15">
              {topic.practices.map((practice, index) => (
                <li key={practice.title} className="grid grid-cols-[2rem_1fr] gap-3 py-5 first:pt-0 last:pb-0">
                  <span className="font-mono text-xs text-white/40">{index + 1}</span>
                  <div>
                    <h3 className="font-serif text-lg">{practice.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/60">{practice.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {topic.sources && (
            <section className="mb-10 text-sm leading-7 text-[#554E48]">
              <h2 className="font-serif text-xl text-[#29231F]">해설 출처와 읽을거리</h2>
              <p className="mt-3">철학적 해설과 오늘의철학이 제안하는 일상 연습입니다. 직접 인용이나 치료 안내가 아닙니다.</p>
              <ul className="mt-3 space-y-2">
                {topic.sources.map((source) => <li key={source.url}><a href={source.url} className="underline underline-offset-4">{source.title}</a></li>)}
              </ul>
            </section>
          )}
          <Link href="/practice/control" className="mb-10 block border-l-2 border-[#9A5B38] py-3 pl-5">
            <span className="text-xs text-[#766D65]">로그인 없이 해보는 철학 연습</span>
            <p className="mt-2 font-serif text-xl">지금 내가 선택할 수 있는 것 나누기 →</p>
          </Link>
          <section className="border-y border-[#29231F]/15 py-12">
            <p className="text-[10px] font-semibold tracking-[0.24em]" style={{ color: topic.accent }}>RELATED THINKERS</p>
            <h2 className="mt-3 font-serif text-3xl">더 깊이 읽기</h2>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {topic.philosophers.map((philosopher) => (
                <Link key={philosopher.slug} href={`/philosopher/${philosopher.slug}`} className="group flex min-h-40 flex-col justify-between rounded-2xl border border-[#29231F]/15 bg-white/25 p-5 transition-colors hover:bg-white/60">
                  <p className="font-serif text-xl">{philosopher.name}</p>
                  <div className="mt-5">
                    <p className="text-xs leading-5 text-[#766D65]">{philosopher.idea}</p>
                    <ArrowRight className="mt-4 h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={1.4} />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </article>

        <aside className="pt-14">
          <p className="text-[10px] font-semibold tracking-[0.24em] text-[#8A8179]">CONTINUE READING</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {otherTopics.map((item) => (
              <Link key={item.slug} href={`/wisdom/${item.slug}`} className="rounded-full border border-[#29231F]/15 px-4 py-2 text-sm transition-colors hover:bg-[#29231F] hover:text-[#F4F0E8]">{item.shortTitle}</Link>
            ))}
          </div>
        </aside>
      </main>
    </div>
  )
}
