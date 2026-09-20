import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import { PlatoLooking } from './plato-looking'

const { capture } = vi.hoisted(() => ({ capture: vi.fn() }))
vi.mock('@/lib/posthog/explorer-events', () => ({ trackExplorer: capture }))
afterEach(() => { cleanup(); vi.clearAllMocks() })

it('reveals with buttons and does not recount milestones after reset', () => {
  render(<PlatoLooking />)
  expect(capture).not.toHaveBeenCalled()
  expect(screen.getByRole('button', { name: '← 그림자 쪽' })).toBeDisabled()
  const right = screen.getByRole('button', { name: '물체 쪽 →' })
  fireEvent.click(right); fireEvent.click(right)
  expect(screen.getByRole('slider')).toHaveValue('50')
  expect(capture).toHaveBeenCalledExactlyOnceWith('explorer_looking_started', 'plato')
  fireEvent.click(right)
  expect(screen.getByRole('status')).toHaveTextContent('그림자만 보고')
  fireEvent.click(right)
  expect(right).toBeDisabled()
  fireEvent.click(screen.getByRole('button', { name: '처음 시선으로 돌아가기' }))
  expect(screen.getByRole('slider')).toHaveValue('0')
  fireEvent.change(screen.getByRole('slider'), { target: { value: '100' } })
  expect(capture.mock.calls.map(([event]) => event)).toEqual(['explorer_looking_started', 'explorer_looking_revealed', 'explorer_looking_reset'])
})

it('updates the actual painting position through the native range control', () => {
  render(<PlatoLooking />)
  fireEvent.change(screen.getByRole('slider'), { target: { value: '100' } })
  expect(screen.getByRole('img').style.transform).not.toBe('translateX(-0%)')
  expect(screen.getByRole('slider')).toHaveAttribute('aria-valuetext', '물체가 보이는 쪽')
  expect(screen.getByRole('link', { name: /그림 전체 보기/ })).toHaveAttribute('href', '/explorer/plato-scene-v2.webp')
})
