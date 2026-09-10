import { unstable_cache } from 'next/cache'
import { createPublicClient } from '@/lib/supabase/public'
import type { SearchableQuote } from '@/lib/content-search'

export const getCachedSearchQuotes = unstable_cache(
  async (): Promise<SearchableQuote[]> => {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('quotes')
      .select('id, text, meaning, application, category, book, concerns, philosopher_id, philosophers(name, name_en)')
      .order('created_at', { ascending: false })

    if (error) throw error

    return (data ?? []).map((quote) => {
      const philosopher = quote.philosophers as { name: string; name_en: string } | null

      return {
        id: quote.id,
        philosopherId: quote.philosopher_id,
        philosopherName: philosopher?.name ?? '철학자',
        philosopherNameEn: philosopher?.name_en ?? '',
        text: quote.text,
        meaning: quote.meaning,
        application: quote.application,
        category: quote.category,
        book: quote.book,
        concerns: quote.concerns,
      }
    })
  },
  ['search-quotes'],
  { revalidate: 3600 },
)
