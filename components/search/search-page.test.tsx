import { cleanup, fireEvent, render, screen, act } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { ComponentProps } from 'react'

vi.mock('@/components/navigation/header', () => ({ Header: () => null }))
vi.mock('@/components/navigation/bottom-nav', () => ({ BottomNav: () => null }))
vi.mock('posthog-js/react', () => ({ usePostHog: () => null }))
vi.mock('next/link', () => ({ default: (props: ComponentProps<'a'>) => <a {...props} /> }))

import { SearchPage } from './search-page'
import { WISDOM_TOPIC_LIST } from '@/lib/wisdom-topics'
import { parseSearchFilter } from '@/lib/search-filter'

afterEach(cleanup)

function setup(query = '') {
  window.history.replaceState({ navigation: 'preserved' }, '', `/search?q=${encodeURIComponent(query)}#results`)
  render(<SearchPage philosophers={[]} topics={[]} quotes={[]} initialQuery={query} />)
  return screen.getByRole('textbox')
}

describe('search navigation', () => {
  it('filters a shared URL, handles an empty category, and restores all results', () => {
    window.history.replaceState({}, '', '/search?q=불안&type=quotes')
    render(<SearchPage philosophers={[]} topics={WISDOM_TOPIC_LIST} quotes={[]} initialQuery="불안" initialFilter="quotes" />)
    expect(screen.getByRole('button', { name: '명언 0' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.queryByRole('region', { name: '고민별 철학 가이드' })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: '전체 결과 1개 보기' }))
    expect(screen.getByRole('region', { name: '고민별 철학 가이드' })).toBeInTheDocument()
    expect(new URL(window.location.href).searchParams.has('type')).toBe(false)
  })

  it('keeps the filter when typing and restores it on history navigation', () => {
    const input = setup('불안')
    fireEvent.click(screen.getByRole('button', { name: '명언 0' }))
    fireEvent.change(input, { target: { value: '니체' } })
    expect(new URL(window.location.href).searchParams.get('type')).toBe('quotes')
    act(() => {
      window.history.replaceState({}, '', '/search?q=불안&type=topics')
      window.dispatchEvent(new PopStateEvent('popstate'))
    })
    expect(input).toHaveValue('불안')
    expect(screen.getByRole('button', { name: '가이드 0' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('falls back to all results for invalid or repeated URL filters', () => {
    expect(parseSearchFilter('unknown')).toBe('all')
    expect(parseSearchFilter(['quotes', 'topics'])).toBe('all')
    expect(parseSearchFilter('quotes')).toBe('quotes')
  })

  it('restores the input when browser history changes without overwriting the URL', () => {
    const input = setup('불안')
    fireEvent.change(input, { target: { value: '니체' } })
    act(() => {
      window.history.replaceState({}, '', '/search?q=통제')
      window.dispatchEvent(new PopStateEvent('popstate'))
    })
    expect(input).toHaveValue('통제')
    expect(new URL(window.location.href).searchParams.get('q')).toBe('통제')
  })

  it('bounds typed queries consistently and preserves navigation state and hash', () => {
    const input = setup()
    fireEvent.change(input, { target: { value: '가'.repeat(101) } })
    expect(input).toHaveValue('가'.repeat(100))
    expect(new URL(window.location.href).searchParams.get('q')).toHaveLength(100)
    expect(window.history.state).toEqual({ navigation: 'preserved' })
    expect(window.location.hash).toBe('#results')
  })

  it('clears both the input and shared URL', () => {
    const input = setup('불안')
    fireEvent.click(screen.getByRole('button', { name: '검색어 지우기' }))
    expect(input).toHaveValue('')
    expect(new URL(window.location.href).searchParams.has('q')).toBe(false)
    expect(input).toHaveFocus()
  })
})
