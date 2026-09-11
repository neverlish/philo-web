import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ConcernSheet } from './concern-sheet'

const router = vi.hoisted(() => ({ push: vi.fn() }))
vi.mock('next/navigation', () => ({ useRouter: () => router }))
vi.mock('posthog-js/react', () => ({ usePostHog: () => undefined }))
afterEach(() => { cleanup(); sessionStorage.clear(); vi.unstubAllGlobals(); vi.clearAllMocks() })

describe('Concern entry routing', () => {
  it('opens a guest conversation without spending an AI request', () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    render(<ConcernSheet isOpen onClose={() => {}} />)
    fireEvent.change(screen.getByPlaceholderText('고민을 자유롭게 적어보세요...'), { target: { value: '내 고민' } })
    fireEvent.click(screen.getByRole('button', { name: /이 고민으로 대화 시작하기/ }))
    expect(fetchMock).not.toHaveBeenCalled()
    expect(sessionStorage.getItem('dialogueConcern')).toBe('내 고민')
    expect(router.push).toHaveBeenCalledWith('/preview/dialogue')
  })

  it('keeps the authenticated prescription workflow', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ prescriptionId: 'existing-flow' }) })
    vi.stubGlobal('fetch', fetchMock)
    render(<ConcernSheet isOpen isLoggedIn onClose={() => {}} />)
    fireEvent.change(screen.getByPlaceholderText('고민을 자유롭게 적어보세요...'), { target: { value: '내 고민' } })
    fireEvent.click(screen.getByRole('button', { name: /철학적 처방 받기/ }))
    await waitFor(() => expect(router.push).toHaveBeenCalledWith('/prescription/ai/existing-flow'))
    expect(fetchMock.mock.calls[0][0]).toBe('/api/prescription/generate')
  })
})
