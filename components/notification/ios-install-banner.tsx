"use client"

import { useState, useEffect } from "react"
import { X, Share, Plus, Copy, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const STORAGE_KEY = "ios_install_dismissed"

function isIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent)
}

function isIosSafari() {
  const ua = navigator.userAgent
  return isIOS() && /safari/i.test(ua) && !/crios|fxios|opios|edgios/i.test(ua)
}

function isInStandaloneMode() {
  return window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in window.navigator && (window.navigator as { standalone?: boolean }).standalone === true)
}

export function IosInstallBanner() {
  const [visible, setVisible] = useState(false)
  const [isSafari, setIsSafari] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!isIOS() || isInStandaloneMode()) return
    if (localStorage.getItem(STORAGE_KEY)) return
    setIsSafari(isIosSafari())
    const timer = setTimeout(() => setVisible(true), 5000)
    return () => clearTimeout(timer)
  }, [])

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1")
    setVisible(false)
  }

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(window.location.origin)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 28 }}
          className="fixed bottom-0 left-0 right-0 z-50 pb-safe"
        >
          <div className="mx-4 mb-4 bg-card border border-border rounded-2xl p-4 shadow-xl">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/apple-touch-icon.png" alt="오늘의철학" className="w-12 h-12 rounded-xl" />
                <div>
                  <p className="text-sm font-semibold text-foreground">홈 화면에 추가하기</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {isSafari ? "앱처럼 사용하고 알림도 받아요" : "Safari에서만 설치 가능해요"}
                  </p>
                </div>
              </div>
              <button onClick={dismiss} className="p-1 text-muted-foreground hover:text-foreground mt-0.5">
                <X className="w-4 h-4" />
              </button>
            </div>

            {isSafari ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <Share className="w-3.5 h-3.5" />
                  </div>
                  <span>하단의 <strong className="text-foreground">공유</strong> 버튼을 눌러요</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                  <span><strong className="text-foreground">홈 화면에 추가</strong>를 선택해요</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  iPhone에서는 <strong className="text-foreground">Safari</strong>에서만 설치와 알림이 가능해요. 아래를 복사해서 Safari에서 열어주세요.
                </p>
                <button
                  onClick={handleCopyUrl}
                  className="flex items-center gap-2 w-full px-3 py-2.5 bg-muted rounded-lg"
                >
                  {copied
                    ? <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    : <Copy className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  }
                  <span className={`text-xs ${copied ? "text-primary" : "text-muted-foreground"}`}>
                    {copied ? "복사됐어요" : "philoapp.kr 복사하기"}
                  </span>
                </button>
              </div>
            )}

            {isSafari && (
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-card border-r border-b border-border rotate-45" />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
