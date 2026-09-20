import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, expect, it, vi } from 'vitest'
import { AristotleTable } from './aristotle-table'
import { VisualNotebook } from './visual-notebook'

const { capture } = vi.hoisted(() => ({ capture: vi.fn() }))
vi.mock('@/lib/posthog/explorer-events', () => ({ trackExplorer: capture }))
afterEach(() => { cleanup(); vi.clearAllMocks() })

it('keeps the same utterance and image while context and reflection change', () => {
  render(<AristotleTable />)
  const src = screen.getByRole('img').getAttribute('src')
  expect(capture).not.toHaveBeenCalled()
  fireEvent.click(screen.getByRole('button', { name: '다시 늦은 날' }))
  expect(screen.getByRole('status')).toHaveTextContent('같은 일이 반복')
  expect(screen.getByText('“다음엔 시간을 지켜줘.”')).toBeVisible()
  expect(screen.getByRole('img')).toHaveAttribute('src', src)
  expect(screen.getByRole('button', { name: '다시 늦은 날' })).toHaveAttribute('aria-pressed', 'true')
  expect(capture).toHaveBeenCalledExactlyOnceWith('explorer_table_context_changed', 'aristotle', { scene_index: 1 })
})

it('ignores reselects and counts all presented contexts only once', () => {
  render(<AristotleTable />)
  for (const name of ['처음 늦은 날', '다시 늦은 날', '다시 늦은 날', '시간을 다르게 알았던 날', '처음 늦은 날', '시간을 다르게 알았던 날']) {
    fireEvent.click(screen.getByRole('button', { name }))
  }
  expect(capture.mock.calls.filter(([event]) => event === 'explorer_table_context_changed')).toHaveLength(4)
  expect(capture.mock.calls.filter(([event]) => event === 'explorer_table_contexts_explored')).toHaveLength(1)
  expect(JSON.stringify(capture.mock.calls)).not.toContain('다음엔')
})

it('adds the interaction to Aristotle only, leaving the entrance gallery static', () => {
  expect(renderToStaticMarkup(<VisualNotebook slug="aristotle" />)).toContain('어떤 사정이 있었을까요?')
  expect(renderToStaticMarkup(<VisualNotebook slug="index" />)).not.toContain('어떤 사정이 있었을까요?')
})
