import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ControlPractice } from './control-practice'
import { PhilosophyDialogue } from './philosophy-dialogue'

const { track } = vi.hoisted(() => ({ track: vi.fn() }))
vi.mock('@/lib/posthog/practice-events', () => ({
  trackPractice: track,
  practiceAnalyticsHeaders: () => ({ 'X-POSTHOG-DISTINCT-ID': 'test-user' }),
}))
afterEach(() => { cleanup(); vi.clearAllMocks(); vi.unstubAllGlobals() })

describe('practice analytics wiring', () => {
  it('tracks start once and completion without the private inputs', () => {
    render(<ControlPractice />)
    screen.getAllByRole('textbox').forEach(input => fireEvent.change(input, { target: { value: 'PRIVATE' } }))
    fireEvent.click(screen.getByRole('button', { name: '오늘의 한 걸음 정하기' }))
    expect(track.mock.calls).toEqual([['control_practice_started'], ['control_practice_completed']])
  })

  it('tracks actual replies and forwards correlation without recording text', async () => {
    const fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ reply: 'PRIVATE REPLY' }) })
    vi.stubGlobal('fetch', fetch)
    render(<PhilosophyDialogue concern="PRIVATE CONCERN" context="" />)
    fireEvent.click(screen.getByRole('button', { name: 'AI와 이어서 생각하기' }))
    fireEvent.change(screen.getByLabelText('내 생각 이어서 적기'), { target: { value: 'PRIVATE MESSAGE' } })
    fireEvent.click(screen.getByRole('button', { name: '보내기' }))
    await waitFor(() => expect(track).toHaveBeenCalledWith('dialogue_reply_received', { entry: false, intent: 'explore', turn_count: 1 }))
    expect(fetch.mock.calls[0][1].headers['X-POSTHOG-DISTINCT-ID']).toBe('test-user')
    expect(JSON.stringify(track.mock.calls)).not.toContain('PRIVATE')
  })

  it('records a sanitized failure and no false success', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('PRIVATE EXCEPTION')))
    render(<PhilosophyDialogue concern="PRIVATE" context="" />)
    fireEvent.click(screen.getByRole('button', { name: 'AI와 이어서 생각하기' }))
    fireEvent.change(screen.getByLabelText('내 생각 이어서 적기'), { target: { value: 'PRIVATE' } })
    fireEvent.click(screen.getByRole('button', { name: '보내기' }))
    await waitFor(() => expect(track).toHaveBeenCalledWith('dialogue_request_failed', { entry: false, intent: 'explore', reason: 'request_failed' }))
    expect(track.mock.calls.some(([event]) => event === 'dialogue_reply_received')).toBe(false)
    expect(JSON.stringify(track.mock.calls)).not.toContain('PRIVATE')
  })
})
