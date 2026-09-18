'use client'

import Image from 'next/image'
import type { ExplorerSlug } from '@/lib/explorer/pages'
import { visualPath, type VisualId } from '@/lib/explorer/visual-assets'
import { trackExplorer } from '@/lib/posthog/explorer-events'

export function Artwork({ visual, slug, alt }: { visual: VisualId; slug: ExplorerSlug; alt: string }) {
  return <a href={visualPath(visual)} target="_blank" rel="noopener noreferrer"
    onClick={() => trackExplorer('explorer_artwork_opened', slug, { visual_id: visual })}
    className="block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#715b3b]">
    <Image src={visualPath(visual)} alt={alt} width={1536} height={1024} sizes="(max-width: 1064px) 100vw, 1024px" className="h-auto w-full border border-[#88704b]/30" />
    <span className="flex min-h-11 items-center text-xs text-[#715b3b] underline underline-offset-4">그림 크게 보기 · 새 탭</span>
  </a>
}
