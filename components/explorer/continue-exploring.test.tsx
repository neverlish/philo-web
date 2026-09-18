import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ContinueExploring } from './continue-exploring'
import { EXPLORER_PAGES, EXPLORER_SLUGS } from '@/lib/explorer/pages'

const { capture } = vi.hoisted(() => ({ capture: vi.fn() }))
vi.mock('@/lib/posthog/explorer-events', () => ({ trackExplorer: capture }))
afterEach(() => { cleanup(); vi.clearAllMocks() })
function click(link: HTMLElement) {
  link.addEventListener('click', event => event.preventDefault())
  fireEvent.click(link)
}

describe('continue exploring', () => {
  it.each(EXPLORER_SLUGS)('%s preserves crawlable links to all other experiences exactly once', slug => {
    const html = renderToStaticMarkup(<ContinueExploring slug={slug} />)
    for (const target of EXPLORER_SLUGS) {
      expect(html.split(`href="${EXPLORER_PAGES[target].path}"`).length - 1).toBe(target === slug ? 0 : 1)
    }
  })
  it('records recommendation, map, guide and home clicks once with public IDs', () => {
    render(<ContinueExploring slug="plato" />)
    click(screen.getByRole('link', { name: /보이는 것을, 다른 방식으로/ }))
    expect(capture).toHaveBeenLastCalledWith('explorer_navigation_clicked', 'plato', { destination: 'descartes', placement: 'recommendation' })
    click(screen.getByRole('link', { name: /철학자 관계 지도/ }))
    expect(capture).toHaveBeenLastCalledWith('explorer_navigation_clicked', 'plato', { destination: 'map', placement: 'footer' })
    click(screen.getByRole('link', { name: '플라톤의 핵심 사상 더 읽기' }))
    expect(capture).toHaveBeenLastCalledWith('explorer_guide_clicked', 'plato', { philosopher: 'plato', placement: 'footer' })
    click(screen.getByRole('link', { name: '오늘의철학 홈' }))
    expect(capture).toHaveBeenLastCalledWith('explorer_home_clicked', 'plato', { placement: 'footer' })
    expect(capture).toHaveBeenCalledTimes(4)
  })
  it('offers both philosophers as further reading on the comparison page', () => {
    render(<ContinueExploring slug="compare" />)
    expect(screen.getByRole('link', { name: '플라톤의 핵심 사상 더 읽기' })).toHaveAttribute('href', '/philosopher/plato')
    expect(screen.getByRole('link', { name: '데카르트의 핵심 사상 더 읽기' })).toHaveAttribute('href', '/philosopher/descartes')
  })
})
