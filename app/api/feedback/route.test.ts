import { describe, it, expect, vi, beforeEach } from 'vitest'

process.env.DISCORD_FEEDBACK_WEBHOOK_URL = 'https://discord.example.com/webhook'

const mockInsert = vi.fn()

vi.mock('@/lib/supabase/server-auth', () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: { session: { user: { id: 'user-123', email: 'user@example.com' } } },
      }),
    },
    from: vi.fn().mockReturnValue({
      insert: mockInsert,
    }),
  }),
}))

const mockFetch = vi.fn().mockResolvedValue(new Response('ok'))
vi.stubGlobal('fetch', mockFetch)

describe('POST /api/feedback', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockInsert.mockResolvedValue({ error: null })
    mockFetch.mockResolvedValue(new Response('ok'))
  })

  it('message 없으면 400을 반환한다', async () => {
    const { POST } = await import('./route')
    const response = await POST(
      new Request('http://localhost/api/feedback', {
        method: 'POST',
        body: JSON.stringify({}),
      })
    )
    expect(response.status).toBe(400)
  })

  it('빈 message면 400을 반환한다', async () => {
    const { POST } = await import('./route')
    const response = await POST(
      new Request('http://localhost/api/feedback', {
        method: 'POST',
        body: JSON.stringify({ message: '   ' }),
      })
    )
    expect(response.status).toBe(400)
  })

  it('1000자 초과 message면 400을 반환한다', async () => {
    const { POST } = await import('./route')
    const response = await POST(
      new Request('http://localhost/api/feedback', {
        method: 'POST',
        body: JSON.stringify({ message: 'a'.repeat(1001) }),
      })
    )
    expect(response.status).toBe(400)
  })

  it('정상 요청 시 ok:true를 반환한다', async () => {
    const { POST } = await import('./route')
    const response = await POST(
      new Request('http://localhost/api/feedback', {
        method: 'POST',
        body: JSON.stringify({ message: '앱이 정말 좋아요!' }),
      })
    )
    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body).toEqual({ ok: true })
  })

  it('Discord 웹훅도 호출한다', async () => {
    const { POST } = await import('./route')
    await POST(
      new Request('http://localhost/api/feedback', {
        method: 'POST',
        body: JSON.stringify({ message: '피드백 내용' }),
      })
    )
    // supabase insert + discord webhook = 2번 fetch 호출 (fetch는 global mock)
    // discord webhook 호출 확인
    const discordCall = mockFetch.mock.calls.find(([url]) =>
      url === 'https://discord.example.com/webhook'
    )
    expect(discordCall).toBeDefined()
  })

  it('DB 저장 실패 시 500을 반환한다', async () => {
    mockInsert.mockResolvedValueOnce({ error: { message: 'DB error' } })

    const { POST } = await import('./route')
    const response = await POST(
      new Request('http://localhost/api/feedback', {
        method: 'POST',
        body: JSON.stringify({ message: '피드백' }),
      })
    )
    expect(response.status).toBe(500)
  })

  it('비로그인 사용자도 피드백을 제출할 수 있다', async () => {
    const { createClient } = await import('@/lib/supabase/server-auth')
    vi.mocked(createClient).mockResolvedValueOnce({
      auth: {
        getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      },
      from: vi.fn().mockReturnValue({ insert: mockInsert }),
    } as any)

    const { POST } = await import('./route')
    const response = await POST(
      new Request('http://localhost/api/feedback', {
        method: 'POST',
        body: JSON.stringify({ message: '비로그인 피드백', email: 'anon@example.com' }),
      })
    )
    expect(response.status).toBe(200)
  })
})
