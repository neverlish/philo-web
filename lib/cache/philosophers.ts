import { unstable_cache } from 'next/cache'
import { createPublicClient } from '@/lib/supabase/public'
import type { PhilosopherItem } from '@/app/journey/page'

export const getCachedPhilosophers = unstable_cache(
  async (): Promise<PhilosopherItem[]> => {
    const supabase = createPublicClient()
    const { data } = await supabase
      .from('philosophers')
      .select('id, name, era, region, years, keywords, core_idea')
      .order('era')
      .order('name')

    return (data ?? []).map((p) => ({
      id: p.id,
      name: p.name,
      era: p.era,
      region: p.region,
      years: p.years,
      keywords: p.keywords as string[] | null,
      coreIdea: p.core_idea,
    }))
  },
  ['philosophers-list'],
  { revalidate: 3600 } // 1시간 캐시 (철학자 데이터는 거의 변하지 않음)
)
