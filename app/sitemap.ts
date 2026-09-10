import type { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'
import { PHILOSOPHER_TYPES } from '@/lib/quiz'
import { getPhilosopherPath } from '@/lib/philosopher-slugs'
import { WISDOM_TOPIC_LIST } from '@/lib/wisdom-topics'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://philo-web.vercel.app'

  const { data: philosophers } = await supabase
    .from('philosophers')
    .select('id, name_en, updated_at')

  const philosopherUrls: MetadataRoute.Sitemap = (philosophers ?? []).map((p) => ({
    url: `${siteUrl}${getPhilosopherPath(p.id, p.name_en)}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const typeResultUrls: MetadataRoute.Sitemap = Object.keys(PHILOSOPHER_TYPES).map((key) => ({
    url: `${siteUrl}/type/result/${key}`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const wisdomUrls: MetadataRoute.Sitemap = WISDOM_TOPIC_LIST.map((topic) => ({
    url: `${siteUrl}/wisdom/${topic.slug}`,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  return [
    {
      url: siteUrl,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/type`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/wisdom`,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    ...philosopherUrls,
    ...typeResultUrls,
    ...wisdomUrls,
  ]
}
