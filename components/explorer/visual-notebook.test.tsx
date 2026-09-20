import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { VisualNotebook } from './visual-notebook'

describe('visual notebook', () => {
  it.each(['plato', 'aristotle', 'descartes'] as const)('%s has a deployable illustration and accessible explanation', slug => {
    const html = renderToStaticMarkup(<VisualNotebook slug={slug} />)
    expect(existsSync(resolve(process.cwd(), `public/explorer/${slug}-scene-v2.webp`))).toBe(true)
    expect(html).toContain('loading="lazy"')
    expect(html).toContain('AI 생성 상상화 · 역사적 복원 아님')
    expect(html).toContain('원전의 직접 인용이 아닙니다')
    expect(html).toContain('<figcaption')
    expect(html).not.toContain('alt=""')
    expect(html).toContain(slug === 'aristotle' ? '<ul' : '<ol')
  })
  it('shows three plates in the entrance and two in the comparison', () => {
    expect(renderToStaticMarkup(<VisualNotebook slug="index" />).match(/<figure>/g)).toHaveLength(3)
    expect(renderToStaticMarkup(<VisualNotebook slug="compare" />).match(/<figure>/g)).toHaveLength(2)
  })
  it('leaves the existing relationship visualization uncluttered', () => {
    expect(renderToStaticMarkup(<VisualNotebook slug="map" />)).toBe('')
  })
})
