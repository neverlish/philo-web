import { beforeEach, expect, it, vi } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import type { ReactNode } from 'react'
import { NextRequest } from 'next/server'
import { AI_INTERPRETATION_LABEL } from './prescription-provenance'

const mocks = vi.hoisted(() => ({ single: vi.fn(), eq: vi.fn(), session: vi.fn() }))
vi.mock('next/og', () => ({ ImageResponse: class extends Response {
  constructor(element: ReactNode) { super(renderToStaticMarkup(element)) }
} }))
vi.mock('@supabase/supabase-js', () => ({ createClient: () => {
  const query = { select: () => query, eq: (...args: unknown[]) => { mocks.eq(...args); return query }, single: mocks.single }
  return { from: () => query }
} }))
vi.mock('@/lib/supabase/server-auth', () => ({ createClient: async () => {
  const query = { select: () => query, eq: (...args: unknown[]) => { mocks.eq(...args); return query }, single: mocks.single }
  return { from: () => query, auth: { getSession: mocks.session } }
} }))

import ShareOgImage from '@/app/share/[id]/opengraph-image'
import { GET } from '@/app/api/prescriptions/[id]/image/route'
beforeEach(() => {
  vi.clearAllMocks()
  mocks.single.mockResolvedValue({ data: { quote_text: '기존 AI 문장', philosopher_name: '철학자', philosopher_school: '학파', philosopher_era: '시대', title: '제목' }, error: null })
  mocks.session.mockResolvedValue({ data: { session: { user: { id: 'owner' } } } })
})
it('carries provenance in the OG image render tree for legacy records', async () => {
  const response = await ShareOgImage({ params: Promise.resolve({ id: 'legacy' }) })
  const html = await response.text()
  expect(html).toContain(AI_INTERPRETATION_LABEL)
  expect(html).toContain('참고한 철학자 · 철학자')
  expect(html).not.toContain('— 철학자')
})
it('carries provenance in the downloadable image and keeps owner filtering', async () => {
  const response = await GET(new NextRequest('https://example.com'), { params: Promise.resolve({ id: 'legacy' }) })
  expect(await response.text()).toContain(AI_INTERPRETATION_LABEL)
  expect(mocks.eq).toHaveBeenCalledWith('user_id', 'owner')
})
it('still rejects unauthenticated image downloads', async () => {
  mocks.session.mockResolvedValue({ data: { session: null } })
  const response = await GET(new NextRequest('https://example.com'), { params: Promise.resolve({ id: 'legacy' }) })
  expect(response.status).toBe(401)
  expect(mocks.single).not.toHaveBeenCalled()
})
