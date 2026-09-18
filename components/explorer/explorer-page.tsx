import type { Metadata } from 'next'
import content from '@/lib/explorer/content.json'
import { EXPLORER_PAGES, type ExplorerSlug } from '@/lib/explorer/pages'
import { Experience } from './experience'
import { ContinueExploring } from './continue-exploring'
import { VisualNotebook } from './visual-notebook'
import { RelationshipPlate } from './relationship-plate'
import { ComparisonSheet } from './comparison-sheet'
import { PAGE_VISUALS, visualPath, EXPLORER_UPDATED_AT } from '@/lib/explorer/visual-assets'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://philo-web.vercel.app'
export function explorerMetadata(slug: ExplorerSlug): Metadata {
  const page = EXPLORER_PAGES[slug]
  const image = visualPath(PAGE_VISUALS[slug][0])
  return {
    title: page.title, description: page.description,
    alternates: { canonical: page.path },
    openGraph: { title: page.title, description: page.description, url: page.path, images: [{ url: image, alt: 'AI로 재구성한 철학자의 역사적 상상화' }] },
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
    <Experience key={slug} slug={slug} html={data.html} />
    {slug === 'map' && <RelationshipPlate />}
    {slug === 'compare' && <ComparisonSheet />}
    <VisualNotebook slug={slug} />
    <section id="explorer-reading" className="bg-[#eee4cd] px-6 py-14 text-[#322819]">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs tracking-widest">오늘의철학 · 로그인 없는 철학 입문</p>
        <h2 className="mb-6 mt-4 font-serif text-3xl leading-relaxed">{page.title}</h2>
        {page.paragraphs.map(text => <p key={text} className="my-4 text-sm leading-8">{text}</p>)}
        <p className="mt-6 text-xs leading-6">서비스 개선을 위해 장면 이동·해설 열기 등의 사용 이벤트를 수집합니다. 선택한 답변 내용은 수집하지 않습니다. 체험에는 AI 호출이나 계정 저장이 없으며 새로고침하면 초기화됩니다.</p>
        <ContinueExploring slug={slug} />
      </div>
    </section>
  </>
}
