import { describe, it, expect, vi, beforeEach } from 'vitest'

process.env.ANTHROPIC_API_KEY = 'test-api-key'

const MOCK_PARSED_OUTPUT = {
  philosopher: { name: '마르쿠스 아우렐리우스', school: '스토아 학파', era: '고대 (121-180)' },
  quote: { text: '테스트 명언', meaning: '테스트 해석', application: '테스트 실천' },
  title: '테스트 처방 제목',
  subtitle: '테스트 부제',
}

const mockParse = vi.fn().mockResolvedValue({
  parsed_output: MOCK_PARSED_OUTPUT,
  content: [{ type: 'text', text: JSON.stringify(MOCK_PARSED_OUTPUT) }],
})

vi.mock('@anthropic-ai/sdk', () => {
  const MockAnthropic = vi.fn().mockImplementation(function (this: Record<string, unknown>) {
    this.messages = { parse: mockParse }
  })
  return {
    default: MockAnthropic,
    __esModule: true,
  }
})

vi.mock('@anthropic-ai/sdk/helpers/json-schema', () => ({
  jsonSchemaOutputFormat: vi.fn((schema) => schema),
}))

vi.mock('@/lib/supabase/server-auth', () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: { session: { user: { id: 'user-123' } } },
      }),
    },
    from: vi.fn().mockReturnValue({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { id: 'prescription-abc' },
            error: null,
          }),
        }),
      }),
    }),
  }),
}))

describe('POST /api/prescription/generate', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockParse.mockResolvedValue({
      parsed_output: MOCK_PARSED_OUTPUT,
      content: [{ type: 'text', text: JSON.stringify(MOCK_PARSED_OUTPUT) }],
    })
  })

  it('should return 401 if not authenticated', async () => {
    const { createClient } = await import('@/lib/supabase/server-auth')
    vi.mocked(createClient).mockResolvedValueOnce({
      auth: {
        getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      },
    } as any)

    const { POST } = await import('./route')
    const request = new Request('http://localhost:3000/api/prescription/generate', {
      method: 'POST',
      body: JSON.stringify({ concern: '테스트 고민', conversationId: 'conv-123' }),
    })
    const response = await POST(request)
    expect(response.status).toBe(401)
  })

  it('should return 400 if concern is missing', async () => {
    const { POST } = await import('./route')
    const request = new Request('http://localhost:3000/api/prescription/generate', {
      method: 'POST',
      body: JSON.stringify({ conversationId: 'conv-123' }),
    })
    const response = await POST(request)
    expect(response.status).toBe(400)
  })

  it('should return prescriptionId on success', async () => {
    const { POST } = await import('./route')
    const request = new Request('http://localhost:3000/api/prescription/generate', {
      method: 'POST',
      body: JSON.stringify({ concern: '인간관계가 너무 힘들어요', conversationId: 'conv-123' }),
    })
    const response = await POST(request)
    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body).toHaveProperty('prescriptionId')
    expect(body.prescriptionId).toBe('prescription-abc')
  })

  it('should return 400 if concern exceeds 1000 characters', async () => {
    const { POST } = await import('./route')
    const request = new Request('http://localhost:3000/api/prescription/generate', {
      method: 'POST',
      body: JSON.stringify({ concern: 'a'.repeat(1001), conversationId: 'conv-123' }),
    })
    const response = await POST(request)
    expect(response.status).toBe(400)
  })

  it('should return 500 if DB insert fails', async () => {
    const { createClient } = await import('@/lib/supabase/server-auth')
    vi.mocked(createClient).mockResolvedValueOnce({
      auth: {
        getSession: vi.fn().mockResolvedValue({
          data: { session: { user: { id: 'user-123' } } },
        }),
      },
      from: vi.fn().mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { message: 'DB error' },
            }),
          }),
        }),
      }),
    } as any)

    const { POST } = await import('./route')
    const request = new Request('http://localhost:3000/api/prescription/generate', {
      method: 'POST',
      body: JSON.stringify({ concern: '테스트 고민', conversationId: 'conv-123' }),
    })
    const response = await POST(request)
    expect(response.status).toBe(500)
  })
})
