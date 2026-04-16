import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockInsert = vi.fn()

vi.mock('@/lib/supabase/server-auth', () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: { session: { user: { id: 'user-123' } } },
      }),
    },
    from: vi.fn().mockReturnValue({
      insert: mockInsert,
    }),
  }),
}))

vi.mock('@/lib/posthog/server', () => ({
  captureServerEvent: vi.fn().mockResolvedValue(undefined),
}))

const VALID_BODY = {
  concern: '인간관계가 힘들어요',
  philosopher: { name: '마르쿠스 아우렐리우스', school: '스토아 학파', era: '고대 121-180' },
  quote: { text: '테스트 명언', meaning: '테스트 해석', application: '테스트 실천' },
  title: '테스트 제목',
  subtitle: '테스트 부제',
}

describe('POST /api/prescription/save-preview', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockInsert.mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({ data: { id: 'prescription-abc' }, error: null }),
      }),
    })
  })

  it('미인증 사용자는 401을 반환한다', async () => {
    const { createClient } = await import('@/lib/supabase/server-auth')
    vi.mocked(createClient).mockResolvedValueOnce({
      auth: {
        getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      },
    } as any)

    const { POST } = await import('./route')
    const request = new Request('http://localhost/api/prescription/save-preview', {
      method: 'POST',
      body: JSON.stringify(VALID_BODY),
    })
    const response = await POST(request)
    expect(response.status).toBe(401)
  })

  it('필수 필드 누락 시 400을 반환한다', async () => {
    const { POST } = await import('./route')
    const request = new Request('http://localhost/api/prescription/save-preview', {
      method: 'POST',
      body: JSON.stringify({ concern: '고민만 있고 나머지 없음' }),
    })
    const response = await POST(request)
    expect(response.status).toBe(400)
  })

  it('정상 요청 시 prescriptionId를 반환한다', async () => {
    const { POST } = await import('./route')
    const request = new Request('http://localhost/api/prescription/save-preview', {
      method: 'POST',
      body: JSON.stringify(VALID_BODY),
    })
    const response = await POST(request)
    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body).toHaveProperty('prescriptionId', 'prescription-abc')
  })

  it('DB 저장 실패 시 500을 반환한다', async () => {
    mockInsert.mockReturnValueOnce({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } }),
      }),
    })

    const { POST } = await import('./route')
    const request = new Request('http://localhost/api/prescription/save-preview', {
      method: 'POST',
      body: JSON.stringify(VALID_BODY),
    })
    const response = await POST(request)
    expect(response.status).toBe(500)
  })

  it('잘못된 JSON body면 400을 반환한다', async () => {
    const { POST } = await import('./route')
    const request = new Request('http://localhost/api/prescription/save-preview', {
      method: 'POST',
      body: 'not-json',
    })
    const response = await POST(request)
    expect(response.status).toBe(400)
  })
})
