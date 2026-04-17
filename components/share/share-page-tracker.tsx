"use client"

import { useEffect } from "react"
import { usePostHog } from "posthog-js/react"
import Link from "next/link"
import { Mic } from "lucide-react"

export function SharePageTracker({ prescriptionId }: { prescriptionId: string }) {
  const posthog = usePostHog()

  useEffect(() => {
    posthog?.capture("share_page_viewed", { prescription_id: prescriptionId })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prescriptionId])

  return null
}

export function SharePageCTA({ prescriptionId }: { prescriptionId: string }) {
  const posthog = usePostHog()

  return (
    <Link
      href="/opening"
      onClick={() => posthog?.capture("share_page_cta_clicked", { prescription_id: prescriptionId })}
      className="flex items-center justify-center gap-2 w-full bg-foreground text-background py-4 rounded-xl font-medium text-sm transition-all active:scale-95"
    >
      <Mic className="w-4 h-4" strokeWidth={1.5} />
      오늘의 고민 이야기하기
    </Link>
  )
}
