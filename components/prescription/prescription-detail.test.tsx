import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Prescription } from '@/types'

vi.mock('posthog-js/react', () => ({
  usePostHog: () => ({ capture: vi.fn() }),
}))

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

import { PrescriptionDetail } from './prescription-detail'

const MOCK_PRESCRIPTION: Prescription = {
  id: 'prescription-abc',
  title: '내면의 요새를 지키는 법',
  subtitle: '스토아 철학의 지혜',
  philosopher: {
    id: 'marcus-aurelius',
    name: '마르쿠스 아우렐리우스',
    nameEn: 'Marcus Aurelius',
    era: '로마 제국',
    school: '스토아 학파',
    description: '철학자 황제',
  },
  quote: {
    id: 'quote-1',
    philosopherId: 'marcus-aurelius',
    text: '당신이 통제할 수 없는 것에 에너지를 낭비하지 말라.',
    meaning: '내면의 평정을 지키는 법을 배워라.',
    application: '오늘 통제할 수 없는 한 가지를 내려놓아 보세요.',
    category: '인간관계',
  },
}

describe('PrescriptionDetail', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 200 }))
    vi.stubGlobal('navigator', {
      share: undefined,
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    })
  })

  it('renders title and subtitle', () => {
    render(<PrescriptionDetail prescription={MOCK_PRESCRIPTION} />)
    expect(screen.getByText('내면의 요새를 지키는 법')).toBeInTheDocument()
    expect(screen.getByText('스토아 철학의 지혜')).toBeInTheDocument()
  })

  it('renders quote text and philosopher name', () => {
    render(<PrescriptionDetail prescription={MOCK_PRESCRIPTION} />)
    expect(screen.getByText(/당신이 통제할 수 없는 것에/)).toBeInTheDocument()
    expect(screen.getAllByText('마르쿠스 아우렐리우스').length).toBeGreaterThan(0)
  })

  it('renders 다짐 남기기 button', () => {
    render(<PrescriptionDetail prescription={MOCK_PRESCRIPTION} prescriptionId="prescription-abc" />)
    expect(screen.getByText('다짐 남기기')).toBeInTheDocument()
  })

  it('renders 공유하기 button', () => {
    render(<PrescriptionDetail prescription={MOCK_PRESCRIPTION} />)
    expect(screen.getByText('공유하기')).toBeInTheDocument()
  })

  it('renders intention input', () => {
    render(
      <PrescriptionDetail prescription={MOCK_PRESCRIPTION} prescriptionId="prescription-abc" />
    )
    expect(screen.getByPlaceholderText(/직접 입력하거나 위에서 선택하세요/)).toBeInTheDocument()
  })
})
