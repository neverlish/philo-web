import { renderToStaticMarkup } from 'react-dom/server'
import { expect, it } from 'vitest'
import Page, { metadata } from './page'
it('server renders explanatory content, related links and valid page/breadcrumb JSON-LD', () => {
  const html = renderToStaticMarkup(<Page />)
  expect(metadata.alternates?.canonical).toBe('/practice/friendship')
  expect(metadata.twitter).toHaveProperty('card', 'summary_large_image')
  expect(html).toContain('친구와의 갈등을 철학으로 살펴보는 방법')
  expect(html).toContain('href="/practice/control"')
  const json = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)![1])
  expect(json['@graph'].map((item: Record<string, unknown>) => item['@type'])).toEqual(['WebPage', 'BreadcrumbList'])
})
