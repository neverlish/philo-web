import posthog from 'posthog-js'

type PracticeEvent =
  | 'control_practice_started' | 'control_practice_completed' | 'control_practice_reset'
  | 'dialogue_started' | 'dialogue_message_submitted' | 'dialogue_reply_received'
  | 'dialogue_request_failed' | 'dialogue_ended' | 'dialogue_resumed'
  | 'dialogue_rewrite_used' | 'dialogue_experiment_opened' | 'dialogue_experiment_used'
  | 'dialogue_reflection_compared'
  | 'dialogue_prescription_requested' | 'dialogue_prescription_received' | 'dialogue_prescription_failed'

type PracticeProperties = {
  entry?: boolean
  intent?: 'explore' | 'summarize'
  turn_count?: number
  reason?: 'manual' | 'summary' | 'timeout' | 'request_failed'
  interrupted?: boolean
}

function enabled() {
  return process.env.NODE_ENV === 'production' && !!process.env.NEXT_PUBLIC_POSTHOG_KEY
}

// No concern, reply, reflection, selected answer, or raw exception may enter analytics.
export function trackPractice(event: PracticeEvent, properties: PracticeProperties = {}) {
  if (!enabled()) return
  try {
    if (posthog.has_opted_out_capturing()) return
    const safe: PracticeProperties = {}
    if (typeof properties.entry === 'boolean') safe.entry = properties.entry
    if (typeof properties.interrupted === 'boolean') safe.interrupted = properties.interrupted
    if (properties.intent === 'explore' || properties.intent === 'summarize') safe.intent = properties.intent
    if (Number.isInteger(properties.turn_count) && properties.turn_count! >= 0 && properties.turn_count! <= 16) safe.turn_count = properties.turn_count
    if (['manual', 'summary', 'timeout', 'request_failed'].includes(properties.reason ?? '')) safe.reason = properties.reason
    posthog.capture(event, { ...safe, analytics_schema_version: 1 })
  } catch { /* Analytics must never interrupt a private practice. */ }
}

export function practiceAnalyticsHeaders(): Record<string, string> {
  if (!enabled()) return {}
  try {
    if (posthog.has_opted_out_capturing()) return {}
    const distinctId = posthog.get_distinct_id()
    const sessionId = posthog.get_session_id()
    if (!distinctId || !sessionId) return {}
    return { 'X-POSTHOG-DISTINCT-ID': distinctId, 'X-POSTHOG-SESSION-ID': sessionId }
  } catch { return {} }
}
