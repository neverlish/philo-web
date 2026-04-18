import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server-auth'
import { getTodayKST } from '@/lib/date'
import { isCronAuthorized, initVapid, sendPushBatch } from '@/lib/push/send'

const PAYLOAD = JSON.stringify({
  title: '오늘의철학',
  body: '오늘 하루 마음속 고민을 철학으로 풀어볼까요?',
  url: '/opening',
  icon: '/favicon.ico',
})

export async function POST(request: Request) {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  initVapid()
  const supabase = await createClient()

  const today = getTodayKST()
  const { data: subscriptions, error } = await supabase
    .from('push_subscriptions')
    .select('endpoint, p256dh, auth, user_id')
    .not('user_id', 'in', `(select user_id from check_ins where created_at >= '${today}T00:00:00+09:00')`)

  if (error) {
    console.error('Failed to fetch subscriptions:', error)
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }

  if (!subscriptions || subscriptions.length === 0) {
    return NextResponse.json({ sent: 0 })
  }

  const { sent, failures } = await sendPushBatch(subscriptions, () => PAYLOAD, supabase)
  console.log(`Push reminder sent: ${sent}/${subscriptions.length}`)
  return NextResponse.json({ sent, failures })
}
