import webpush from 'web-push'
import type { SupabaseClient } from '@supabase/supabase-js'

type PushSub = { endpoint: string; p256dh: string; auth: string; user_id: string }

export function isCronAuthorized(request: Request): boolean {
  const authHeader = request.headers.get('Authorization')
  const cronSecret = process.env.CRON_SECRET
  const isVercelCron = request.headers.get('x-vercel-cron') === '1'
  return isVercelCron || (!!cronSecret && authHeader === `Bearer ${cronSecret}`)
}

export function initVapid(): void {
  webpush.setVapidDetails(
    process.env.VAPID_EMAIL!,
    process.env.VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!,
  )
}

export async function sendPushBatch(
  subscriptions: PushSub[],
  getPayload: (sub: PushSub) => string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any>,
): Promise<{ sent: number; failures: number }> {
  let sent = 0
  let failures = 0

  await Promise.allSettled(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          getPayload(sub),
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
          failures++
          console.error('Push send error:', err)
        }
      }
    }),
  )

  return { sent, failures }
}
