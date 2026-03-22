import { describe, it, expect, vi, beforeEach } from 'vitest'
import { makeRequest } from '@/tests/helpers/request'
import { makeSupabaseMock } from '@/tests/helpers/supabase'

vi.mock('@/lib/supabase/server-auth', () => ({
  createClient: vi.fn(),
}))

async function getRoute() {
  return import('./route')
}

describe('POST /api/prescriptions/[id]/reflection', () => {
  const PARAMS = { params: Promise.resolve({ id: 'prescription-abc' }) }

  beforeEach(() => vi.resetModules())

  it('returns 401 if not authenticated', async () => {
    const { createClient } = await import('@/lib/supabase/server-auth')
    vi.mocked(createClient).mockResolvedValueOnce(
      makeSupabaseMock({ session: null }) as any
    )
    const { POST } = await getRoute()
    const res = await POST(
      makeRequest('POST', '/api/prescriptions/abc/reflection', {
        body: JSON.stringify({ reflection: '깨달음이 있었습니다' }),
      }),
      PARAMS
    )
    expect(res.status).toBe(401)
  })

  it('returns 400 if reflection is missing', async () => {
    const { createClient } = await import('@/lib/supabase/server-auth')
    vi.mocked(createClient).mockResolvedValueOnce(makeSupabaseMock() as any)
    const { POST } = await getRoute()
    const res = await POST(
      makeRequest('POST', '/api/prescriptions/abc/reflection', {
        body: JSON.stringify({}),
      }),
      PARAMS
    )
    expect(res.status).toBe(400)
  })

  it('returns 400 if reflection is empty string', async () => {
    const { createClient } = await import('@/lib/supabase/server-auth')
    vi.mocked(createClient).mockResolvedValueOnce(makeSupabaseMock() as any)
    const { POST } = await getRoute()
    const res = await POST(
      makeRequest('POST', '/api/prescriptions/abc/reflection', {
        body: JSON.stringify({ reflection: '   ' }),
      }),
      PARAMS
    )
    expect(res.status).toBe(400)
  })

  it('returns 404 if prescription not owned by user', async () => {
    const { createClient } = await import('@/lib/supabase/server-auth')
    const mock = makeSupabaseMock()
    mock.from.mockReturnValueOnce({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    })
    vi.mocked(createClient).mockResolvedValueOnce(mock as any)
    const { POST } = await getRoute()
    const res = await POST(
      makeRequest('POST', '/api/prescriptions/abc/reflection', {
        body: JSON.stringify({ reflection: '깨달음이 있었습니다' }),
      }),
      PARAMS
    )
    expect(res.status).toBe(404)
  })

  it('returns 200 on success', async () => {
    const { createClient } = await import('@/lib/supabase/server-auth')
    const mock = makeSupabaseMock()
    mock.from
      .mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: { id: 'prescription-abc' }, error: null }),
      })
      .mockReturnValueOnce({
        insert: vi.fn().mockResolvedValue({ error: null }),
      })
    vi.mocked(createClient).mockResolvedValueOnce(mock as any)
    const { POST } = await getRoute()
    const res = await POST(
      makeRequest('POST', '/api/prescriptions/abc/reflection', {
        body: JSON.stringify({ reflection: '깨달음이 있었습니다' }),
      }),
      PARAMS
    )
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true })
  })

  it('returns 500 if DB insert fails', async () => {
    const { createClient } = await import('@/lib/supabase/server-auth')
    const mock = makeSupabaseMock()
    mock.from
      .mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: { id: 'prescription-abc' }, error: null }),
      })
      .mockReturnValueOnce({
        insert: vi.fn().mockResolvedValue({ error: { message: 'DB error' } }),
      })
    vi.mocked(createClient).mockResolvedValueOnce(mock as any)
    const { POST } = await getRoute()
    const res = await POST(
      makeRequest('POST', '/api/prescriptions/abc/reflection', {
        body: JSON.stringify({ reflection: '깨달음이 있었습니다' }),
      }),
      PARAMS
    )
    expect(res.status).toBe(500)
  })
})
