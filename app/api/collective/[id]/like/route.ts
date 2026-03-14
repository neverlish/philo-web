// app/api/collective/[id]/like/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server-auth'

type Params = { params: Promise<{ id: string }> }

export async function POST(_request: Request, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { error } = await supabase
    .from('collective_post_likes')
    .insert({ user_id: session.user.id, post_id: id })

  if (error?.code === '23505') return NextResponse.json({ ok: true }) // already liked
  if (error) return NextResponse.json({ error: 'Failed to like' }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { error } = await supabase
    .from('collective_post_likes')
    .delete()
    .eq('user_id', session.user.id)
    .eq('post_id', id)

  if (error) return NextResponse.json({ error: 'Failed to unlike' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
