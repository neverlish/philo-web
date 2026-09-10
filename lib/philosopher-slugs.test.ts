import { describe, expect, it } from 'vitest'
import { getPhilosopherPath, getPhilosopherSlug, isPhilosopherId } from './philosopher-slugs'

describe('philosopher slugs', () => {
  it('uses concise canonical slugs for known philosophers', () => {
    expect(getPhilosopherSlug('Friedrich Nietzsche')).toBe('nietzsche')
    expect(getPhilosopherSlug('Marcus Aurelius')).toBe('marcus-aurelius')
    expect(getPhilosopherSlug('René Descartes')).toBe('descartes')
  })

  it('creates a normalized fallback slug for a new philosopher', () => {
    expect(getPhilosopherSlug('Simone de Beauvoir')).toBe('simone-de-beauvoir')
  })

  it('falls back to the id when an English name is unavailable', () => {
    expect(getPhilosopherPath('abc-123', '')).toBe('/philosopher/abc-123')
  })

  it('recognizes UUID philosopher ids', () => {
    expect(isPhilosopherId('dd8df85e-4007-4af3-9516-6b0f25482eca')).toBe(true)
    expect(isPhilosopherId('nietzsche')).toBe(false)
  })
})
