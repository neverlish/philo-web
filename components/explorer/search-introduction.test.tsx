import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { ExplorerPage, explorerMetadata } from './explorer-page'
import { SEARCH_INTENTS } from '@/lib/explorer/search-intents'
import { SearchIntroduction, SearchQuestions } from './search-introduction'

describe('search entry content', () => {
  it.each(['plato', 'aristotle', 'descartes'] as const)('%s serves answers before the scene without duplicating the main heading', slug => {
    const html = renderToStaticMarkup(<ExplorerPage slug={slug} />)
    expect(html).toContain(SEARCH_INTENTS[slug].answer)
    expect(html.indexOf(SEARCH_INTENTS[slug].answer)).toBeLessThan(html.indexOf('class="explorer-root'))
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1)
    expect(html).toContain('원전의 직접 인용이 아닙니다')
    for (const [question, answer] of SEARCH_INTENTS[slug].questions) {
      expect(html).toContain(question)
      expect(html).toContain(answer)
    }
    expect(explorerMetadata(slug).alternates?.canonical).toBe(`/explore/${slug}`)
  })
  it('does not add unrelated introductions to the map', () => {
    expect(renderToStaticMarkup(<SearchIntroduction slug="map" />)).toBe('')
    expect(renderToStaticMarkup(<SearchQuestions slug="map" />)).toBe('')
  })
})
