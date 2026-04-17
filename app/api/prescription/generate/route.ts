import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { jsonSchemaOutputFormat } from '@anthropic-ai/sdk/helpers/json-schema'
import { createClient } from '@/lib/supabase/server-auth'
import { captureServerEvent } from '@/lib/posthog/server'
import { getTodayKST } from '@/lib/date'
import { SYSTEM_PROMPT, ClaudeResponseSchema, type ClaudeResponse } from './prompt'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let body: { concern?: string; conversationId?: string }
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const { concern, conversationId } = body

    if (!concern) {
      return NextResponse.json({ error: 'concern is required' }, { status: 400 })
    }

    if (concern.length > 1000) {
      return NextResponse.json({ error: 'concern must be 1000 characters or less' }, { status: 400 })
    }

    // 최근 7일 처방 (오늘 제외)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const today = getTodayKST()
    const { data: recentPrescription } = await supabase
      .from('ai_prescriptions')
      .select('concern, philosopher_name, user_intention, created_at')
      .eq('user_id', session.user.id)
      .gte('created_at', sevenDaysAgo.toISOString())
      .lt('created_at', new Date(`${today}T00:00:00+09:00`).toISOString())
      .not('user_intention', 'is', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    const daysAgo = recentPrescription?.created_at
      ? Math.floor((Date.now() - new Date(recentPrescription.created_at).getTime()) / 86400000)
      : null

    const recentContext = recentPrescription && daysAgo !== null
      ? `\n\n[이전 처방 맥락] ${daysAgo}일 전 이 사용자는 "${recentPrescription.concern}"에 대해 고민했고, ${recentPrescription.philosopher_name}의 처방을 받아 "${recentPrescription.user_intention}"라고 다짐했습니다. 오늘 처방에서 이 흐름을 자연스럽게 이어받을 수 있다면 좋지만, 억지로 연결하지는 마세요.`
      : ''

    const anthropicApiKey = process.env.ANTHROPIC_API_KEY
    if (!anthropicApiKey) {
      throw new Error('ANTHROPIC_API_KEY environment variable is not set')
    }
    const anthropic = new Anthropic({ apiKey: anthropicApiKey })

    const message = await anthropic.messages.parse({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: `오늘의 고민: "${concern}"${recentContext}\n\n이 고민의 본질적인 질문을 파악하고, 가장 공명하는 철학자와 사상으로 처방해주세요.` }],
      output_config: {
        format: jsonSchemaOutputFormat(ClaudeResponseSchema),
      },
    })

    const parsed = message.parsed_output as ClaudeResponse | null
    if (!parsed) {
      console.error('Failed to parse Claude response:', message.content)
      return NextResponse.json({ error: 'Failed to generate prescription' }, { status: 500 })
    }

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
        theme_tags: parsed.theme_tags ?? [],
        intention_suggestions: parsed.intention_suggestions ?? [],
      })
      .select('id')
      .single()

    if (error) {
      console.error('DB insert error:', error)
      return NextResponse.json({ error: 'Failed to save prescription' }, { status: 500 })
    }

    await captureServerEvent({
      distinctId: session.user.id,
      event: 'prescription_generated',
      properties: {
        philosopher: parsed.philosopher.name,
        school: parsed.philosopher.school,
        concern_length: concern.length,
      },
    })

    return NextResponse.json({ prescriptionId: data.id })
  } catch (error) {
    console.error('Prescription generation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
