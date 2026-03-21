import { createClient } from '@/lib/supabase/server-auth'
import { NextResponse } from 'next/server'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { intention } = await request.json()
  if (typeof intention !== 'string' || intention.trim().length === 0) {
    return NextResponse.json({ error: 'Invalid intention' }, { status: 400 })
  }

  const { error } = await supabase
    .from('ai_prescriptions')
    .update({ user_intention: intention.trim() })
    .eq('id', id)
    .eq('user_id', session.user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
