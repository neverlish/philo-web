import { createClient } from '@/lib/supabase/server-auth'
import { NextResponse } from 'next/server'

const DISCORD_WEBHOOK_URL = process.env.DISCORD_FEEDBACK_WEBHOOK_URL!

export async function POST(request: Request) {
  const { message, email } = await request.json()

  if (typeof message !== 'string' || message.trim().length === 0) {
    return NextResponse.json({ error: 'message is required' }, { status: 400 })
  }
  if (message.trim().length > 1000) {
    return NextResponse.json({ error: 'message too long' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  // Supabase 저장
  const { error } = await supabase.from('user_feedbacks').insert({
    user_id: session?.user.id ?? null,
    email: email?.trim() || session?.user.email || null,
    message: message.trim(),
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Discord 알림
  if (DISCORD_WEBHOOK_URL) {
    const from = email?.trim() || session?.user.email || '비로그인 사용자'
    await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [{
          title: '📬 새 문의가 도착했어요',
          description: message.trim(),
          color: 0xc9872a,
          fields: [{ name: 'from', value: from, inline: true }],
          timestamp: new Date().toISOString(),
        }],
      }),
    }).catch(() => {/* Discord 실패는 무시 */})
  }

  return NextResponse.json({ ok: true })
}
