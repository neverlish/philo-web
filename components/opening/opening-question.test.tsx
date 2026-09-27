import { cleanup, fireEvent, render, screen, act } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import { OpeningQuestion } from './opening-question'

const mocks = vi.hoisted(() => ({ push: vi.fn(), capture: vi.fn(), from: vi.fn() }))
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: mocks.push }) }))
vi.mock('posthog-js/react', () => ({ usePostHog: () => ({ capture: mocks.capture }) }))
vi.mock('@/lib/supabase/client', () => ({ supabase: { from: mocks.from } }))
afterEach(() => { cleanup(); vi.useRealTimers(); vi.clearAllMocks() })

it('does not advance on a timer and requires an explicit input choice', () => {
  vi.useFakeTimers()
  render(<OpeningQuestion />)
  act(() => { vi.advanceTimersByTime(30000) })
  expect(mocks.push).not.toHaveBeenCalled()
  fireEvent.click(screen.getByRole('button', { name: '고민 이야기하기' }))
  expect(mocks.push).toHaveBeenCalledExactlyOnceWith('/opening/input')
  expect(mocks.capture).toHaveBeenCalledWith('checkin_input_clicked', { step: 'opening' })
})

it.each(['오늘은 넘기기', '홈으로'])('%s returns home without writing a check-in', (name) => {
  render(<OpeningQuestion />)
  fireEvent.click(screen.getByRole('button', { name }))
  expect(mocks.push).toHaveBeenCalledExactlyOnceWith('/')
  expect(mocks.from).not.toHaveBeenCalled()
  expect(mocks.capture).toHaveBeenCalledWith('checkin_skipped', { step: 'opening' })
})
