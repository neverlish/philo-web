import type { JourneyItem } from "@/app/journey/page"

export interface MonthGroup {
  label: string
  count: number
  items: JourneyItem[]
}

export function groupByMonth(items: JourneyItem[]): MonthGroup[] {
  const map = new Map<string, JourneyItem[]>()
  for (const item of items) {
    const date = new Date(item.createdAt)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(item)
  }
  return Array.from(map.entries()).map(([key, groupItems]) => {
    const [year, month] = key.split('-')
    return { label: `${year}년 ${parseInt(month)}월`, count: groupItems.length, items: groupItems }
  })
}

export function getUniquePhilosophers(items: JourneyItem[]) {
  const countMap = new Map<string, number>()
  for (const item of items) {
    countMap.set(item.philosopherName, (countMap.get(item.philosopherName) ?? 0) + 1)
  }
  const seen = new Set<string>()
  return items
    .filter((item) => {
      if (seen.has(item.philosopherName)) return false
      seen.add(item.philosopherName)
      return true
    })
    .map((item) => ({
      name: item.philosopherName,
      school: item.philosopherSchool,
      count: countMap.get(item.philosopherName) ?? 1,
      initials: item.philosopherName.slice(0, 2),
    }))
}

export function getThemeInsights(items: JourneyItem[]): [string, number][] {
  const count = new Map<string, number>()
  for (const item of items) {
    for (const tag of item.themeTags ?? []) {
      count.set(tag, (count.get(tag) ?? 0) + 1)
    }
  }
  return Array.from(count.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5)
}
