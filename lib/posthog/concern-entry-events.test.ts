import { afterEach, expect, it, vi } from 'vitest'
import { trackConcernEntry } from './concern-entry-events'
const sdk = vi.hoisted(() => ({ capture: vi.fn(), has_opted_out_capturing: vi.fn(() => false) }))
vi.mock('posthog-js', () => ({ default: sdk }))
afterEach(() => { vi.clearAllMocks(); vi.unstubAllEnvs() })
it('sends only the chosen experience, not personal text', () => {
  vi.stubEnv('NODE_ENV', 'production'); vi.stubEnv('NEXT_PUBLIC_POSTHOG_KEY', 'test')
  trackConcernEntry('concern_mode_selected', 'reading')
  expect(sdk.capture).toHaveBeenCalledWith('concern_mode_selected', { mode: 'reading', source: 'concern_sheet', analytics_schema_version: 1 })
})
it('respects development, missing configuration, and opt-out', () => {
  vi.stubEnv('NODE_ENV', 'development'); vi.stubEnv('NEXT_PUBLIC_POSTHOG_KEY', 'test')
  trackConcernEntry('concern_entry_submitted', 'reading')
  vi.stubEnv('NODE_ENV', 'production'); vi.stubEnv('NEXT_PUBLIC_POSTHOG_KEY', '')
  trackConcernEntry('concern_entry_submitted', 'reading')
  vi.stubEnv('NEXT_PUBLIC_POSTHOG_KEY', 'test'); sdk.has_opted_out_capturing.mockReturnValueOnce(true)
  trackConcernEntry('concern_entry_submitted', 'reading')
  expect(sdk.capture).not.toHaveBeenCalled()
})
