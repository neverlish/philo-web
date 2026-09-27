import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ConcernSheet } from './concern-sheet'

const router = vi.hoisted(() => ({ push: vi.fn() }))
const track = vi.hoisted(() => vi.fn())
vi.mock('@/lib/posthog/concern-entry-events', () => ({ trackConcernEntry: track }))
vi.mock('@/lib/posthog/practice-events', () => ({ practiceAnalyticsHeaders: () => ({}) }))
vi.mock('next/navigation', () => ({ useRouter: () => router }))
vi.mock('posthog-js/react', () => ({ usePostHog: () => undefined }))
afterEach(() => { cleanup(); vi.restoreAllMocks(); sessionStorage.clear(); vi.unstubAllGlobals(); vi.clearAllMocks() })

describe('Concern entry routing', () => {
  it('opens a guest conversation without spending an AI request', () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    render(<ConcernSheet isOpen onClose={() => {}} />)
    fireEvent.click(screen.getByRole('radio', { name: /대화하며 생각하기/ }))
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
    fireEvent.click(screen.getByRole('radio', { name: /정리된 관점 읽기/ }))
    fireEvent.change(screen.getByPlaceholderText('고민을 자유롭게 적어보세요...'), { target: { value: '내 고민' } })
    fireEvent.click(screen.getByRole('button', { name: /해설 만들어 읽기/ }))
    await waitFor(() => expect(router.push).toHaveBeenCalledWith('/prescription/ai/existing-flow'))
    expect(fetchMock.mock.calls[0][0]).toBe('/api/prescription/generate')
  })

  it('lets authenticated users choose dialogue without generating or saving a prescription', () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    render(<ConcernSheet isOpen isLoggedIn onClose={() => {}} />)
    fireEvent.click(screen.getByRole('radio', { name: /대화하며 생각하기/ }))
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '테스트 고민' } })
    fireEvent.click(screen.getByRole('button', { name: /이 고민으로 대화 시작하기/ }))
    expect(fetchMock).not.toHaveBeenCalled()
    expect(router.push).toHaveBeenCalledWith('/preview/dialogue')
    expect(track).toHaveBeenCalledWith('concern_entry_submitted', 'dialogue')
  })

  it('lets guests read a preview without logging in', async () => {
    const prescription = { title: '제목', subtitle: '부제', philosopher: { name: '철학자', school: '학파', era: '시대' }, quote: { text: '요약', meaning: '해설', application: '제안' } }
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ prescription }) })
    vi.stubGlobal('fetch', fetchMock)
    render(<ConcernSheet isOpen onClose={() => {}} />)
    fireEvent.click(screen.getByRole('radio', { name: /정리된 관점 읽기/ }))
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '테스트 고민' } })
    fireEvent.click(screen.getByRole('button', { name: /해설 만들어 읽기/ }))
    await waitFor(() => expect(router.push).toHaveBeenCalledWith('/preview/prescription'))
    expect(fetchMock.mock.calls[0][0]).toBe('/api/prescription/preview')
    expect(JSON.parse(sessionStorage.getItem('previewPrescription')!)).toEqual({ ...prescription, concern: '테스트 고민' })
  })

  it('requires explicit selection and preserves input while switching modes', () => {
    render(<ConcernSheet isOpen onClose={() => {}} />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '테스트 고민' } })
    expect(screen.getByRole('button', { name: '생각할 방식을 선택해주세요' })).toBeDisabled()
    fireEvent.click(screen.getByRole('radio', { name: /정리된 관점 읽기/ }))
    fireEvent.click(screen.getByRole('radio', { name: /대화하며 생각하기/ }))
    expect(screen.getByRole('textbox')).toHaveValue('테스트 고민')
    expect(router.push).not.toHaveBeenCalled()
  })

  it.each([429, 401, 500])('keeps input and choice after HTTP %i', async (status) => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status }))
    render(<ConcernSheet isOpen isLoggedIn onClose={() => {}} />)
    fireEvent.click(screen.getByRole('radio', { name: /정리된 관점 읽기/ }))
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '테스트 고민' } })
    fireEvent.click(screen.getByRole('button', { name: /해설 만들어 읽기/ }))
    await screen.findByRole('alert')
    expect(screen.getByRole('textbox')).toHaveValue('테스트 고민')
    expect(screen.getByRole('radio', { name: /정리된 관점 읽기/ })).toBeChecked()
    expect(router.push).not.toHaveBeenCalled()
  })

  it('prevents repeated generation and mode changes while waiting', () => {
    const fetchMock = vi.fn().mockReturnValue(new Promise(() => {}))
    vi.stubGlobal('fetch', fetchMock)
    render(<ConcernSheet isOpen onClose={() => {}} />)
    fireEvent.click(screen.getByRole('radio', { name: /정리된 관점 읽기/ }))
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '테스트 고민' } })
    const submit = screen.getByRole('button', { name: /해설 만들어 읽기/ })
    fireEvent.click(submit)
    fireEvent.click(submit)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('radio', { name: /대화하며 생각하기/ })).toBeDisabled()
    expect(screen.getByRole('button', { name: '닫기' })).toBeDisabled()
  })

  it('does not navigate on malformed preview output', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ prescription: { title: '불완전한 응답' } }) }))
    render(<ConcernSheet isOpen onClose={() => {}} />)
    fireEvent.click(screen.getByRole('radio', { name: /정리된 관점 읽기/ }))
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '테스트 고민' } })
    fireEvent.click(screen.getByRole('button', { name: /해설 만들어 읽기/ }))
    await screen.findByRole('alert')
    expect(router.push).not.toHaveBeenCalled()
    expect(sessionStorage.getItem('previewPrescription')).toBeNull()
    expect(screen.getByRole('textbox')).toHaveValue('테스트 고민')
  })

  it('retains input when browser storage is blocked', async () => {
    vi.spyOn(sessionStorage, 'setItem').mockImplementation(() => { throw new Error('blocked') })
    render(<ConcernSheet isOpen onClose={() => {}} />)
    fireEvent.click(screen.getByRole('radio', { name: /대화하며 생각하기/ }))
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '테스트 고민' } })
    fireEvent.click(screen.getByRole('button', { name: /이 고민으로 대화 시작하기/ }))
    await screen.findByRole('alert')
    expect(router.push).not.toHaveBeenCalled()
    expect(screen.getByRole('textbox')).toHaveValue('테스트 고민')
  })
})
