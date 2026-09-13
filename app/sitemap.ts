import type { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'
import { PHILOSOPHER_TYPES } from '@/lib/quiz'
import { getPhilosopherPath } from '@/lib/philosopher-slugs'
import { WISDOM_TOPIC_LIST } from '@/lib/wisdom-topics'
import { PHILOSOPHER_PAGE_UPDATED_AT } from '@/lib/philosopher-guides'
import { EXPLORER_PAGES } from '@/lib/explorer/pages'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://philo-web.vercel.app'

  const { data: philosophers } = await supabase
    .from('philosophers')
    .select('id, name_en, updated_at')

  const philosopherUrls: MetadataRoute.Sitemap = (philosophers ?? []).map((p) => ({
    url: `${siteUrl}${getPhilosopherPath(p.id, p.name_en)}`,
    lastModified: new Date(Math.max(
      new Date(PHILOSOPHER_PAGE_UPDATED_AT).getTime(),
      p.updated_at ? new Date(p.updated_at).getTime() || 0 : 0,
    )),
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
    { url: `${siteUrl}/practice/control`, changeFrequency: 'monthly', priority: 0.8 },
    ...typeResultUrls,
    ...wisdomUrls,
    ...Object.values(EXPLORER_PAGES).map((page) => ({
      url: `${siteUrl}${page.path}`,
      changeFrequency: 'monthly' as const,
      priority: page.path === '/explore' ? 0.9 : 0.8,
    })),
  ]
}
