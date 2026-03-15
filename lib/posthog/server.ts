// lib/posthog/server.ts
import { PostHog } from 'posthog-node'

const POSTHOG_HOST = 'https://us.i.posthog.com'

export async function captureServerEvent({
  distinctId,
  event,
  properties,
}: {
  distinctId: string
  event: string
  properties?: Record<string, unknown>
}) {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
  if (!key) {
    console.warn('[PostHog] NEXT_PUBLIC_POSTHOG_KEY is not set, skipping capture')
    return
  }

  const client = new PostHog(key, {
    host: POSTHOG_HOST,
    flushAt: 1,
    flushInterval: 0,
  })

  client.capture({ distinctId, event, properties })
  await client.shutdown()
}
