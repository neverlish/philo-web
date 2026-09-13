import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
const sdk = vi.hoisted(() => ({ capture: vi.fn(), has_opted_out_capturing: vi.fn(), get_distinct_id: vi.fn(), get_session_id: vi.fn() }))
vi.mock('posthog-js', () => ({ default: sdk }))
import { practiceAnalyticsHeaders, trackPractice } from './practice-events'

beforeEach(() => {
  vi.clearAllMocks()
  vi.stubEnv('NODE_ENV', 'production')
  vi.stubEnv('NEXT_PUBLIC_POSTHOG_KEY', 'test-project')
  sdk.has_opted_out_capturing.mockReturnValue(false)
  sdk.get_distinct_id.mockReturnValue('anonymous-123')
  sdk.get_session_id.mockReturnValue('session-123')
})
afterEach(() => vi.unstubAllEnvs())
describe('private practice analytics', () => {
  it('drops unapproved properties including private text', () => {
    const properties = { entry: true, turn_count: 2, concern: 'PRIVATE', reply: 'PRIVATE', reflection: 'PRIVATE', answer: 'PRIVATE' }
    trackPractice('dialogue_reply_received', properties)
    expect(sdk.capture).toHaveBeenCalledWith('dialogue_reply_received', { entry: true, turn_count: 2, analytics_schema_version: 1 })
  })
  it('does not track local development or tests', () => {
    vi.stubEnv('NODE_ENV', 'development')
    trackPractice('dialogue_started')
    expect(sdk.capture).not.toHaveBeenCalled()
    expect(practiceAnalyticsHeaders()).toEqual({})
  })
  it('respects opt-out for client and server correlation', () => {
    sdk.has_opted_out_capturing.mockReturnValue(true)
    trackPractice('dialogue_started')
    expect(sdk.capture).not.toHaveBeenCalled()
    expect(practiceAnalyticsHeaders()).toEqual({})
  })
  it('correlates only initialized sessions', () => {
    expect(practiceAnalyticsHeaders()).toEqual({ 'X-POSTHOG-DISTINCT-ID': 'anonymous-123', 'X-POSTHOG-SESSION-ID': 'session-123' })
    sdk.get_session_id.mockReturnValue(undefined)
    expect(practiceAnalyticsHeaders()).toEqual({})
  })
  it('analytics failures cannot throw into the feature', () => {
    sdk.capture.mockImplementationOnce(() => { throw new Error('unavailable') })
    expect(() => trackPractice('dialogue_started')).not.toThrow()
  })
})
