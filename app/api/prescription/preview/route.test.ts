import { describe, it, expect, vi, beforeEach } from 'vitest'

process.env.ANTHROPIC_API_KEY = 'test-api-key'

const MOCK_PRESCRIPTION = {
  philosopher: { name: '마르쿠스 아우렐리우스', school: '스토아 학파', era: '고대 121-180' },
  quote: { text: '테스트 명언', meaning: '테스트 해석', application: '테스트 실천' },
  title: '테스트 제목',
  subtitle: '테스트 부제',
}

const mockParse = vi.fn().mockResolvedValue({
  parsed_output: MOCK_PRESCRIPTION,
})

vi.mock('@anthropic-ai/sdk', () => {
  const MockAnthropic = vi.fn().mockImplementation(function (this: Record<string, unknown>) {
    this.messages = { parse: mockParse }
  })
  return { default: MockAnthropic, __esModule: true }
})

vi.mock('@anthropic-ai/sdk/helpers/json-schema', () => ({
  jsonSchemaOutputFormat: vi.fn((schema) => schema),
}))

describe('POST /api/prescription/preview', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockParse.mockResolvedValue({ parsed_output: MOCK_PRESCRIPTION })
  })

  it('concern 없으면 400을 반환한다', async () => {
    const { POST } = await import('./route')
    const request = new Request('http://localhost/api/prescription/preview', {
      method: 'POST',
      body: JSON.stringify({}),
    })
    const response = await POST(request)
    expect(response.status).toBe(400)
  })

  it('concern이 빈 문자열이면 400을 반환한다', async () => {
    const { POST } = await import('./route')
    const request = new Request('http://localhost/api/prescription/preview', {
      method: 'POST',
      body: JSON.stringify({ concern: '   ' }),
    })
    const response = await POST(request)
    expect(response.status).toBe(400)
  })

  it('concern이 1000자 초과이면 400을 반환한다', async () => {
    const { POST } = await import('./route')
    const request = new Request('http://localhost/api/prescription/preview', {
      method: 'POST',
      body: JSON.stringify({ concern: 'a'.repeat(1001) }),
    })
    const response = await POST(request)
    expect(response.status).toBe(400)
  })

  it('정상 요청 시 처방 데이터를 반환한다', async () => {
    const { POST } = await import('./route')
    const request = new Request('http://localhost/api/prescription/preview', {
      method: 'POST',
      body: JSON.stringify({ concern: '인간관계가 힘들어요' }),
    })
    const response = await POST(request)
    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body).toHaveProperty('prescription')
    expect(body).toHaveProperty('concern', '인간관계가 힘들어요')
  })

  it('Claude 응답이 없으면 500을 반환한다', async () => {
    mockParse.mockResolvedValueOnce({ parsed_output: null })
    const { POST } = await import('./route')
    const request = new Request('http://localhost/api/prescription/preview', {
      method: 'POST',
      body: JSON.stringify({ concern: '테스트 고민' }),
    })
    const response = await POST(request)
    expect(response.status).toBe(500)
  })

  it('잘못된 JSON body면 400을 반환한다', async () => {
    const { POST } = await import('./route')
    const request = new Request('http://localhost/api/prescription/preview', {
      method: 'POST',
      body: 'not-json',
    })
    const response = await POST(request)
    expect(response.status).toBe(400)
  })
})
