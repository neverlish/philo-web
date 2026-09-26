import type { Metadata } from 'next'
import Link from 'next/link'
import content from '@/lib/explorer/content.json'
import { EXPLORER_PAGES, type ExplorerSlug } from '@/lib/explorer/pages'
import { Experience } from './experience'
import { ContinueExploring } from './continue-exploring'
import { VisualNotebook } from './visual-notebook'
import { RelationshipPlate } from './relationship-plate'
import { ComparisonSheet } from './comparison-sheet'
import { SearchIntroduction, SearchQuestions } from './search-introduction'
import { PAGE_VISUALS, visualPath, EXPLORER_UPDATED_AT } from '@/lib/explorer/visual-assets'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://philo-web.vercel.app'
export function explorerMetadata(slug: ExplorerSlug): Metadata {
  const page = EXPLORER_PAGES[slug]
  const image = visualPath(PAGE_VISUALS[slug][0])
  return {
    title: page.title, description: page.description,
    alternates: { canonical: page.path },
    openGraph: { title: page.title, description: page.description, url: page.path, images: [{ url: image, alt: '철학의 질문을 시각적으로 해석한 AI 생성 작품' }] },
    twitter: { card: 'summary_large_image', title: page.title, description: page.description, images: [image] },
  }
}

export function ExplorerPage({ slug }: { slug: ExplorerSlug }) {
  const page = EXPLORER_PAGES[slug]
  const data = content[slug]
  const breadcrumbs = [{ '@type': 'ListItem', position: 1, name: '오늘의철학', item: siteUrl }, { '@type': 'ListItem', position: 2, name: '철학자의 방', item: `${siteUrl}/explore` }]
  if (slug !== 'index') breadcrumbs.push({ '@type': 'ListItem', position: 3, name: page.title, item: `${siteUrl}${page.path}` })
  const structured = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'WebPage', name: page.title, description: page.description, url: `${siteUrl}${page.path}`, inLanguage: 'ko-KR', isAccessibleForFree: true, dateModified: EXPLORER_UPDATED_AT, image: PAGE_VISUALS[slug].map(id => `${siteUrl}${visualPath(id)}`) },
    { '@type': 'BreadcrumbList', itemListElement: breadcrumbs },
  ] }
  return <>
    <style dangerouslySetInnerHTML={{ __html: data.css }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structured).replace(/</g, '\\u003c') }} />
    <SearchIntroduction slug={slug} />
    <Experience key={slug} slug={slug} html={data.html} />
    {slug === 'map' && <RelationshipPlate />}
    {slug === 'compare' && <ComparisonSheet />}
    <VisualNotebook slug={slug} />
    {(slug === 'index' || slug === 'aristotle') && <aside className="bg-[#f2f0e9] px-6 py-12 text-[#29372f]">
      <div className="mx-auto max-w-3xl border-y border-[#35463d]/20 py-8">
        <p className="text-xs tracking-widest">그림 밖, 내 생활로</p>
        <h2 className="mt-3 font-serif text-2xl">친구에게 화가 난 날</h2>
        <p className="mt-4 text-sm leading-8">처음의 생각과 다른 사정을 살펴본 뒤의 생각을 나란히 놓아보세요. 오늘 해볼 작은 실험도 하나 골라볼 수 있어요.</p>
        <Link href="/practice/friendship" className="mt-4 inline-flex min-h-11 items-center underline underline-offset-4">내 상황으로 철학 연습하기 →</Link>
      </div>
    </aside>}
    <section id="explorer-reading" className="bg-[#e7e9e2] px-6 py-14 text-[#29372f]">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs tracking-widest">오늘의철학 · 로그인 없는 철학 입문</p>
        <h2 className="mb-6 mt-4 font-serif text-3xl leading-relaxed">{page.title}</h2>
        {page.paragraphs.map(text => <p key={text} className="my-4 text-sm leading-8">{text}</p>)}
        <SearchQuestions slug={slug} />
        <p className="mt-6 text-xs leading-6">서비스 개선을 위해 장면 이동·해설 열기 등의 사용 이벤트를 수집합니다. 선택한 답변 내용은 수집하지 않습니다. 체험에는 AI 호출이나 계정 저장이 없으며 새로고침하면 초기화됩니다.</p>
        <ContinueExploring slug={slug} />
      </div>
    </section>
  </>
}
