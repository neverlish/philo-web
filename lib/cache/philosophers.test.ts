import { beforeEach, describe, expect, it, vi } from 'vitest'

const { result } = vi.hoisted(() => ({ result: vi.fn() }))
vi.mock('next/cache', () => ({ unstable_cache: (callback: () => unknown) => callback }))
vi.mock('@/lib/supabase/public', () => ({
  createPublicClient: () => ({
    from: () => ({ select: () => ({ order: () => ({ order: result }) }) }),
  }),
}))

import { getCachedPhilosophers } from './philosophers'

beforeEach(() => result.mockReset())

describe('public philosopher cache', () => {
  it('rejects a failed query so failures cannot be cached as an empty catalogue', async () => {
    const error = new Error('Service unavailable')
    result.mockResolvedValue({ data: null, error })
    await expect(getCachedPhilosophers()).rejects.toBe(error)
  })

  it('accepts an actually empty catalogue', async () => {
    result.mockResolvedValue({ data: [], error: null })
    await expect(getCachedPhilosophers()).resolves.toEqual([])
  })
})
