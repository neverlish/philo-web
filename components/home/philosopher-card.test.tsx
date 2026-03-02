import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { PhilosopherCard } from './philosopher-card'

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

describe('PhilosopherCard', () => {
  const mockPhilosopher = {
    id: 'marcus-aurelius',
    name: '마르쿠스 아우렐리우스',
    nameEn: 'Marcus Aurelius',
    era: '로마 제국',
    school: '스토아 학파',
    description: '로마 제국의 철학자 황제',
  }

  it('renders philosopher information correctly', () => {
    render(
      <PhilosopherCard
        philosopher={mockPhilosopher}
        description="내면의 요새를 지키는 법"
      />
    )

    // Component renders: name (as label), description (as title), and philosopher.description
    expect(screen.getByText('마르쿠스 아우렐리우스')).toBeInTheDocument()
    expect(screen.getByText('내면의 요새를 지키는 법')).toBeInTheDocument()
    expect(screen.getByText('로마 제국의 철학자 황제')).toBeInTheDocument()
  })

  it('renders card with proper structure', () => {
    const { container } = render(
      <PhilosopherCard
        philosopher={mockPhilosopher}
        description="테스트 설명"
      />
    )

    const card = container.querySelector('.rounded-lg')
    expect(card).toBeInTheDocument()
  })
})
