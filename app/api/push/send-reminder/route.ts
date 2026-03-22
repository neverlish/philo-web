import { NextResponse } from 'next/server'
import webpush from 'web-push'
import { createClient } from '@/lib/supabase/server-auth'

const NOTIFICATION_PAYLOAD = JSON.stringify({
  title: '오늘의철학',
  body: '오늘 하루 마음속 고민을 철학으로 풀어볼까요?',
  url: '/opening',
  icon: '/favicon.ico',
})

export async function POST(request: Request) {
  const authHeader = request.headers.get('Authorization')
  const cronSecret = process.env.CRON_SECRET
  const isVercelCron = request.headers.get('x-vercel-cron') === '1'
  const isAuthorized = isVercelCron || (cronSecret && authHeader === `Bearer ${cronSecret}`)

  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  webpush.setVapidDetails(
    process.env.VAPID_EMAIL!,
    process.env.VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!,
  )

  const supabase = await createClient()

  const today = new Date().toISOString().split('T')[0]
  const { data: subscriptions, error } = await supabase
    .from('push_subscriptions')
    .select('endpoint, p256dh, auth, user_id')
    .not('user_id', 'in', `(select user_id from check_ins where created_at >= '${today}')`)

  if (error) {
    console.error('Failed to fetch subscriptions:', error)
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }

  if (!subscriptions || subscriptions.length === 0) {
    return NextResponse.json({ sent: 0 })
  }

  let sent = 0
  const failures: string[] = []

  await Promise.allSettled(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          NOTIFICATION_PAYLOAD,
        )
        sent++
      } catch (err: unknown) {
        if (err && typeof err === 'object' && 'statusCode' in err && (err as { statusCode: number }).statusCode === 410) {
          await supabase.from('push_subscriptions').delete().eq('endpoint', sub.endpoint)
        } else {
          failures.push(sub.endpoint)
          console.error('Push send error:', err)
        }
      }
    })
  )

  console.log(`Push reminder sent: ${sent}/${subscriptions.length}`)
  return NextResponse.json({ sent, failures: failures.length })
}
