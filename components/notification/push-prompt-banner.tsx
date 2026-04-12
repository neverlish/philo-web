"use client"

import { useState, useEffect } from "react"
import { Bell, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { usePostHog } from "posthog-js/react"

const STORAGE_KEY = "push_prompt_shown"

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
  const rawData = window.atob(base64)
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)))
}

export function PushPromptBanner() {
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const posthog = usePostHog()

  useEffect(() => {
    if (
      !("Notification" in window) ||
      !("serviceWorker" in navigator) ||
      Notification.permission !== "default" ||
      localStorage.getItem(STORAGE_KEY)
    ) return

    const timer = setTimeout(() => setVisible(true), 4000)
    return () => clearTimeout(timer)
  }, [])

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "dismissed")
    posthog?.capture("push_prompt_dismissed")
    setVisible(false)
  }

  const subscribe = async () => {
    setLoading(true)
    localStorage.setItem(STORAGE_KEY, "shown")
    try {
      const perm = await Notification.requestPermission()
      if (perm !== "granted") {
        setVisible(false)
        return
      }
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
        ) as BufferSource,
      })
      const key = sub.getKey("p256dh")
      const auth = sub.getKey("auth")
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: sub.endpoint,
          p256dh: key ? btoa(String.fromCharCode(...new Uint8Array(key))) : "",
          auth: auth ? btoa(String.fromCharCode(...new Uint8Array(auth))) : "",
        }),
      })
      posthog?.capture("push_subscribed", { source: "prescription_banner" })
      setDone(true)
      setTimeout(() => setVisible(false), 1500)
    } catch {
      setVisible(false)
    } finally {
      setLoading(false)
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
              <Bell className="w-5 h-5 text-primary" strokeWidth={1.5} />
            </div>
            <div className="flex-1 min-w-0">
              {done ? (
                <p className="text-sm font-medium text-primary">알림이 설정됐어요 ✓</p>
              ) : (
                <>
                  <p className="text-sm font-medium text-foreground">내일도 철학 처방 받을까요?</p>
                  <p className="text-xs text-muted mt-0.5">매일 저녁 체크인 알림을 보내드려요</p>
                </>
              )}
            </div>
            {!done && (
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={subscribe}
                  disabled={loading}
                  className="text-xs font-medium text-primary disabled:opacity-50"
                >
                  {loading ? "..." : "켜기"}
                </button>
                <button onClick={dismiss} className="p-1 text-muted hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
