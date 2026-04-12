import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/philosopher/'],
        disallow: [
          '/opening/',
          '/prescription/',
          '/saved',
          '/profile/',
          '/journey',
          '/collective',
        ],
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://philoapp.kr'}/sitemap.xml`,
  }
}
