import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import DialoguePage from './page'

const router = vi.hoisted(() => ({ replace: vi.fn(), push: vi.fn() }))
vi.mock('next/navigation', () => ({ useRouter: () => router }))
afterEach(() => { cleanup(); sessionStorage.clear(); localStorage.clear(); vi.unstubAllGlobals(); vi.clearAllMocks() })

describe('Dialogue-first entry', () => {
  it('starts without AI and preserves the optional prescription route', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ prescription: { quote: { application: '작은 행동' } } }) })
    vi.stubGlobal('fetch', fetchMock)
    sessionStorage.setItem('dialogueConcern', '나의 고민')
    render(<DialoguePage />)
    await screen.findByText('나의 고민')
    expect(fetchMock).not.toHaveBeenCalled()
    fireEvent.click(screen.getByText('대신 철학 처방을 바로 읽고 싶어요'))
    fireEvent.click(screen.getByRole('button', { name: '처방 만들어 읽기' }))
    await waitFor(() => expect(router.push).toHaveBeenCalledWith('/preview/prescription'))
    expect(JSON.parse(sessionStorage.getItem('previewPrescription')!).concern).toBe('나의 고민')
  })

  it('redirects if the entry has no concern', async () => {
    render(<DialoguePage />)
    await waitFor(() => expect(router.replace).toHaveBeenCalledWith('/'))
  })
})
