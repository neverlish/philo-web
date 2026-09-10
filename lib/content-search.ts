import type { WisdomTopic } from '@/lib/wisdom-topics'

export interface SearchablePhilosopher {
  id: string
  name: string
  nameEn: string
  era: string
  region: string
  years: string | null
  keywords: string[] | null
  coreIdea: string
}

export interface ContentSearchResults {
  philosophers: SearchablePhilosopher[]
  topics: WisdomTopic[]
}

function normalize(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('ko-KR')
    .replace(/\s+/g, ' ')
    .trim()
}

function matchScore(query: string, primary: string[], secondary: string[]) {
  const normalizedPrimary = primary.map(normalize)
  const normalizedSecondary = secondary.map(normalize)
  const haystack = [...normalizedPrimary, ...normalizedSecondary].join(' ')
  const tokens = query.split(' ').filter(Boolean)

  if (!tokens.every((token) => haystack.includes(token))) return 0
  if (normalizedPrimary.some((value) => value === query)) return 100
  if (normalizedPrimary.some((value) => value.startsWith(query))) return 80
  if (normalizedPrimary.some((value) => value.includes(query))) return 65
  if (normalizedSecondary.some((value) => value === query)) return 55
  if (normalizedSecondary.some((value) => value.includes(query))) return 40
  return 20
}

export function searchContent(
  rawQuery: string,
  philosophers: SearchablePhilosopher[],
  topics: WisdomTopic[],
): ContentSearchResults {
  const query = normalize(rawQuery)
  if (!query) return { philosophers: [], topics: [] }

  const rankedPhilosophers = philosophers
    .map((philosopher) => ({
      item: philosopher,
      score: matchScore(
        query,
        [philosopher.name, philosopher.nameEn],
        [
          philosopher.era,
          philosopher.region,
          philosopher.years ?? '',
          philosopher.coreIdea,
          ...(philosopher.keywords ?? []),
        ],
      ),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name, 'ko'))
    .map(({ item }) => item)

  const rankedTopics = topics
    .map((topic) => ({
      item: topic,
      score: matchScore(
        query,
        [topic.shortTitle, topic.title, topic.eyebrow],
        [
          topic.description,
          topic.lead,
          ...topic.sections.flatMap((section) => [section.title, ...section.paragraphs]),
          ...topic.practices.flatMap((practice) => [practice.title, practice.description]),
          ...topic.philosophers.flatMap((philosopher) => [philosopher.name, philosopher.idea]),
        ],
      ),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title, 'ko'))
    .map(({ item }) => item)

  return { philosophers: rankedPhilosophers, topics: rankedTopics }
}
