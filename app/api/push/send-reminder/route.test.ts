import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockSendNotification = vi.fn()
const mockSelect = vi.fn()
const mockDeleteEq = vi.fn()

vi.mock('web-push', () => ({
  default: {
    setVapidDetails: vi.fn(),
    sendNotification: mockSendNotification,
  },
}))

vi.mock('@/lib/supabase/server-auth', () => ({
  createClient: vi.fn(() => ({
    from: (table: string) => {
      if (table === 'push_subscriptions') {
        return {
          select: () => ({
            not: () => Promise.resolve({ data: mockSelect(), error: null }),
          }),
          delete: () => ({ eq: () => ({ eq: mockDeleteEq }) }),
        }
      }
      return {}
    },
  })),
}))

describe('POST /api/push/send-reminder', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
    process.env = {
      ...OLD_ENV,
      CRON_SECRET: 'test-secret',
      VAPID_PUBLIC_KEY: 'pubkey',
      VAPID_PRIVATE_KEY: 'privkey',
      VAPID_EMAIL: 'mailto:test@test.com',
    }
  })

  it('401 if missing cron secret', async () => {
    const { POST } = await import('./route')
    const req = new Request('http://localhost/api/push/send-reminder', {
      method: 'POST',
      headers: { Authorization: 'Bearer wrong-secret' },
    })
    const res = await POST(req)
    expect(res.status).toBe(401)
  })

  it('200 and sends notifications to subscribers', async () => {
    mockSelect.mockReturnValue([
      { endpoint: 'https://e.com', p256dh: 'key', auth: 'auth', user_id: 'u1' },
    ])
    mockSendNotification.mockResolvedValue({})

    const { POST } = await import('./route')
    const req = new Request('http://localhost/api/push/send-reminder', {
      method: 'POST',
      headers: { Authorization: 'Bearer test-secret' },
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
    expect(mockSendNotification).toHaveBeenCalledTimes(1)
  })

  it('200 with 0 sent if no subscribers', async () => {
    mockSelect.mockReturnValue([])

    const { POST } = await import('./route')
    const req = new Request('http://localhost/api/push/send-reminder', {
      method: 'POST',
      headers: { Authorization: 'Bearer test-secret' },
    })
    const res = await POST(req)
    const body = await res.json()
    expect(res.status).toBe(200)
    expect(body.sent).toBe(0)
  })
})
