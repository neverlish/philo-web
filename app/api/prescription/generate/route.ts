import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server-auth'

const PHILOSOPHER_CONTEXT = `
당신이 선택할 수 있는 철학자 목록 (이 외에도 잘 알려진 철학자 선택 가능):
- 마르쿠스 아우렐리우스 (스토아 학파, 고대 121-180): 내면의 통제, 의무, 평정심
- 세네카 (스토아 학파, 고대 기원전4-기원후65): 시간, 욕망 절제, 현재에 집중
- 에피쿠로스 (에피쿠로스 학파, 고대 기원전341-270): 단순한 쾌락, 마음의 평화, 우정
- 노자 (도가, 고대 기원전6세기): 무위자연, 유연함, 흐름에 맡기기
- 장자 (도가, 고대 기원전369-289): 상대성, 자유, 자연스러움
- 공자 (유가, 고대 기원전551-479): 인(仁), 예(禮), 수양
- 소크라테스 (고대 그리스, 기원전470-399): 무지의 지, 자기 성찰
- 아리스토텔레스 (고대 그리스, 기원전384-322): 덕, 중용, 행복
- 스피노자 (근대, 1632-1677): 감정의 이해, 자유, 필연성
- 니체 (근대, 1844-1900): 의지, 자기 극복, 삶의 긍정
`

const SYSTEM_PROMPT = `당신은 사용자의 고민을 듣고 철학적 처방을 내리는 지혜로운 안내자입니다.
사용자의 고민에 가장 적합한 철학자와 그 사상을 선택하여 처방을 만들어주세요.

${PHILOSOPHER_CONTEXT}

반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트는 포함하지 마세요:
{
  "philosopher": {
    "name": "철학자 이름 (한국어)",
    "school": "사조 이름",
    "era": "시대 (예: 고대 121-180)"
  },
  "quote": {
    "text": "해당 철학자의 실제 명언 또는 핵심 사상을 담은 문장 (한국어)",
    "meaning": "이 명언이 오늘 당신의 고민에 어떻게 닿는지 따뜻하고 구체적으로 (150-200자)",
    "application": "오늘 바로 실천할 수 있는 구체적이고 작은 행동 하나 (50-100자)"
  },
  "title": "처방 제목 - 고민의 핵심을 짚는 한 문장 (20자 이내)",
  "subtitle": "처방 부제 - 관점 또는 방향 제시 (20자 이내)"
}`

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { concern, conversationId } = body

  if (!concern) {
    return NextResponse.json({ error: 'concern is required' }, { status: 400 })
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: `나의 고민: ${concern}` }],
  })

  const responseText = message.content[0].type === 'text' ? message.content[0].text : ''
  const parsed = JSON.parse(responseText)

  const { data, error } = await supabase
    .from('ai_prescriptions')
    .insert({
      user_id: session.user.id,
      conversation_id: conversationId || null,
      concern,
      philosopher_name: parsed.philosopher.name,
      philosopher_school: parsed.philosopher.school,
      philosopher_era: parsed.philosopher.era,
      quote_text: parsed.quote.text,
      quote_meaning: parsed.quote.meaning,
      quote_application: parsed.quote.application,
      title: parsed.title,
      subtitle: parsed.subtitle,
    })
    .select('id')
    .single()

  if (error) {
    console.error('DB insert error:', error)
    return NextResponse.json({ error: 'Failed to save prescription' }, { status: 500 })
  }

  return NextResponse.json({ prescriptionId: data.id })
}
