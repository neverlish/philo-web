// lib/posthog/server.ts
import { PostHog } from 'posthog-node'

// Server talks directly to PostHog, not through the browser reverse proxy
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
  const client = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    host: POSTHOG_HOST,
    flushAt: 1,
    flushInterval: 0,
  })

  client.capture({ distinctId, event, properties })
  await client.shutdown()
}
