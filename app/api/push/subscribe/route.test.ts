import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockInsert = vi.fn()
const mockDelete = vi.fn()
const mockGetSession = vi.fn()

vi.mock('@/lib/supabase/server-auth', () => ({
  createClient: vi.fn(() => ({
    auth: { getSession: mockGetSession },
    from: () => ({
      insert: mockInsert,
      delete: () => ({ eq: () => ({ eq: mockDelete }) }),
    }),
  })),
}))

describe('POST /api/push/subscribe', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetSession.mockResolvedValue({ data: { session: { user: { id: 'user-1' } } } })
  })

  it('401 if not logged in', async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } })
    const { POST } = await import('./route')
    const req = new Request('http://localhost/api/push/subscribe', {
      method: 'POST',
      body: JSON.stringify({ endpoint: 'https://e.com', p256dh: 'k', auth: 'a' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(401)
  })

  it('200 on valid subscription', async () => {
    mockInsert.mockResolvedValue({ error: null })
    const { POST } = await import('./route')
    const req = new Request('http://localhost/api/push/subscribe', {
      method: 'POST',
      body: JSON.stringify({ endpoint: 'https://e.com', p256dh: 'key', auth: 'auth' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
  })

  it('400 if required fields missing', async () => {
    const { POST } = await import('./route')
    const req = new Request('http://localhost/api/push/subscribe', {
      method: 'POST',
      body: JSON.stringify({ endpoint: 'https://e.com' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })
})

describe('DELETE /api/push/subscribe', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetSession.mockResolvedValue({ data: { session: { user: { id: 'user-1' } } } })
  })

  it('200 on unsubscribe', async () => {
    mockDelete.mockResolvedValue({ error: null })
    const { DELETE } = await import('./route')
    const req = new Request('http://localhost/api/push/subscribe', {
      method: 'DELETE',
      body: JSON.stringify({ endpoint: 'https://e.com' }),
    })
    const res = await DELETE(req)
    expect(res.status).toBe(200)
  })
})
