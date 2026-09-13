import { after } from 'next/server'
import { captureServerEvent } from './server'

export function schedulePreviewOutcome(request: Request, mode: 'dialogue' | 'prescription' | 'unknown', status: number) {
  // Only correlate opted-in, initialized client requests. Do not invent guest identities.
  const distinctId = request.headers.get('X-POSTHOG-DISTINCT-ID')
  const sessionId = request.headers.get('X-POSTHOG-SESSION-ID')
  const valid = (value: string | null): value is string => !!value && /^[a-zA-Z0-9_-]{1,128}$/.test(value)
  if (process.env.NODE_ENV !== 'production' || !process.env.NEXT_PUBLIC_POSTHOG_KEY || !valid(distinctId) || !valid(sessionId)) return
  try {
    after(async () => {
      try {
        await captureServerEvent({
          distinctId,
          event: status < 400 ? 'preview_generation_succeeded' : 'preview_generation_failed',
          properties: { mode, status_code: status, $session_id: sessionId, analytics_schema_version: 1 },
        })
      } catch { console.warn('[PostHog] Preview outcome capture failed') }
    })
  } catch { console.warn('[PostHog] Preview outcome scheduling failed') }
}
