import posthog from 'posthog-js'

const events = ['home_practice_scene_changed', 'home_practice_opened', 'home_reflection_resume_clicked', 'home_checkin_clicked'] as const
export function trackHomePractice(event: typeof events[number], destination?: 'friendship' | 'control') {
  if (process.env.NODE_ENV !== 'production' || !process.env.NEXT_PUBLIC_POSTHOG_KEY || !events.includes(event)) return
  try {
    if (posthog.has_opted_out_capturing()) return
    // Scene changes deliberately omit the selected situation; navigation uses public route IDs only.
    const route = event === 'home_practice_opened' && ['friendship', 'control'].includes(destination ?? '') ? destination : undefined
    posthog.capture(event, { ...(route ? { destination: route } : {}), source: 'home', analytics_schema_version: 1 })
  } catch { /* Analytics must not interrupt navigation. */ }
}
