import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockSingle = vi.fn()

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: mockSingle,
        }),
      }),
    }),
  },
}))

const MOCK_QUOTE = {
  id: 'q-1',
  philosopher_id: 'philo-1',
  text: '나를 죽이지 못하는 것은 나를 더 강하게 만든다.',
  philosophers: { name: '니체', school: '근대', era: '1844-1900' },
}

describe('GET /api/quotes/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSingle.mockResolvedValue({ data: MOCK_QUOTE, error: null })
  })

  it('명언 데이터를 반환한다', async () => {
    const { GET } = await import('./route')
    const response = await GET(new Request('http://localhost'), {
      params: Promise.resolve({ id: 'q-1' }),
    })
    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body).toHaveProperty('quote')
    expect(body.quote).toMatchObject({ id: 'q-1' })
  })

  it('조회 실패 시 500을 반환한다', async () => {
    mockSingle.mockResolvedValueOnce({ data: null, error: { message: 'Not found' } })

    const { GET } = await import('./route')
    const response = await GET(new Request('http://localhost'), {
      params: Promise.resolve({ id: 'q-1' }),
    })
    expect(response.status).toBe(500)
  })
})
