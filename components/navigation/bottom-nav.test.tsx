import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { usePathname } from 'next/navigation'

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/'),
}))

vi.mock('@/components/navigation/mic-fab', () => ({
  MicFab: () => null,
}))

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

import { BottomNav } from './bottom-nav'

describe('BottomNav', () => {
  it('renders 4 navigation links', () => {
    render(<BottomNav />)
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(4)
  })

  it('marks home tab as active when pathname is /', () => {
    vi.mocked(usePathname).mockReturnValue('/')
    render(<BottomNav />)
    const homeLink = screen.getByRole('link', { name: '홈' })
    expect(homeLink).toHaveClass('text-primary')
  })

  it('marks saved tab as active when pathname is /saved', () => {
    vi.mocked(usePathname).mockReturnValue('/saved')
    render(<BottomNav />)
    const savedLink = screen.getByRole('link', { name: '저장' })
    expect(savedLink).toHaveClass('text-primary')
  })

  it('marks profile tab as active when pathname is /profile', () => {
    vi.mocked(usePathname).mockReturnValue('/profile')
    render(<BottomNav />)
    const profileLink = screen.getByRole('link', { name: '프로필' })
    expect(profileLink).toHaveClass('text-primary')
  })

  it('inactive tabs do not have text-primary class', () => {
    vi.mocked(usePathname).mockReturnValue('/')
    render(<BottomNav />)
    const savedLink = screen.getByRole('link', { name: '저장' })
    expect(savedLink).not.toHaveClass('text-primary')
  })
})
