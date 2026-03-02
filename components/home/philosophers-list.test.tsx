import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PhilosophersList } from './philosophers-list'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('PhilosophersList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading skeleton initially', () => {
    mockFetch.mockImplementation(() => new Promise(() => {})) // Never resolves

    render(<PhilosophersList />)

    // Check for skeleton elements (animated pulse backgrounds)
    const skeletons = document.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('renders philosophers after successful fetch', async () => {
    const mockPhilosophers = [
      {
        id: '1',
        name: '마르쿠스 아우렐리우스',
        name_en: 'Marcus Aurelius',
        era: '로마 제국',
        region: '로마',
        core_idea: '스토아 철학',
        keywords: [' stoicism ', 'wisdom'],
      },
      {
        id: '2',
        name: '노자',
        name_en: 'Lao Tzu',
        era: '춘추시대',
        region: '중국',
        core_idea: '도가 사상',
        keywords: ['taoism', 'nature'],
      },
    ]

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ philosophers: mockPhilosophers }),
    })

    render(<PhilosophersList />)

    await waitFor(() => {
      expect(screen.getByText('마르쿠스 아우렐리우스')).toBeInTheDocument()
      expect(screen.getByText('노자')).toBeInTheDocument()
    })
  })

  it('shows error message on fetch failure', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    render(<PhilosophersList />)

    await waitFor(() => {
      expect(screen.getByText('데이터를 불러오는데 실패했습니다')).toBeInTheDocument()
    })
  })

  it('shows empty state when no philosophers', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ philosophers: [] }),
    })

    render(<PhilosophersList />)

    await waitFor(() => {
      expect(screen.getByText('철학자 데이터가 없습니다')).toBeInTheDocument()
    })
  })
})
