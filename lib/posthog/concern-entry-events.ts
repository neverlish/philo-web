import posthog from 'posthog-js'

export type ConcernMode = 'dialogue' | 'reading'
export function trackConcernEntry(event: 'concern_mode_selected' | 'concern_entry_submitted' | 'concern_entry_failed', mode: ConcernMode) {
  if (process.env.NODE_ENV !== 'production' || !process.env.NEXT_PUBLIC_POSTHOG_KEY) return
  if (!['dialogue', 'reading'].includes(mode)) return
  try {
    if (posthog.has_opted_out_capturing()) return
    posthog.capture(event, { mode, source: 'concern_sheet', analytics_schema_version: 1 })
  } catch { /* Tracking must not block entry or expose private input. */ }
}
