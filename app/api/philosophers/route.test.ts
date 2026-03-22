import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from './route'

// Mock supabase to return empty data
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => ({
          range: vi.fn(() => Promise.resolve({ data: [], error: null })),
        })),
      })),
    })),
  },
}))

describe('GET /api/philosophers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return 200 status', async () => {
    const request = new Request('http://localhost:3000/api/philosophers')
    const response = await GET(request)

    expect(response.status).toBe(200)
  })

  it('should return JSON response', async () => {
    const request = new Request('http://localhost:3000/api/philosophers')
    const response = await GET(request)

    expect(response.headers.get('content-type')).toContain('application/json')
  })
})
