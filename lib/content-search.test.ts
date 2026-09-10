import { describe, expect, it } from 'vitest'
import { WISDOM_TOPIC_LIST } from '@/lib/wisdom-topics'
import { searchContent, type SearchablePhilosopher } from '@/lib/content-search'

const philosophers: SearchablePhilosopher[] = [
  {
    id: '1',
    name: '프리드리히 니체',
    nameEn: 'Friedrich Nietzsche',
    era: '근대',
    region: '서양',
    years: '1844–1900',
    keywords: ['의지', '가치'],
    coreIdea: '자신의 삶을 긍정하라',
  },
  {
    id: '2',
    name: '에픽테토스',
    nameEn: 'Epictetus',
    era: '고대',
    region: '서양',
    years: '50–135',
    keywords: ['통제', '수용'],
    coreIdea: '통제할 수 있는 것에 집중하라',
  },
]

describe('searchContent', () => {
  it('finds a philosopher by Korean and English names', () => {
    expect(searchContent('니체', philosophers, []).philosophers[0]?.id).toBe('1')
    expect(searchContent('NIETZSCHE', philosophers, []).philosophers[0]?.id).toBe('1')
  })

  it('finds philosophers by ideas and keywords', () => {
    expect(searchContent('통제', philosophers, []).philosophers[0]?.id).toBe('2')
  })

  it('searches the full editorial guide content', () => {
    expect(searchContent('걱정', [], WISDOM_TOPIC_LIST).topics[0]?.slug).toBe('anxiety')
    expect(searchContent('사랑', [], WISDOM_TOPIC_LIST).topics[0]?.slug).toBe('relationships')
  })

  it('requires every word in a multi-word query to match', () => {
    expect(searchContent('서양 통제', philosophers, []).philosophers.map((item) => item.id)).toEqual(['2'])
    expect(searchContent('동양 통제', philosophers, []).philosophers).toEqual([])
  })

  it('returns empty groups for a blank query', () => {
    expect(searchContent('   ', philosophers, WISDOM_TOPIC_LIST)).toEqual({ philosophers: [], topics: [] })
  })
})
