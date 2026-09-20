'use client'

import Image from 'next/image'
import type { ExplorerSlug } from '@/lib/explorer/pages'
import { visualPath, type VisualId } from '@/lib/explorer/visual-assets'
import { trackExplorer } from '@/lib/posthog/explorer-events'

export function Artwork({ visual, slug, alt }: { visual: VisualId; slug: ExplorerSlug; alt: string }) {
  return <a href={visualPath(visual)} target="_blank" rel="noopener noreferrer"
    onClick={() => trackExplorer('explorer_artwork_opened', slug, { visual_id: visual })}
    className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#35463d]">
    <span className="block border border-[#35463d]/15 bg-[#e7e4dc] p-3 sm:p-6">
      <Image src={visualPath(visual)} alt={alt} width={1536} height={1024} sizes="(max-width: 1064px) 100vw, 1024px" className="h-auto w-full" />
    </span>
    <span className="flex min-h-11 items-center justify-end gap-3 text-xs text-[#535d53] underline-offset-4 group-hover:underline">그림 크게 보기 · 새 탭 <span aria-hidden="true">↗</span></span>
  </a>
}
