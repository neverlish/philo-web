import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
const mocks = vi.hoisted(() => ({ after: vi.fn(), capture: vi.fn() }))
vi.mock('next/server', () => ({ after: mocks.after }))
vi.mock('./server', () => ({ captureServerEvent: mocks.capture }))
import { schedulePreviewOutcome } from './preview-events'
const request = () => new Request('https://example.test/api/prescription/preview', { headers: { 'X-POSTHOG-DISTINCT-ID': 'guest-id', 'X-POSTHOG-SESSION-ID': 'session-id' } })
beforeEach(() => { vi.resetAllMocks(); vi.stubEnv('NODE_ENV', 'production'); vi.stubEnv('NEXT_PUBLIC_POSTHOG_KEY', 'test-project') })
afterEach(() => { vi.unstubAllEnvs(); vi.restoreAllMocks() })
describe('preview outcome analytics', () => {
  it.each([[200, 'preview_generation_succeeded'], [502, 'preview_generation_failed']])('schedules status %s after the response', async (status, event) => {
    schedulePreviewOutcome(request(), 'dialogue', status as number)
    expect(mocks.capture).not.toHaveBeenCalled()
    await mocks.after.mock.calls[0][0]()
    expect(mocks.capture).toHaveBeenCalledWith({ distinctId: 'guest-id', event, properties: { mode: 'dialogue', status_code: status, $session_id: 'session-id', analytics_schema_version: 1 } })
  })
  it('does not invent identities or capture uncorrelated requests', () => {
    schedulePreviewOutcome(new Request('https://example.test'), 'dialogue', 200)
    expect(mocks.after).not.toHaveBeenCalled()
  })
  it('does not capture local/test traffic', () => {
    vi.stubEnv('NODE_ENV', 'test')
    schedulePreviewOutcome(request(), 'dialogue', 200)
    expect(mocks.after).not.toHaveBeenCalled()
  })
  it('swallows transport and scheduling failures', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    mocks.capture.mockRejectedValueOnce(new Error('transport'))
    schedulePreviewOutcome(request(), 'dialogue', 200)
    await expect(mocks.after.mock.calls[0][0]()).resolves.toBeUndefined()
    mocks.after.mockImplementationOnce(() => { throw new Error('scheduler') })
    expect(() => schedulePreviewOutcome(request(), 'dialogue', 200)).not.toThrow()
  })
})
