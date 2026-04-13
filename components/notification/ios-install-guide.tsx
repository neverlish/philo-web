"use client"

import { useState, useEffect } from "react"
import { Share, Plus, ChevronDown, ChevronUp, Copy, Check } from "lucide-react"

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

export function IosInstallGuide() {
  const [show, setShow] = useState(false)
  const [isSafari, setIsSafari] = useState(true)
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (isIOS() && !isInStandaloneMode()) {
      setShow(true)
      setIsSafari(isIosSafari())
    }
  }, [])

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(window.location.origin)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

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
            <p className="text-xs text-muted-foreground mt-0.5">
              {isSafari ? "앱처럼 사용하고 알림도 받아요" : "Safari에서만 설치 가능해요"}
            </p>
          </div>
          {expanded
            ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          }
        </button>

        {expanded && (
          <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
            {isSafari ? (
              <>
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
              </>
            ) : (
              <>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  iPhone에서는 <strong className="text-foreground">Safari</strong>에서만 홈 화면 추가와 알림이 가능해요. 아래 주소를 복사해서 Safari에서 열어주세요.
                </p>
                <button
                  onClick={handleCopyUrl}
                  className="flex items-center gap-2 w-full px-3 py-2.5 bg-muted rounded-lg text-sm transition-colors"
                >
                  {copied
                    ? <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    : <Copy className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  }
                  <span className={`flex-1 text-left text-xs truncate ${copied ? "text-primary" : "text-muted-foreground"}`}>
                    {copied ? "복사됐어요" : "philoapp.kr"}
                  </span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
