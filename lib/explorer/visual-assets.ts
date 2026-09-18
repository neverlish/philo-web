import type { ExplorerSlug } from './pages'

export const VISUAL_IDS = ['plato', 'aristotle', 'descartes', 'academy'] as const
export type VisualId = typeof VISUAL_IDS[number]
export const EXPLORER_UPDATED_AT = '2026-09-18'
export const visualPath = (id: VisualId) => `/explorer/${id}-scene-v1.webp`
export const PAGE_VISUALS: Record<ExplorerSlug, readonly VisualId[]> = {
  index: ['plato', 'aristotle', 'descartes'],
  plato: ['plato'], aristotle: ['aristotle'], descartes: ['descartes'],
  map: ['academy'], compare: ['plato', 'descartes'],
}
