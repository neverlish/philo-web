import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PhilosophersList } from './philosophers-list'
import type { DbPhilosopher } from '@/types'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

const DEFAULT_FILTER = { keyword: '', region: '', era: '', concerns: '' }

const MOCK_PHILOSOPHERS: DbPhilosopher[] = [
  {
    id: '1',
    name: '마르쿠스 아우렐리우스',
    name_en: 'Marcus Aurelius',
    era: '고대',
    region: '서양',
    core_idea: '스토아 철학',
    keywords: ['stoicism'],
    created_at: '2026-01-01',
    updated_at: '2026-01-01',
  },
  {
    id: '2',
    name: '노자',
    name_en: 'Lao Tzu',
    era: '고대',
    region: '동양',
    core_idea: '도가 사상',
    keywords: ['taoism'],
    created_at: '2026-01-01',
    updated_at: '2026-01-01',
  },
]

describe('PhilosophersList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ philosophers: [] }),
    }))
  })

  it('shows loading skeleton when initialPhilosophers is empty and fetch is pending', () => {
    vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {})))

    render(
      <PhilosophersList
        initialPhilosophers={[]}
        initialHasMore={false}
        filter={DEFAULT_FILTER}
      />
    )

    const skeletons = document.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('renders philosophers from initialPhilosophers', () => {
    render(
      <PhilosophersList
        initialPhilosophers={MOCK_PHILOSOPHERS}
        initialHasMore={false}
        filter={DEFAULT_FILTER}
      />
    )

    expect(screen.getByText(/마르쿠스 아우렐리우스/)).toBeInTheDocument()
    expect(screen.getByText(/노자/)).toBeInTheDocument()
  })

  it('shows empty state when initialPhilosophers is empty and fetch returns empty', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ philosophers: [] }),
    }))

    render(
      <PhilosophersList
        initialPhilosophers={[]}
        initialHasMore={false}
        filter={DEFAULT_FILTER}
      />
    )

    await screen.findByText('해당하는 철학자가 없습니다')
  })

  it('renders core_idea as description in PhilosopherCard', () => {
    render(
      <PhilosophersList
        initialPhilosophers={MOCK_PHILOSOPHERS}
        initialHasMore={false}
        filter={DEFAULT_FILTER}
      />
    )

    expect(screen.getByText('스토아 철학')).toBeInTheDocument()
  })
})
