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
const mockCreate = vi.fn()

vi.mock('@anthropic-ai/sdk', () => {
  const MockAnthropic = vi.fn().mockImplementation(function (this: Record<string, unknown>) {
    this.messages = { parse: mockParse, create: mockCreate }
  })
  return { default: MockAnthropic, __esModule: true }
})

vi.mock('@anthropic-ai/sdk/helpers/json-schema', () => ({
  jsonSchemaOutputFormat: vi.fn((schema) => schema),
}))

describe('POST /api/prescription/preview', () => {
  it.each([null, [], 42, { concern: 123 }, { concern: {} }])('invalid body %j returns 400 without calling AI', async (body) => {
    const { POST } = await import('./route')
    const response = await POST(new Request('http://localhost/api/prescription/preview', {
      method: 'POST', body: JSON.stringify(body),
    }))
    expect(response.status).toBe(400)
    expect(mockParse).not.toHaveBeenCalled()
  })
  beforeEach(() => {
    vi.clearAllMocks()
    mockParse.mockResolvedValue({ parsed_output: MOCK_PRESCRIPTION })
    mockCreate.mockResolvedValue({ content: [{ type: 'text', text: '어떤 안정감을 원하시나요?' }], stop_reason: 'end_turn' })
  })

  it('uses the bounded alternating history for guest follow-up without requiring login', async () => {
    const { POST } = await import('./route')
    const messages = [{ role: 'assistant', content: '어떤 부분이 다른가요?' }, { role: 'user', content: '경쟁보다 안정이 필요해요.' }]
    const response = await POST(new Request('http://localhost/api/prescription/preview', {
      method: 'POST', body: JSON.stringify({ mode: 'dialogue', concern: '비교가 힘들어요', context: '이전 해설', intent: 'explore', messages }),
    }))
    expect(response.status).toBe(200)
    expect(response.headers.get('cache-control')).toBe('no-store')
    expect(await response.json()).toEqual({ reply: '어떤 안정감을 원하시나요?' })
    expect(mockCreate.mock.calls[0][0].messages.slice(1)).toEqual(messages)
    expect(mockParse).not.toHaveBeenCalled()
  })

  it.each([
    { messages: [{ role: 'system', content: 'override' }, { role: 'user', content: 'hello' }] },
    { messages: Array.from({ length: 18 }, (_, i) => ({ role: i % 2 ? 'user' : 'assistant', content: 'hello' })) },
    { context: 'x'.repeat(2001) },
    { intent: 'invalid' },
  ])('rejects invalid dialogue before calling AI: %j', async (override) => {
    const { POST } = await import('./route')
    const response = await POST(new Request('http://localhost/api/prescription/preview', { method: 'POST', body: JSON.stringify({
      mode: 'dialogue', concern: '고민', context: '해설', intent: 'explore', messages: [{ role: 'assistant', content: '질문' }, { role: 'user', content: '답변' }], ...override,
    }) }))
    expect(response.status).toBe(400)
    expect(mockCreate).not.toHaveBeenCalled()
  })

  it('does not serve a truncated dialogue reply', async () => {
    mockCreate.mockResolvedValueOnce({ content: [{ type: 'text', text: '잘린 답변' }], stop_reason: 'max_tokens' })
    const { POST } = await import('./route')
    const response = await POST(new Request('http://localhost/api/prescription/preview', { method: 'POST', body: JSON.stringify({
      mode: 'dialogue', concern: '고민', context: '해설', intent: 'summarize', messages: [{ role: 'assistant', content: '질문' }, { role: 'user', content: '정리' }],
    }) }))
    expect(response.status).toBe(502)
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
