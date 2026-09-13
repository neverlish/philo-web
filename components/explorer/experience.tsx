'use client'

import { useEffect, useRef, useState } from 'react'
import type { ExplorerSlug } from '@/lib/explorer/pages'
import { installExplorerTracking, trackExplorer } from '@/lib/posthog/explorer-events'

declare global {
  interface Window {
    PhiloExplorerMounts?: Partial<Record<ExplorerSlug, (root: HTMLElement, signal: AbortSignal) => void>>
  }
}

// HTML is exclusively curated, version-controlled content, never user/AI input.
// React owns the container; the scene controller owns its static HTML descendants.
export function Experience({ slug, html }: { slug: ExplorerSlug; html: string }) {
  const root = useRef<HTMLDivElement>(null)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    const element = root.current!
    const controller = new AbortController()
    const mount = () => {
      if (controller.signal.aborted) return
      try {
        const initialize = window.PhiloExplorerMounts?.[slug]
        if (!initialize) throw new Error('Missing scene controller')
        initialize(element, controller.signal)
        installExplorerTracking(element, slug, controller.signal)
      } catch {
        controller.abort()
        setFailed(true)
        trackExplorer('explorer_load_failed', slug, { reason: 'initialization' })
      }
    }
    if (window.PhiloExplorerMounts?.[slug]) mount()
    else {
      const script = document.createElement('script')
      script.src = `/explorer/${slug}.js`
      script.onload = mount
      script.onerror = () => {
        if (controller.signal.aborted) return
        setFailed(true)
        trackExplorer('explorer_load_failed', slug, { reason: 'script_load' })
      }
      document.body.append(script)
      return () => { controller.abort(); script.onload = null; script.onerror = null; script.remove() }
    }
    return () => controller.abort()
  }, [slug])

  return <>
    {failed && <p role="alert" className="bg-[#eee4cd] p-5 text-[#322819]">장면 조작을 불러오지 못했어요. 새로고침하거나 <a href="#explorer-reading" className="underline">아래 해설을 읽어보세요.</a></p>}
    <div ref={root} className="explorer-root ph-no-capture ph-mask" data-private dangerouslySetInnerHTML={{ __html: html }} />
  </>
}
