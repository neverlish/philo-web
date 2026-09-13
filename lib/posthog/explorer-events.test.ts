import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { installExplorerTracking, trackExplorer } from './explorer-events'

const sdk = vi.hoisted(() => ({ capture: vi.fn(), has_opted_out_capturing: vi.fn(() => false) }))
vi.mock('posthog-js', () => ({ default: sdk }))
beforeEach(() => { vi.stubEnv('NODE_ENV', 'production'); vi.stubEnv('NEXT_PUBLIC_POSTHOG_KEY', 'test'); sdk.has_opted_out_capturing.mockReturnValue(false) })
afterEach(() => { vi.unstubAllEnvs(); vi.clearAllMocks(); document.body.innerHTML = '' })

describe('production explorer analytics', () => {
  it('keeps only allowlisted properties, never answers or URLs', () => {
    trackExplorer('explorer_answer_selected', 'aristotle', { answer: 'PRIVATE', reply: 2, href: '?private=1', enabled: true })
    expect(sdk.capture).toHaveBeenCalledWith('explorer_answer_selected', { enabled: true, feature: 'aristotle', environment: 'production', analytics_schema_version: 1 })
  })
  it('skips development and opt-out, and tolerates SDK errors', () => {
    vi.stubEnv('NODE_ENV', 'development'); trackExplorer('explorer_started', 'index')
    vi.stubEnv('NODE_ENV', 'production'); sdk.has_opted_out_capturing.mockReturnValue(true); trackExplorer('explorer_started', 'index')
    expect(sdk.capture).not.toHaveBeenCalled()
    sdk.has_opted_out_capturing.mockReturnValue(false); sdk.capture.mockImplementationOnce(() => { throw new Error('offline') })
    expect(() => trackExplorer('explorer_started', 'index')).not.toThrow()
  })
  it('counts all visited scenes once and removes listeners on cleanup', () => {
    document.body.innerHTML = '<div class="pair" data-phase="0"></div><button id="next">next</button>'
    const root = document.body, controller = new AbortController(), capture = vi.fn()
    installExplorerTracking(root, 'compare', controller.signal, capture)
    root.querySelector<HTMLElement>('.pair')!.dataset.phase = '2'; root.querySelector('button')!.click()
    expect(capture.mock.calls.some(([e]) => e === 'explorer_sequence_traversed')).toBe(false)
    root.querySelector<HTMLElement>('.pair')!.dataset.phase = '1'; root.querySelector('button')!.click(); root.querySelector('button')!.click()
    expect(capture.mock.calls.filter(([e]) => e === 'explorer_started')).toHaveLength(1)
    expect(capture.mock.calls.filter(([e]) => e === 'explorer_sequence_traversed')).toHaveLength(1)
    controller.abort(); capture.mockClear(); root.querySelector('button')!.click()
    expect(capture).not.toHaveBeenCalled()
  })
  it('does not send selected answers from the DOM', () => {
    document.body.innerHTML = '<button data-reply="PRIVATE">PRIVATE ANSWER</button>'
    const controller = new AbortController(), capture = vi.fn()
    installExplorerTracking(document.body, 'aristotle', controller.signal, capture)
    document.querySelector('button')!.click()
    expect(capture).toHaveBeenCalledWith('explorer_answer_selected', 'aristotle', {})
    expect(JSON.stringify(capture.mock.calls)).not.toContain('PRIVATE')
    controller.abort()
  })
})
