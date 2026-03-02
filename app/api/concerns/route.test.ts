import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, POST } from './route'

// Mock supabase
const mockInsertSelect = vi.fn(() => Promise.resolve({
  data: { id: '1', text: 'test', category: 'test' },
  error: null
}))

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => Promise.resolve({ data: [], error: null })),
      })),
      insert: vi.fn(() => ({
        select: mockInsertSelect,
      })),
    })),
  },
}))

describe('GET /api/concerns', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return 200 status', async () => {
    const request = new Request('http://localhost:3000/api/concerns')
    const response = await GET(request)

    expect(response.status).toBe(200)
  })

  it('should return JSON response', async () => {
    const request = new Request('http://localhost:3000/api/concerns')
    const response = await GET(request)

    expect(response.headers.get('content-type')).toContain('application/json')
  })
})

describe('POST /api/concerns', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return 400 when text is missing', async () => {
    const invalidConcern = {
      category: '기타',
    }

    const request = new Request('http://localhost:3000/api/concerns', {
      method: 'POST',
      body: JSON.stringify(invalidConcern),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(request)
    expect(response.status).toBe(400)
  })

  it('should return 400 when category is missing', async () => {
    const invalidConcern = {
      text: '새로운 고민',
    }

    const request = new Request('http://localhost:3000/api/concerns', {
      method: 'POST',
      body: JSON.stringify(invalidConcern),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(request)
    expect(response.status).toBe(400)
  })

  it('should return 400 when both are missing', async () => {
    const invalidConcern = {}

    const request = new Request('http://localhost:3000/api/concerns', {
      method: 'POST',
      body: JSON.stringify(invalidConcern),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(request)
    expect(response.status).toBe(400)
  })

  it('should call insert for valid data', async () => {
    const validConcern = {
      text: '새로운 고민',
      category: '기타',
    }

    const request = new Request('http://localhost:3000/api/concerns', {
      method: 'POST',
      body: JSON.stringify(validConcern),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    await POST(request)

    // Should have called supabase.from
    const { supabase } = await import('@/lib/supabase')
    expect(supabase.from).toHaveBeenCalled()
  })
})
