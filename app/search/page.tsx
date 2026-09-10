import type { Metadata } from 'next'
import { SearchPage } from '@/components/search/search-page'
import { getCachedPhilosophers } from '@/lib/cache/philosophers'
import { WISDOM_TOPIC_LIST } from '@/lib/wisdom-topics'

export const metadata: Metadata = {
  title: '철학 검색',
  description: '고민과 키워드로 철학자와 철학 가이드를 찾아보세요.',
  robots: { index: false, follow: true },
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>
}) {
  const [{ q }, philosophers] = await Promise.all([
    searchParams,
    getCachedPhilosophers(),
  ])

  return (
    <SearchPage
      philosophers={philosophers}
      topics={WISDOM_TOPIC_LIST}
      initialQuery={typeof q === 'string' ? q.slice(0, 100) : ''}
    />
  )
}
