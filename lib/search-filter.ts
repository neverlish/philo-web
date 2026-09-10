export const SEARCH_FILTERS = [
  { value: 'all', label: '전체' },
  { value: 'philosophers', label: '철학자' },
  { value: 'quotes', label: '명언' },
  { value: 'topics', label: '가이드' },
] as const

export type SearchFilter = (typeof SEARCH_FILTERS)[number]['value']

export function parseSearchFilter(value: unknown): SearchFilter {
  return SEARCH_FILTERS.find((filter) => filter.value === value)?.value ?? 'all'
}
