import { createClient } from '@/lib/supabase/server-auth'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { reflection } = await request.json()
  if (typeof reflection !== 'string' || reflection.trim().length === 0) {
    return NextResponse.json({ error: 'Invalid reflection' }, { status: 400 })
  }

  // 처방이 본인 것인지 확인
  const { data: prescription } = await supabase
    .from('ai_prescriptions')
    .select('id')
    .eq('id', id)
    .eq('user_id', session.user.id)
    .single()

  if (!prescription) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const { error } = await supabase
    .from('prescription_reflections')
    .insert({
      prescription_id: id,
      user_id: session.user.id,
      reflection_text: reflection.trim(),
    })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
