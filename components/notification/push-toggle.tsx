"use client"

import { useState, useEffect } from "react"
import { Bell, BellOff } from "lucide-react"
import { usePostHog } from 'posthog-js/react'

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
  const rawData = window.atob(base64)
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)))
}

type NotifPermission = "default" | "granted" | "denied" | "unsupported"

export function PushToggle() {
  const [permission, setPermission] = useState<NotifPermission>("default")
  const [loading, setLoading] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const posthog = usePostHog()

  useEffect(() => {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      setPermission("unsupported")
      return
    }
    setPermission(Notification.permission as NotifPermission)

    navigator.serviceWorker.ready.then((reg) => {
      reg.pushManager.getSubscription().then((sub) => {
        setSubscribed(!!sub)
      })
    })
  }, [])

  const subscribe = async () => {
    setLoading(true)
    try {
      const perm = await Notification.requestPermission()
      setPermission(perm as NotifPermission)
      if (perm !== "granted") return

      const reg = await navigator.serviceWorker.ready
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey) as BufferSource,
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

      posthog?.capture('push_subscribed')
      setSubscribed(true)
    } catch (err) {
      console.error("Subscribe failed:", err)
    } finally {
      setLoading(false)
    }
  }

  const unsubscribe = async () => {
    setLoading(true)
    try {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.getSubscription()
      if (sub) {
        await fetch("/api/push/subscribe", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        })
        await sub.unsubscribe()
      }
      posthog?.capture('push_unsubscribed')
      setSubscribed(false)
    } catch (err) {
      console.error("Unsubscribe failed:", err)
    } finally {
      setLoading(false)
    }
  }

  if (permission === "unsupported") {
    return (
      <div className="w-full flex items-center gap-4 p-4 bg-card border border-border rounded-xl opacity-50">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
          <BellOff className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-medium">알림 미지원</p>
          <p className="text-xs text-muted-foreground">이 브라우저는 알림을 지원하지 않아요</p>
        </div>
      </div>
    )
  }

  if (permission === "denied") {
    return (
      <div className="w-full flex items-center gap-4 p-4 bg-card border border-border rounded-xl">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
          <BellOff className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-medium">알림 차단됨</p>
          <p className="text-xs text-muted-foreground">브라우저 설정에서 알림을 허용해 주세요</p>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={subscribed ? unsubscribe : subscribe}
      disabled={loading}
      className="w-full flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/30 transition-colors disabled:opacity-50"
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${subscribed ? "bg-primary/10" : "bg-muted"}`}>
        <Bell className={`w-5 h-5 ${subscribed ? "text-primary" : "text-muted-foreground"}`} strokeWidth={1.5} />
      </div>
      <div className="flex-1 text-left">
        <p className="text-sm font-medium">
          {loading ? "처리 중..." : subscribed ? "매일 저녁 알림 켜짐" : "매일 저녁 알림 받기"}
        </p>
        <p className="text-xs text-muted-foreground">
          {subscribed ? "체크인 리마인더를 보내드려요" : "오늘 하루 돌아볼 시간을 알려드려요"}
        </p>
      </div>
      <div className={`w-10 h-6 rounded-full transition-colors ${subscribed ? "bg-primary" : "bg-muted"} flex items-center ${subscribed ? "justify-end" : "justify-start"} px-1`}>
        <div className="w-4 h-4 bg-white rounded-full shadow" />
      </div>
    </button>
  )
}
