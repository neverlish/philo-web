import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import PreviewPage from './page'

const router = vi.hoisted(() => ({ replace: vi.fn() }))
vi.mock('next/navigation', () => ({ useRouter: () => router }))
vi.mock('@/components/auth/LoginModal', () => ({ LoginModal: ({ isOpen }: { isOpen: boolean }) => isOpen ? <div role="dialog">로그인</div> : null }))
afterEach(() => { cleanup(); sessionStorage.clear() })

describe('Guest prescription preview', () => {
  it('shows the application without login but still prompts when saving', async () => {
    sessionStorage.setItem('previewPrescription', JSON.stringify({
      concern: '테스트 고민', title: '테스트 제목', subtitle: '테스트 부제',
      philosopher: { name: '에픽테토스', school: '스토아', era: '고대' },
      quote: { text: '예시 문장', meaning: '예시 해설', application: '오늘 할 일을 하나 적어보세요' },
    }))
    render(<PreviewPage />)
    const application = await screen.findByText('오늘 할 일을 하나 적어보세요')
    expect(application).toBeVisible()
    expect(application.closest('[aria-hidden]')).toBeNull()
    expect(application.closest('.blur-sm')).toBeNull()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /지금 할 수 있는 행동/ })).toHaveAttribute('href', '/practice/control')
    fireEvent.click(screen.getByRole('button', { name: /구글로 회원가입하고 저장하기/ }))
    expect(screen.getByRole('dialog')).toBeVisible()
    expect(sessionStorage.getItem('pendingPreviewSave')).toBe('true')
  })
})
