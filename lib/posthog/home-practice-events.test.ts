import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { trackHomePractice } from './home-practice-events'
const sdk = vi.hoisted(() => ({ capture: vi.fn(), has_opted_out_capturing: vi.fn(() => false) }))
vi.mock('posthog-js', () => ({ default: sdk }))
beforeEach(() => { vi.stubEnv('NODE_ENV', 'production'); vi.stubEnv('NEXT_PUBLIC_POSTHOG_KEY', 'test'); sdk.has_opted_out_capturing.mockReturnValue(false) })
afterEach(() => { vi.clearAllMocks(); vi.unstubAllEnvs() })
it('captures navigation with only a public destination and omits selected scenes', () => {
  trackHomePractice('home_practice_opened', 'friendship')
  expect(sdk.capture).toHaveBeenLastCalledWith('home_practice_opened', { destination: 'friendship', source: 'home', analytics_schema_version: 1 })
  trackHomePractice('home_practice_scene_changed', 'control')
  expect(sdk.capture).toHaveBeenLastCalledWith('home_practice_scene_changed', { source: 'home', analytics_schema_version: 1 })
  trackHomePractice('home_reflection_resume_clicked')
  expect(sdk.capture).toHaveBeenLastCalledWith('home_reflection_resume_clicked', { source: 'home', analytics_schema_version: 1 })
})
it('ignores opt-out, absent configuration and development', () => {
  sdk.has_opted_out_capturing.mockReturnValue(true); trackHomePractice('home_practice_opened', 'control')
  sdk.has_opted_out_capturing.mockReturnValue(false); vi.stubEnv('NEXT_PUBLIC_POSTHOG_KEY', ''); trackHomePractice('home_practice_opened')
  vi.stubEnv('NODE_ENV', 'development'); vi.stubEnv('NEXT_PUBLIC_POSTHOG_KEY', 'test'); trackHomePractice('home_practice_opened')
  expect(sdk.capture).not.toHaveBeenCalled()
})
it('does not let SDK failure block a click', () => {
  sdk.capture.mockImplementationOnce(() => { throw new Error('offline') })
  expect(() => trackHomePractice('home_practice_opened', 'control')).not.toThrow()
})
