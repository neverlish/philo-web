import { NextResponse } from 'next/server'
import webpush from 'web-push'
import { createClient } from '@/lib/supabase/server-auth'
import { getTodayKST } from '@/lib/date'

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
  const today = getTodayKST()
  const todayStart = `${today}T00:00:00+09:00`
  const todayEnd = `${today}T23:59:59+09:00`

  // 오늘 다짐을 설정했지만 성찰을 아직 작성하지 않은 처방 목록
  const { data: prescriptions, error } = await supabase
    .from('ai_prescriptions')
    .select('id, user_id')
    .not('user_intention', 'is', null)
    .gte('created_at', todayStart)
    .lte('created_at', todayEnd)

  if (error) {
    console.error('Failed to fetch prescriptions:', error)
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }

  if (!prescriptions || prescriptions.length === 0) {
    return NextResponse.json({ sent: 0 })
  }

  const prescriptionIds = prescriptions.map((p) => p.id)

  // 이미 성찰을 작성한 처방 ID 제외
  const { data: reflections } = await supabase
    .from('prescription_reflections')
    .select('prescription_id')
    .in('prescription_id', prescriptionIds)

  const reflectedIds = new Set(reflections?.map((r) => r.prescription_id) ?? [])

  const toNotify = prescriptions.filter((p) => !reflectedIds.has(p.id))
  if (toNotify.length === 0) return NextResponse.json({ sent: 0 })

  const userIds = toNotify.map((p) => p.user_id)
  const userPrescriptionMap = new Map(toNotify.map((p) => [p.user_id, p.id]))

  const { data: subscriptions } = await supabase
    .from('push_subscriptions')
    .select('endpoint, p256dh, auth, user_id')
    .in('user_id', userIds)

  if (!subscriptions || subscriptions.length === 0) {
    return NextResponse.json({ sent: 0 })
  }

  let sent = 0

  await Promise.allSettled(
    subscriptions.map(async (sub) => {
      const prescriptionId = userPrescriptionMap.get(sub.user_id)
      const payload = JSON.stringify({
        title: '오늘의철학',
        body: '오늘 다짐 어떻게 됐나요? 짧게 돌아보세요 🌙',
        url: prescriptionId ? `/prescription/ai/${prescriptionId}` : '/',
        icon: '/favicon.ico',
      })

      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload,
        )
        sent++
      } catch (err: unknown) {
        if (
          err &&
          typeof err === 'object' &&
          'statusCode' in err &&
          (err as { statusCode: number }).statusCode === 410
        ) {
          await supabase.from('push_subscriptions').delete().eq('endpoint', sub.endpoint)
        } else {
          console.error('Push send error:', err)
        }
      }
    }),
  )

  console.log(`Reflection reminder sent: ${sent}/${subscriptions.length}`)
  return NextResponse.json({ sent })
}
