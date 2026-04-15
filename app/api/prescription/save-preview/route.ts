import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server-auth'
import { captureServerEvent } from '@/lib/posthog/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let body: {
      concern?: string
      philosopher?: { name: string; school: string; era: string }
      quote?: { text: string; meaning: string; application: string }
      title?: string
      subtitle?: string
    }
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const { concern, philosopher, quote, title, subtitle } = body

    if (!concern || !philosopher || !quote || !title || !subtitle) {
      return NextResponse.json({ error: 'Invalid prescription data' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('ai_prescriptions')
      .insert({
        user_id: session.user.id,
        concern,
        philosopher_name: philosopher.name,
        philosopher_school: philosopher.school,
        philosopher_era: philosopher.era,
        quote_text: quote.text,
        quote_meaning: quote.meaning,
        quote_application: quote.application,
        title,
        subtitle,
        theme_tags: [],
        intention_suggestions: [],
      })
      .select('id')
      .single()

    if (error) {
      console.error('DB insert error:', error)
      return NextResponse.json({ error: 'Failed to save prescription' }, { status: 500 })
    }

    await captureServerEvent({
      distinctId: session.user.id,
      event: 'preview_prescription_saved',
      properties: {
        philosopher: philosopher.name,
        concern_length: concern.length,
      },
    })

    return NextResponse.json({ prescriptionId: data.id })
  } catch (error) {
    console.error('Save preview prescription error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
