// tests/helpers/supabase.ts
import { vi } from 'vitest'

export interface MockSession {
  user: {
    id: string
    email?: string
    user_metadata?: Record<string, string>
  }
}

export const DEFAULT_SESSION: MockSession = {
  user: { id: 'user-123', email: 'test@example.com' },
}

/**
 * Supabase createClient mock factory.
 *
 * Usage in test file:
 *   vi.mock('@/lib/supabase/server-auth', () => ({ createClient: mockCreateClient }))
 *
 * Per-test override (unauthenticated):
 *   vi.mocked(createClient).mockResolvedValueOnce(makeSupabaseMock({ session: null }))
 */
export function makeSupabaseMock(options?: {
  session?: MockSession | null
  fromOverrides?: Record<string, unknown>
}) {
  const session = options?.session !== undefined ? options.session : DEFAULT_SESSION

  return {
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: { session },
      }),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      range: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
      ...options?.fromOverrides,
    }),
  }
}

export const mockCreateClient = vi.fn().mockResolvedValue(makeSupabaseMock())
