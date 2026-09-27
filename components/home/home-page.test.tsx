import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { HomePage } from './home-page'

const mocks = vi.hoisted(() => ({
  auth: { user: null as { id: string } | null, loading: false },
  push: vi.fn(), capture: vi.fn(), track: vi.fn(), from: vi.fn(),
  today: vi.fn(), gte: vi.fn(),
}))
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: mocks.push }) }))
vi.mock('@/contexts/AuthContext', () => ({ useAuth: () => mocks.auth }))
vi.mock('posthog-js/react', () => ({ usePostHog: () => ({ capture: mocks.capture }) }))
vi.mock('@/lib/posthog/home-practice-events', () => ({ trackHomePractice: mocks.track }))
vi.mock('@/lib/supabase/client', () => ({ supabase: { from: mocks.from } }))
vi.mock('@/components/navigation/header', () => ({ Header: () => null }))
vi.mock('@/components/navigation/bottom-nav', () => ({ BottomNav: () => null }))
vi.mock('@/components/home/philosophers-list', () => ({ PhilosophersList: () => <div>철학자 탐색</div> }))
vi.mock('@/components/home/reflection-card', () => ({ ReflectionCard: () => null }))
vi.mock('@/components/home/concern-sheet', () => ({ ConcernSheet: () => null }))
vi.mock('@/components/home/everyday-philosophy', () => ({ EverydayPhilosophy: () => <h1>철학 둘러보기</h1> }))
vi.mock('@/components/onboarding/onboarding-slides', () => ({ OnboardingSlides: () => null, useOnboarding: () => ({ show: false, done: vi.fn() }) }))

beforeEach(() => {
  mocks.auth = { user: null, loading: false }
  mocks.today.mockResolvedValue({ data: null, error: null })
  mocks.from.mockImplementation(() => {
    let today = false
    const query = {
      select: (columns: string) => { today = columns === 'id, title, philosopher_name, quote_text'; return query },
      eq: () => query,
      gte: (...args: unknown[]) => { mocks.gte(...args); return query },
      lte: () => query, order: () => query, limit: () => query,
      maybeSingle: () => today ? mocks.today() : Promise.resolve({ data: null }),
      then: (resolve: (result: { data: never[] }) => unknown) => Promise.resolve({ data: [] }).then(resolve),
    }
    return query
  })
})
afterEach(() => { cleanup(); vi.clearAllMocks() })

it.each([null, { id: 'test-user' }])('keeps the home accessible without a check-in for %j', async (user) => {
  mocks.auth.user = user
  render(<HomePage initialPhilosophers={[]} initialHasMore={false} />)
  expect(screen.getByText('철학 둘러보기')).toBeVisible()
  expect(screen.getByText('철학자 탐색')).toBeVisible()
  await waitFor(() => expect(mocks.capture).toHaveBeenCalledWith('home_viewed', expect.any(Object)))
  expect(mocks.push).not.toHaveBeenCalled()
  const link = screen.getByRole('link', { name: '내 마음을 이야기하고 싶다면' })
  expect(link).toHaveAttribute('href', '/opening')
  fireEvent.click(link)
  expect(mocks.track).toHaveBeenCalledWith('home_checkin_clicked')
})

it('keeps browsing available during authentication and after signed-out resolution', async () => {
  mocks.auth.loading = true
  const view = render(<HomePage initialPhilosophers={[]} initialHasMore={false} />)
  expect(screen.getByText('철학자 탐색')).toBeVisible()
  expect(mocks.from).not.toHaveBeenCalled()
  mocks.auth.loading = false
  view.rerender(<HomePage initialPhilosophers={[]} initialHasMore={false} />)
  await waitFor(() => expect(mocks.capture).toHaveBeenCalledWith('home_viewed', expect.any(Object)))
  expect(mocks.push).not.toHaveBeenCalled()
})

it.each(['returned', 'thrown'])('does not redirect or block browsing on a %s record error', async (mode) => {
  mocks.auth.user = { id: 'test-user' }
  if (mode === 'returned') mocks.today.mockResolvedValue({ data: null, error: { message: 'unavailable' } })
  else mocks.today.mockRejectedValue(new Error('offline'))
  render(<HomePage initialPhilosophers={[]} initialHasMore={false} />)
  await waitFor(() => expect(mocks.capture).toHaveBeenCalledWith('home_viewed', expect.any(Object)))
  expect(screen.getByText('철학자 탐색')).toBeVisible()
  expect(mocks.push).not.toHaveBeenCalled()
  expect(mocks.gte).toHaveBeenCalledWith('created_at', expect.stringMatching(/T00:00:00\+09:00$/))
})
