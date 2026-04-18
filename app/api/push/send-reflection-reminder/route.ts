import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server-auth'
import { getTodayKST } from '@/lib/date'
import { isCronAuthorized, initVapid, sendPushBatch } from '@/lib/push/send'

export async function POST(request: Request) {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  initVapid()

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

  const { sent } = await sendPushBatch(
    subscriptions,
    (sub) => {
      const prescriptionId = userPrescriptionMap.get(sub.user_id)
      return JSON.stringify({
        title: '오늘의철학',
        body: '오늘 다짐 어떻게 됐나요? 짧게 돌아보세요 🌙',
        url: prescriptionId ? `/prescription/ai/${prescriptionId}` : '/',
        icon: '/favicon.ico',
      })
    },
    supabase,
  )

  console.log(`Reflection reminder sent: ${sent}/${subscriptions.length}`)
  return NextResponse.json({ sent })
}
