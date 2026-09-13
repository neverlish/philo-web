import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { runInNewContext } from 'node:vm'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import content from '@/lib/explorer/content.json'
import { EXPLORER_PAGES, EXPLORER_SLUGS } from '@/lib/explorer/pages'
import { ExplorerPage, explorerMetadata } from './explorer-page'
import { installExplorerTracking } from '@/lib/posthog/explorer-events'

afterEach(() => { document.body.innerHTML = ''; delete window.PhiloExplorerMounts })
describe('public explorer', () => {
  it.each(EXPLORER_SLUGS)('%s has crawlable content, metadata and deployable assets', slug => {
    const page = EXPLORER_PAGES[slug], html = renderToStaticMarkup(<ExplorerPage slug={slug} />)
    expect(explorerMetadata(slug).alternates?.canonical).toBe(page.path)
    expect(html).toContain(page.paragraphs[0])
    expect(html).toContain('application/ld+json')
    expect(content[slug].html).not.toMatch(/<script|philosophy-assets|philosophy-explorer-|미공개|로컬 시안/)
    expect(content[slug].css).not.toMatch(/(?:^|\})\s*(?:html|body)\{/)
    for (const asset of content[slug].html.matchAll(/src="(\/explorer\/[^"]+)"/g)) expect(existsSync(resolve(process.cwd(), 'public' + asset[1]))).toBe(true)
  })
  it.each(EXPLORER_SLUGS)('%s initializes real controls and cleans up before remount', slug => {
    document.body.innerHTML = `<div class="explorer-root">${content[slug].html}</div>`
    const root = document.querySelector<HTMLElement>('.explorer-root')!
    runInNewContext(readFileSync(resolve(process.cwd(), `public/explorer/${slug}.js`), 'utf8'), {
      window, document, location: { href: '' },
      matchMedia: () => ({ matches: false, addEventListener: vi.fn() }),
      ResizeObserver: class { observe() {} disconnect() {} },
    })
    const first = new AbortController(), capture = vi.fn()
    window.PhiloExplorerMounts![slug]!(root, first.signal)
    installExplorerTracking(root, slug, first.signal, capture)
    first.abort()
    const second = new AbortController()
    window.PhiloExplorerMounts![slug]!(root, second.signal)
    installExplorerTracking(root, slug, second.signal, capture)
    const button = root.querySelector<HTMLButtonElement>('#motion')!
    button.click()
    expect(button.getAttribute('aria-pressed')).toBe('true')
    expect(root.classList.contains('motion-off')).toBe(true)
    expect(capture.mock.calls.filter(([event]) => event === 'explorer_motion_toggled')).toHaveLength(1)
    second.abort()
  })
})
