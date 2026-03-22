import { describe, it, expect, vi, beforeEach } from 'vitest'
import { makeRequest } from '@/tests/helpers/request'
import { makeSupabaseMock } from '@/tests/helpers/supabase'

vi.mock('@/lib/supabase/server-auth', () => ({
  createClient: vi.fn(),
}))

async function getRoute() {
  return import('./route')
}

describe('PATCH /api/prescriptions/[id]/intention', () => {
  const PARAMS = { params: Promise.resolve({ id: 'prescription-abc' }) }

  beforeEach(() => vi.resetModules())

  it('returns 401 if not authenticated', async () => {
    const { createClient } = await import('@/lib/supabase/server-auth')
    vi.mocked(createClient).mockResolvedValueOnce(
      makeSupabaseMock({ session: null }) as any
    )
    const { PATCH } = await getRoute()
    const res = await PATCH(
      makeRequest('PATCH', '/api/prescriptions/abc/intention', {
        body: JSON.stringify({ intention: '오늘 명상을 10분 해보겠다' }),
      }),
      PARAMS
    )
    expect(res.status).toBe(401)
  })

  it('returns 400 if intention is missing', async () => {
    const { createClient } = await import('@/lib/supabase/server-auth')
    vi.mocked(createClient).mockResolvedValueOnce(makeSupabaseMock() as any)
    const { PATCH } = await getRoute()
    const res = await PATCH(
      makeRequest('PATCH', '/api/prescriptions/abc/intention', {
        body: JSON.stringify({}),
      }),
      PARAMS
    )
    expect(res.status).toBe(400)
  })

  it('returns 400 if intention is empty string', async () => {
    const { createClient } = await import('@/lib/supabase/server-auth')
    vi.mocked(createClient).mockResolvedValueOnce(makeSupabaseMock() as any)
    const { PATCH } = await getRoute()
    const res = await PATCH(
      makeRequest('PATCH', '/api/prescriptions/abc/intention', {
        body: JSON.stringify({ intention: '   ' }),
      }),
      PARAMS
    )
    expect(res.status).toBe(400)
  })

  it('returns 200 on success', async () => {
    const { createClient } = await import('@/lib/supabase/server-auth')
    const mock = makeSupabaseMock()
    // update().eq().eq() 체이닝: 마지막 eq()가 { error: null } resolve
    const eq2 = vi.fn().mockResolvedValue({ error: null })
    const eq1 = vi.fn().mockReturnValue({ eq: eq2 })
    const update = vi.fn().mockReturnValue({ eq: eq1 })
    mock.from.mockReturnValueOnce({ update })
    vi.mocked(createClient).mockResolvedValueOnce(mock as any)
    const { PATCH } = await getRoute()
    const res = await PATCH(
      makeRequest('PATCH', '/api/prescriptions/abc/intention', {
        body: JSON.stringify({ intention: '오늘 명상을 10분 해보겠다' }),
      }),
      PARAMS
    )
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true })
  })

  it('returns 500 if DB update fails', async () => {
    const { createClient } = await import('@/lib/supabase/server-auth')
    const mock = makeSupabaseMock()
    const eq2 = vi.fn().mockResolvedValue({ error: { message: 'DB error' } })
    const eq1 = vi.fn().mockReturnValue({ eq: eq2 })
    const update = vi.fn().mockReturnValue({ eq: eq1 })
    mock.from.mockReturnValueOnce({ update })
    vi.mocked(createClient).mockResolvedValueOnce(mock as any)
    const { PATCH } = await getRoute()
    const res = await PATCH(
      makeRequest('PATCH', '/api/prescriptions/abc/intention', {
        body: JSON.stringify({ intention: '오늘 명상을 10분 해보겠다' }),
      }),
      PARAMS
    )
    expect(res.status).toBe(500)
  })
})
