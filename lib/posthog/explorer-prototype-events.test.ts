import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { runInNewContext } from 'node:vm'
import { Window } from 'happy-dom'
import { describe, expect, it, vi } from 'vitest'

const source = readFileSync(resolve(process.cwd(), 'lib/posthog/explorer-prototype-events.js'), 'utf8')
function setup(page: string, html: string) {
  const window = new Window({ url: 'file:///prototype.html' })
  window.document.body.innerHTML = `<script data-explorer="${page}"></script>${html}`
  const capture = vi.fn()
  Object.assign(window, { posthog: { capture } })
  runInNewContext(source, { window, document: window.document, location: window.location, URL: window.URL, Element: window.Element, CustomEvent: window.CustomEvent, structuredClone })
  const analytics = (window as unknown as { PhiloExplorerAnalytics: { getEvents(): Array<{ event: string; properties: Record<string, unknown> }> } }).PhiloExplorerAnalytics
  const click = (selector: string) => (window.document.querySelector(selector) as unknown as HTMLElement).click()
  return { window, analytics, click, capture }
}
describe('prototype analytics', () => {
  it('does not collect answers or send events to an available SDK', () => {
    const { click, analytics, capture } = setup('aristotle', '<button data-reply="PRIVATE ANSWER">PRIVATE TEXT</button>')
    click('button'); click('button')
    const events = analytics.getEvents()
    expect(events.filter(e => e.event === 'explorer_started')).toHaveLength(1)
    expect(events.filter(e => e.event === 'explorer_answer_selected')).toHaveLength(2)
    expect(JSON.stringify(events)).not.toContain('PRIVATE')
    expect(events.every(e => e.properties.environment === 'prototype')).toBe(true)
    expect(capture).not.toHaveBeenCalled()
  })
  it('allowlists navigation destinations and never records query strings', () => {
    const { click, analytics } = setup('heritage', '<a href="philosophy-explorer-aristotle.html?concern=PRIVATE">private label</a>')
    click('a')
    expect(analytics.getEvents().at(-1)?.properties.destination).toBe('aristotle')
    expect(JSON.stringify(analytics.getEvents())).not.toContain('PRIVATE')
  })
  it('counts full traversal once, not a jump to the last scene', () => {
    const { window, click, analytics } = setup('compare', '<div class="pair" data-phase="2"></div><button id="next">next</button>')
    click('button')
    expect(analytics.getEvents().some(e => e.event === 'explorer_sequence_traversed')).toBe(false)
    window.document.querySelector('.pair')!.setAttribute('data-phase', '1')
    click('button'); click('button')
    expect(analytics.getEvents().filter(e => e.event === 'explorer_sequence_traversed')).toHaveLength(1)
  })
  it('bounds the in-memory buffer', () => {
    const { click, analytics } = setup('aristotle', '<button data-reply="0">answer</button>')
    for (let i = 0; i < 250; i++) click('button')
    expect(analytics.getEvents()).toHaveLength(200)
  })
})
