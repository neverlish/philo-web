import { describe, it, expect, vi, beforeEach } from 'vitest'
import { makeRequest } from '@/tests/helpers/request'
import { makeSupabaseMock } from '@/tests/helpers/supabase'

vi.mock('@/lib/supabase/server-auth', () => ({
  createClient: vi.fn(),
}))

const MOCK_POSTS = [
  {
    id: 'post-1',
    content: '오늘도 철학적인 하루',
    philosopher_name: '소크라테스',
    author_name: '익명의 철학자',
    likes_count: 3,
    created_at: '2026-03-22T00:00:00Z',
  },
]

async function getRoute() {
  return import('./route')
}

describe('GET /api/collective', () => {
  beforeEach(() => vi.resetModules())

  it('returns posts with isLiked:false when not authenticated', async () => {
    const { createClient } = await import('@/lib/supabase/server-auth')
    const mock = makeSupabaseMock({ session: null })
    mock.from.mockReturnValueOnce({
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      range: vi.fn().mockResolvedValue({ data: MOCK_POSTS, error: null }),
    })
    vi.mocked(createClient).mockResolvedValueOnce(mock as any)
    const { GET } = await getRoute()
    const res = await GET(makeRequest('GET', '/api/collective?offset=0'))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.posts).toHaveLength(1)
    expect(body.posts[0].isLiked).toBe(false)
  })

  it('returns 500 if DB fails', async () => {
    const { createClient } = await import('@/lib/supabase/server-auth')
    const mock = makeSupabaseMock({ session: null })
    mock.from.mockReturnValueOnce({
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      range: vi.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } }),
    })
    vi.mocked(createClient).mockResolvedValueOnce(mock as any)
    const { GET } = await getRoute()
    const res = await GET(makeRequest('GET', '/api/collective'))
    expect(res.status).toBe(500)
  })
})

describe('POST /api/collective', () => {
  beforeEach(() => vi.resetModules())

  it('returns 401 if not authenticated', async () => {
    const { createClient } = await import('@/lib/supabase/server-auth')
    vi.mocked(createClient).mockResolvedValueOnce(
      makeSupabaseMock({ session: null }) as any
    )
    const { POST } = await getRoute()
    const res = await POST(
      makeRequest('POST', '/api/collective', {
        body: JSON.stringify({ content: '오늘의 생각' }),
      })
    )
    expect(res.status).toBe(401)
  })

  it('returns 400 if content is missing', async () => {
    const { createClient } = await import('@/lib/supabase/server-auth')
    vi.mocked(createClient).mockResolvedValueOnce(makeSupabaseMock() as any)
    const { POST } = await getRoute()
    const res = await POST(
      makeRequest('POST', '/api/collective', { body: JSON.stringify({}) })
    )
    expect(res.status).toBe(400)
  })

  it('returns 400 if content exceeds 500 chars', async () => {
    const { createClient } = await import('@/lib/supabase/server-auth')
    vi.mocked(createClient).mockResolvedValueOnce(makeSupabaseMock() as any)
    const { POST } = await getRoute()
    const res = await POST(
      makeRequest('POST', '/api/collective', {
        body: JSON.stringify({ content: 'a'.repeat(501) }),
      })
    )
    expect(res.status).toBe(400)
  })

  it('returns 201 with postId on success', async () => {
    const { createClient } = await import('@/lib/supabase/server-auth')
    const mock = makeSupabaseMock()
    mock.from.mockReturnValueOnce({
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { id: 'new-post-id' }, error: null }),
    })
    vi.mocked(createClient).mockResolvedValueOnce(mock as any)
    const { POST } = await getRoute()
    const res = await POST(
      makeRequest('POST', '/api/collective', {
        body: JSON.stringify({ content: '오늘의 철학적 생각' }),
      })
    )
    expect(res.status).toBe(201)
    expect(await res.json()).toEqual({ postId: 'new-post-id' })
  })
})
