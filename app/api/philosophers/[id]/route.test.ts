import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockSingle = vi.fn()
const mockQuotesResolve = vi.fn()

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn((table: string) => {
      if (table === 'philosophers') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: mockSingle,
            }),
          }),
        }
      }
      // quotes table
      return {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockImplementation(() => mockQuotesResolve()),
          }),
        }),
      }
    }),
  },
}))

const MOCK_PHILOSOPHER = {
  id: 'philo-1',
  name: '마르쿠스 아우렐리우스',
  school: '스토아 학파',
  era: '고대 121-180',
}

const MOCK_QUOTES = [
  { id: 'q-1', philosopher_id: 'philo-1', text: '명언1', created_at: '2024-01-01' },
]

describe('GET /api/philosophers/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSingle.mockResolvedValue({ data: MOCK_PHILOSOPHER, error: null })
    mockQuotesResolve.mockResolvedValue({ data: MOCK_QUOTES, error: null })
  })

  it('철학자와 명언 목록을 반환한다', async () => {
    const { GET } = await import('./route')
    const response = await GET(new Request('http://localhost'), {
      params: Promise.resolve({ id: 'philo-1' }),
    })
    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body).toHaveProperty('philosopher')
    expect(body).toHaveProperty('quotes')
    expect(body.philosopher).toMatchObject({ id: 'philo-1' })
    expect(body.quotes).toHaveLength(1)
  })

  it('철학자 조회 실패 시 500을 반환한다', async () => {
    mockSingle.mockResolvedValueOnce({ data: null, error: { message: 'Not found' } })

    const { GET } = await import('./route')
    const response = await GET(new Request('http://localhost'), {
      params: Promise.resolve({ id: 'philo-1' }),
    })
    expect(response.status).toBe(500)
  })

  it('명언 조회 실패 시 500을 반환한다', async () => {
    mockQuotesResolve.mockResolvedValueOnce({ data: null, error: { message: 'DB error' } })

    const { GET } = await import('./route')
    const response = await GET(new Request('http://localhost'), {
      params: Promise.resolve({ id: 'philo-1' }),
    })
    expect(response.status).toBe(500)
  })
})
