"use client"

import { useState, useEffect } from "react"
import { Share2, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { usePostHog } from "posthog-js/react"

interface SharePromptBannerProps {
  prescriptionId: string
  quote: string
  philosopherName: string
  philosopherSchool: string
  concern?: string | null
}

export function SharePromptBanner({
  prescriptionId,
  quote,
  philosopherName,
  philosopherSchool,
  concern,
}: SharePromptBannerProps) {
  const [visible, setVisible] = useState(false)
  const posthog = usePostHog()

  useEffect(() => {
    const key = `share_nudge_${prescriptionId}`
    if (sessionStorage.getItem(key)) return

    const timer = setTimeout(() => {
      setVisible(true)
      posthog?.capture("share_prompt_shown", { prescription_id: prescriptionId })
    }, 2000)
    return () => clearTimeout(timer)
  }, [prescriptionId])

  const dismiss = () => {
    sessionStorage.setItem(`share_nudge_${prescriptionId}`, "dismissed")
    posthog?.capture("share_prompt_dismissed", { prescription_id: prescriptionId })
    setVisible(false)
  }

  const handleShare = async () => {
    sessionStorage.setItem(`share_nudge_${prescriptionId}`, "shared")
    const shareUrl = `${window.location.origin}/share/${prescriptionId}?utm_source=share_nudge`
    const concernLine = concern ? `"${concern}"\n\n` : ""
    const text = `${concernLine}"${quote}"\n— ${philosopherName} (${philosopherSchool})\n\n${shareUrl}`

    try {
      if (navigator.share && navigator.canShare?.({ title: "오늘의 처방", text, url: shareUrl })) {
        await navigator.share({ title: "오늘의 처방", text, url: shareUrl })
        posthog?.capture("share_prompt_shared", { prescription_id: prescriptionId, method: "native" })
      } else {
        await navigator.clipboard.writeText(text)
        posthog?.capture("share_prompt_shared", { prescription_id: prescriptionId, method: "clipboard" })
      }
    } catch {
      // 사용자 취소
    } finally {
      setVisible(false)
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm z-50"
        >
          <div className="bg-card border border-border rounded-2xl p-4 shadow-lg flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Share2 className="w-5 h-5 text-primary" strokeWidth={1.5} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">이 처방, 나누고 싶지 않으세요?</p>
              <p className="text-xs text-muted mt-0.5">친구에게 오늘의 지혜를 전해보세요</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={handleShare}
                className="text-xs font-medium text-primary"
              >
                공유
              </button>
              <button onClick={dismiss} className="p-1 text-muted hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
