import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { SavedCard, SavedPrescription } from './saved-card'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
}))

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

const MOCK_PRESCRIPTION: SavedPrescription = {
  id: 'saved-1',
  prescriptionId: 'prescription-abc',
  philosopher: '마르쿠스 아우렐리우스',
  philosopherId: 'marcus-aurelius',
  title: '내면의 요새를 지키는 법',
  excerpt: '당신이 통제할 수 없는 것에 에너지를 낭비하지 말라.',
  savedAt: '2026-03-22',
  category: '인간관계',
}

describe('SavedCard', () => {
  it('renders title, philosopher, and excerpt', () => {
    render(<SavedCard prescription={MOCK_PRESCRIPTION} index={0} />)
    expect(screen.getByText('내면의 요새를 지키는 법')).toBeInTheDocument()
    expect(screen.getByText('마르쿠스 아우렐리우스')).toBeInTheDocument()
    expect(screen.getByText(/당신이 통제할 수 없는 것에/)).toBeInTheDocument()
  })

  it('renders category badge', () => {
    render(<SavedCard prescription={MOCK_PRESCRIPTION} index={0} />)
    expect(screen.getByText('인간관계')).toBeInTheDocument()
  })

  it('renders received date', () => {
    render(<SavedCard prescription={MOCK_PRESCRIPTION} index={0} />)
    expect(screen.getByText(/2026-03-22에 받음/)).toBeInTheDocument()
  })

  it('does not render delete button', () => {
    render(<SavedCard prescription={MOCK_PRESCRIPTION} index={0} />)
    expect(screen.queryByText('삭제')).not.toBeInTheDocument()
  })

  it('renders userIntention when provided', () => {
    const withIntention = { ...MOCK_PRESCRIPTION, userIntention: '매일 5분 명상하기' }
    render(<SavedCard prescription={withIntention} index={0} />)
    expect(screen.getByText(/매일 5분 명상하기/)).toBeInTheDocument()
  })

  it('links to prescription detail page', () => {
    render(<SavedCard prescription={MOCK_PRESCRIPTION} index={0} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/prescription/ai/prescription-abc')
  })
})
