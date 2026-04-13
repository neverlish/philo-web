"use client"

import { useState, useEffect } from "react"
import { Share, Plus, ChevronDown, ChevronUp } from "lucide-react"

function isIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent)
}

function isInStandaloneMode() {
  return window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in window.navigator && (window.navigator as { standalone?: boolean }).standalone === true)
}

export function IosInstallGuide() {
  const [show, setShow] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    setShow(isIOS() && !isInStandaloneMode())
  }, [])

  if (!show) return null

  return (
    <section className="mb-8">
      <h2 className="text-xs font-medium tracking-widest text-muted uppercase mb-3">앱 설치</h2>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="w-full flex items-center gap-4 p-4"
        >
          <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/apple-touch-icon.png" alt="오늘의철학" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium">홈 화면에 추가하기</p>
            <p className="text-xs text-muted-foreground mt-0.5">앱처럼 사용하고 알림도 받아요</p>
          </div>
          {expanded
            ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          }
        </button>

        {expanded && (
          <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                <Share className="w-4 h-4 text-foreground" />
              </div>
              <div>
                <p className="text-sm text-foreground">1단계</p>
                <p className="text-xs text-muted-foreground">Safari 하단 가운데 <strong className="text-foreground">공유</strong> 버튼 탭</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                <Plus className="w-4 h-4 text-foreground" />
              </div>
              <div>
                <p className="text-sm text-foreground">2단계</p>
                <p className="text-xs text-muted-foreground">스크롤 내려서 <strong className="text-foreground">홈 화면에 추가</strong> 선택</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
