const CANONICAL_SLUG_BY_NAME: Record<string, string> = {
  'Siddhartha Gautama': 'buddha',
  'Jean-Paul Sartre': 'sartre',
  'Erich Fromm': 'erich-fromm',
  Confucius: 'confucius',
  Zhuangzi: 'zhuangzi',
  Socrates: 'socrates',
  Plato: 'plato',
  Aristotle: 'aristotle',
  Epictetus: 'epictetus',
  'René Descartes': 'descartes',
  'Baruch Spinoza': 'spinoza',
  'Immanuel Kant': 'kant',
  'Arthur Schopenhauer': 'schopenhauer',
  'Friedrich Nietzsche': 'nietzsche',
  'Martin Heidegger': 'heidegger',
  'Albert Camus': 'camus',
  Seneca: 'seneca',
  Epicurus: 'epicurus',
  Laozi: 'laozi',
  'Marcus Aurelius': 'marcus-aurelius',
}

export function getPhilosopherSlug(nameEn: string): string {
  const canonicalSlug = CANONICAL_SLUG_BY_NAME[nameEn]
  if (canonicalSlug) return canonicalSlug

  return nameEn
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function getPhilosopherPath(id: string, nameEn: string): string {
  const slug = getPhilosopherSlug(nameEn)
  return `/philosopher/${slug || id}`
}

export function isPhilosopherId(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}
