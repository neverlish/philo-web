import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockInsert = vi.fn()
const mockDeleteEq2 = vi.fn()
const mockDeleteEq1 = vi.fn(() => ({ eq: mockDeleteEq2 }))
const mockDelete = vi.fn(() => ({ eq: mockDeleteEq1 }))
const mockFrom = vi.fn(() => ({
  insert: mockInsert,
  delete: mockDelete,
}))

vi.mock('@/lib/supabase/server-auth', () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: { session: { user: { id: 'user-123' } } },
      }),
    },
    from: mockFrom,
  }),
}))

describe('POST /api/prescriptions/[id]/save', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should return 401 if not authenticated', async () => {
    const { createClient } = await import('@/lib/supabase/server-auth')
    vi.mocked(createClient).mockResolvedValueOnce({
      auth: {
        getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      },
    } as any)

    const { POST } = await import('./route')
    const request = new Request('http://localhost/api/prescriptions/abc/save', { method: 'POST' })
    const response = await POST(request, { params: Promise.resolve({ id: 'abc' }) })
    expect(response.status).toBe(401)
  })

  it('should return 200 on successful save', async () => {
    mockInsert.mockResolvedValueOnce({ error: null })

    const { POST } = await import('./route')
    const request = new Request('http://localhost/api/prescriptions/abc/save', { method: 'POST' })
    const response = await POST(request, { params: Promise.resolve({ id: 'abc' }) })
    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body).toEqual({ saved: true })
  })

  it('should return 409 if already saved', async () => {
    mockInsert.mockResolvedValueOnce({
      error: { code: '23505', message: 'unique constraint violation' },
    })

    const { POST } = await import('./route')
    const request = new Request('http://localhost/api/prescriptions/abc/save', { method: 'POST' })
    const response = await POST(request, { params: Promise.resolve({ id: 'abc' }) })
    expect(response.status).toBe(409)
  })
})

describe('DELETE /api/prescriptions/[id]/save', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should return 401 if not authenticated', async () => {
    const { createClient } = await import('@/lib/supabase/server-auth')
    vi.mocked(createClient).mockResolvedValueOnce({
      auth: {
        getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      },
    } as any)

    const { DELETE } = await import('./route')
    const request = new Request('http://localhost/api/prescriptions/abc/save', { method: 'DELETE' })
    const response = await DELETE(request, { params: Promise.resolve({ id: 'abc' }) })
    expect(response.status).toBe(401)
  })

  it('should return 200 on successful delete', async () => {
    mockDeleteEq2.mockResolvedValueOnce({ error: null })

    const { DELETE } = await import('./route')
    const request = new Request('http://localhost/api/prescriptions/abc/save', { method: 'DELETE' })
    const response = await DELETE(request, { params: Promise.resolve({ id: 'abc' }) })
    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body).toEqual({ saved: false })
  })
})
