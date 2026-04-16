import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockInsert = vi.fn()
const mockDeleteEq2 = vi.fn()
const mockDeleteEq1 = vi.fn(() => ({ eq: mockDeleteEq2 }))
const mockDelete = vi.fn(() => ({ eq: mockDeleteEq1 }))

vi.mock('@/lib/supabase/server-auth', () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: { session: { user: { id: 'user-123' } } },
      }),
    },
    from: vi.fn().mockReturnValue({
      insert: mockInsert,
      delete: mockDelete,
    }),
  }),
}))

describe('POST /api/collective/[id]/like', () => {
  beforeEach(() => vi.clearAllMocks())

  it('미인증 사용자는 401을 반환한다', async () => {
    const { createClient } = await import('@/lib/supabase/server-auth')
    vi.mocked(createClient).mockResolvedValueOnce({
      auth: {
        getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      },
    } as any)

    const { POST } = await import('./route')
    const response = await POST(new Request('http://localhost'), {
      params: Promise.resolve({ id: 'post-1' }),
    })
    expect(response.status).toBe(401)
  })

  it('좋아요 성공 시 ok:true를 반환한다', async () => {
    mockInsert.mockResolvedValueOnce({ error: null })

    const { POST } = await import('./route')
    const response = await POST(new Request('http://localhost'), {
      params: Promise.resolve({ id: 'post-1' }),
    })
    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body).toEqual({ ok: true })
  })

  it('이미 좋아요한 경우(23505) 200 ok:true를 반환한다', async () => {
    mockInsert.mockResolvedValueOnce({ error: { code: '23505' } })

    const { POST } = await import('./route')
    const response = await POST(new Request('http://localhost'), {
      params: Promise.resolve({ id: 'post-1' }),
    })
    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body).toEqual({ ok: true })
  })

  it('DB 오류 시 500을 반환한다', async () => {
    mockInsert.mockResolvedValueOnce({ error: { code: '99999', message: 'DB error' } })

    const { POST } = await import('./route')
    const response = await POST(new Request('http://localhost'), {
      params: Promise.resolve({ id: 'post-1' }),
    })
    expect(response.status).toBe(500)
  })
})

describe('DELETE /api/collective/[id]/like', () => {
  beforeEach(() => vi.clearAllMocks())

  it('미인증 사용자는 401을 반환한다', async () => {
    const { createClient } = await import('@/lib/supabase/server-auth')
    vi.mocked(createClient).mockResolvedValueOnce({
      auth: {
        getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      },
    } as any)

    const { DELETE } = await import('./route')
    const response = await DELETE(new Request('http://localhost'), {
      params: Promise.resolve({ id: 'post-1' }),
    })
    expect(response.status).toBe(401)
  })

  it('좋아요 취소 성공 시 ok:true를 반환한다', async () => {
    mockDeleteEq2.mockResolvedValueOnce({ error: null })

    const { DELETE } = await import('./route')
    const response = await DELETE(new Request('http://localhost'), {
      params: Promise.resolve({ id: 'post-1' }),
    })
    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body).toEqual({ ok: true })
  })

  it('DB 오류 시 500을 반환한다', async () => {
    mockDeleteEq2.mockResolvedValueOnce({ error: { message: 'DB error' } })

    const { DELETE } = await import('./route')
    const response = await DELETE(new Request('http://localhost'), {
      params: Promise.resolve({ id: 'post-1' }),
    })
    expect(response.status).toBe(500)
  })
})
