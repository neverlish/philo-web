"use client"

import { useEffect, useState } from "react"
import { Download } from "lucide-react"

export function AndroidInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setInstalled(true)
      return
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    window.addEventListener("beforeinstallprompt", handler)
    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    ;(deferredPrompt as any).prompt()
    const { outcome } = await (deferredPrompt as any).userChoice
    if (outcome === "accepted") {
      setInstalled(true)
    }
    setDeferredPrompt(null)
  }

  if (installed || !deferredPrompt) return null

  return (
    <section className="mb-8">
      <h2 className="text-xs font-medium tracking-widest text-muted uppercase mb-3">앱 설치</h2>
      <button
        onClick={handleInstall}
        className="w-full flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/30 transition-colors"
      >
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Download className="w-5 h-5 text-primary" strokeWidth={1.5} />
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-medium text-foreground mb-0.5">홈 화면에 추가</p>
          <p className="text-xs text-muted">앱처럼 빠르게 실행할 수 있어요</p>
        </div>
      </button>
    </section>
  )
}
