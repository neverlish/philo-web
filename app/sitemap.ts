import type { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://philoapp.kr'

  const { data: philosophers } = await supabase
    .from('philosophers')
    .select('id, updated_at')

  const philosopherUrls: MetadataRoute.Sitemap = (philosophers ?? []).map((p) => ({
    url: `${siteUrl}/philosopher/${p.id}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...philosopherUrls,
  ]
}
