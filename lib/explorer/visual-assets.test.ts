import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { expect, it, vi } from 'vitest'
import { EXPLORER_SLUGS, EXPLORER_PAGES } from './pages'
import { PAGE_VISUALS, visualPath, EXPLORER_UPDATED_AT } from './visual-assets'
import { explorerMetadata } from '@/components/explorer/explorer-page'
import sitemap from '@/app/sitemap'

vi.mock('@/lib/supabase', () => ({ supabase: { from: () => ({ select: async () => ({ data: [] }) }) } }))
it.each(EXPLORER_SLUGS)('%s has existing share images and image sitemap entries', async slug => {
  const images = PAGE_VISUALS[slug].map(visualPath)
  for (const image of images) expect(existsSync(resolve(process.cwd(), `public${image}`))).toBe(true)
  expect(explorerMetadata(slug).openGraph?.images).toEqual(expect.arrayContaining([expect.objectContaining({ url: images[0] })]))
  const entry = (await sitemap()).find(item => item.url.endsWith(EXPLORER_PAGES[slug].path))!
  expect(entry.lastModified).toBe(EXPLORER_UPDATED_AT)
  expect(entry.images).toHaveLength(images.length)
  images.forEach((image, index) => expect(entry.images?.[index]).toMatch(new RegExp(`${image}$`)))
})
