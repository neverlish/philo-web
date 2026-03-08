import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { AuthProvider, useAuth } from '@/contexts/AuthProvider'
import { supabase } from '@/lib/supabase/client'

// Mock Supabase client
vi.mock('@/lib/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      signInWithOAuth: vi.fn(),
      signOut: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
    },
  },
}))

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: null },
      error: null,
    } as any)
  })

  it('provides auth context with initial null user', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    expect(result.current).toBeDefined()
    expect(result.current.signInWithGoogle).toBeInstanceOf(Function)
    expect(result.current.signOut).toBeInstanceOf(Function)
  })

  it('calls signInWithOAuth with google provider', async () => {
    vi.mocked(supabase.auth.signInWithOAuth).mockResolvedValue({
      data: { provider: 'google', url: 'https://google.com' },
      error: null,
    } as any)

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    await act(async () => {
      await result.current.signInWithGoogle()
    })

    expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
      provider: 'google',
      options: {
        redirectTo: expect.stringContaining('/auth/callback'),
      },
    })
  })

  it('calls signOut', async () => {
    vi.mocked(supabase.auth.signOut).mockResolvedValue({ error: null })

    const reload = vi.fn()
    Object.defineProperty(window, 'location', {
      value: { ...window.location, reload },
      writable: true,
    })

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    await act(async () => {
      await result.current.signOut()
    })

    expect(supabase.auth.signOut).toHaveBeenCalled()
    expect(reload).toHaveBeenCalled()
  })
})
