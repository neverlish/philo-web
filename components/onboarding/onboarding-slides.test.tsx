import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import { OnboardingSlides } from './onboarding-slides'

vi.mock('posthog-js/react', () => ({ usePostHog: () => undefined }))
afterEach(() => { cleanup(); vi.unstubAllGlobals() })

it('guides from an everyday experience to optional reflection storage', async () => {
  const done = vi.fn(), setItem = vi.fn()
  vi.stubGlobal('localStorage', { setItem })
  render(<OnboardingSlides onDone={done} />)
  expect(screen.getByRole('dialog')).toHaveAccessibleName(/마음에 남은 일/)
  fireEvent.click(screen.getByRole('button', { name: '다음' }))
  await waitFor(() => expect(screen.getByText(/내 생각 옆에/)).toBeVisible())
  fireEvent.click(screen.getByRole('button', { name: '다음' }))
  await waitFor(() => expect(screen.getByText(/작은 질문 하나를/)).toBeVisible())
  expect(screen.getByText(/원할 때만 이 기기에 저장/)).toBeVisible()
  fireEvent.click(screen.getByRole('button', { name: '내 하루에서 시작하기' }))
  expect(setItem).toHaveBeenCalledWith('philo_onboarding_v1', '1')
  expect(done).toHaveBeenCalledOnce()
})

it('still dismisses when browser storage is blocked', () => {
  vi.stubGlobal('localStorage', { setItem: () => { throw new Error('blocked') } })
  const done = vi.fn()
  render(<OnboardingSlides onDone={done} />)
  fireEvent.click(screen.getByRole('button', { name: '건너뛰기' }))
  expect(done).toHaveBeenCalledOnce()
})
