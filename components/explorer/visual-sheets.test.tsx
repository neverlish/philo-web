import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { RelationshipPlate } from './relationship-plate'
import { ComparisonSheet } from './comparison-sheet'
import { ExplorerPage } from './explorer-page'

describe('visual reference sheets', () => {
  it('distinguishes historical learning from editorial comparison in text', () => {
    const html = renderToStaticMarkup(<RelationshipPlate />)
    expect(html).toContain('실제로 배운 사이')
    expect(html).toContain('제작진의 비교')
    expect(html).toContain('border-dashed')
    expect(html).toContain('AI 생성 상상화')
    expect(html).toContain('loading="lazy"')
    expect(existsSync(resolve(process.cwd(), 'public/explorer/academy-scene-v2.webp'))).toBe(true)
  })
  it('provides a semantic comparison table with row and column headers', () => {
    const html = renderToStaticMarkup(<ComparisonSheet />)
    expect(html).toContain('<caption')
    expect(html.match(/scope="row"/g)).toHaveLength(3)
    expect(html.match(/scope="col"/g)).toHaveLength(3)
    expect(html).toContain('직접 영향 관계를 뜻하지 않습니다')
  })
  it('attaches the relevant reference to each public route', () => {
    expect(renderToStaticMarkup(<ExplorerPage slug="map" />)).toContain('id="relationship-plate-title"')
    expect(renderToStaticMarkup(<ExplorerPage slug="compare" />)).toContain('id="comparison-sheet-title"')
    expect(renderToStaticMarkup(<ExplorerPage slug="plato" />)).not.toContain('id="relationship-plate-title"')
  })
})
