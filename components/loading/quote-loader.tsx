'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Eye,
  Lightbulb,
  Scale,
  Feather,
  Anchor,
  Compass,
  Flame,
  Wind,
  Telescope,
  BookOpen,
  Infinity,
  Leaf,
} from 'lucide-react'

const QUOTES = [
  {
    text: '너 자신을 알라',
    philosopher: '소크라테스',
    symbol: '∅',
    Icon: Eye,
  },
  {
    text: '나는 생각한다,\n고로 나는 존재한다',
    philosopher: '데카르트',
    symbol: '✦',
    Icon: Lightbulb,
  },
  {
    text: '우리는 반복하는 것들로\n이루어진다',
    philosopher: '아리스토텔레스',
    symbol: '⚖',
    Icon: Scale,
  },
  {
    text: '존재는 본질에 앞선다',
    philosopher: '사르트르',
    symbol: '◈',
    Icon: Feather,
  },
  {
    text: '무지를 아는 것이\n지혜의 시작이다',
    philosopher: '소크라테스',
    symbol: '∅',
    Icon: Eye,
  },
  {
    text: '고통은 필연적이나,\n괴로움은 선택이다',
    philosopher: '에픽테토스',
    symbol: '⚓',
    Icon: Anchor,
  },
  {
    text: '인간은 만물의 척도다',
    philosopher: '프로타고라스',
    symbol: '◎',
    Icon: Compass,
  },
  {
    text: '덕은 중용에 있다',
    philosopher: '아리스토텔레스',
    symbol: '⚖',
    Icon: Scale,
  },
  {
    text: '용기는 두려움과\n무모함 사이에 있다',
    philosopher: '아리스토텔레스',
    symbol: '⚖',
    Icon: Flame,
  },
  {
    text: '자유란 책임이다',
    philosopher: '사르트르',
    symbol: '◈',
    Icon: Wind,
  },
  {
    text: '의심할 수 없는 것만이\n진리다',
    philosopher: '데카르트',
    symbol: '✦',
    Icon: Telescope,
  },
  {
    text: '철학은 죽음의 연습이다',
    philosopher: '소크라테스',
    symbol: '∅',
    Icon: BookOpen,
  },
  {
    text: '신은 죽었다',
    philosopher: '니체',
    symbol: '⚡',
    Icon: Infinity,
  },
  {
    text: '고통 없이 위대함은\n없다',
    philosopher: '니체',
    symbol: '⚡',
    Icon: Flame,
  },
  {
    text: '자연을 따르는 것이\n최선의 삶이다',
    philosopher: '에픽테토스',
    symbol: '⚓',
    Icon: Leaf,
  },
]

const BG_PHRASES = [
  { text: '덕은 습관이다', left: '8%', top: '11%', rotate: -4 },
  { text: '너 자신을 알라', left: '58%', top: '19%', rotate: 3 },
  { text: '의심하라, 그리고 사유하라', left: '4%', top: '52%', rotate: -3 },
  { text: '인간은 사회적 동물이다', left: '48%', top: '68%', rotate: 2 },
  { text: '자유란 필연의 인식이다', left: '12%', top: '79%', rotate: -2 },
  { text: '고통은 성장의 씨앗이다', left: '52%', top: '41%', rotate: 4 },
  { text: '아는 것이 힘이다', left: '22%', top: '30%', rotate: -1 },
]

// B: 앰비언트 SVG 일러스트 (철학자별)
function PhilosopherIllustration({ symbol }: { symbol: string }) {
  if (symbol === '∅') {
    // 소크라테스 — 그리스 항아리
    return (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="opacity-20">
        <ellipse cx="32" cy="16" rx="14" ry="5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M18 16 Q14 36 16 50 Q20 56 32 56 Q44 56 48 50 Q50 36 46 16" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M16 28 Q10 30 10 36 Q10 40 16 40" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M48 28 Q54 30 54 36 Q54 40 48 40" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M20 32 Q32 36 44 32" stroke="currentColor" strokeWidth="1" opacity="0.6" />
        <path d="M19 42 Q32 46 45 42" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      </svg>
    )
  }
  if (symbol === '✦') {
    // 데카르트 — 기하학/좌표
    return (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="opacity-20">
        <line x1="8" y1="32" x2="56" y2="32" stroke="currentColor" strokeWidth="1.5" />
        <line x1="32" y1="8" x2="32" y2="56" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="32" cy="32" r="14" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="32" cy="32" r="6" stroke="currentColor" strokeWidth="1" opacity="0.6" />
        <line x1="52" y1="28" x2="56" y2="32" stroke="currentColor" strokeWidth="1.5" />
        <line x1="52" y1="36" x2="56" y2="32" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    )
  }
  if (symbol === '⚖') {
    // 아리스토텔레스 — 저울
    return (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="opacity-20">
        <line x1="32" y1="10" x2="32" y2="54" stroke="currentColor" strokeWidth="1.5" />
        <line x1="14" y1="22" x2="50" y2="22" stroke="currentColor" strokeWidth="1.5" />
        <path d="M14 22 L10 34 Q14 40 18 34 L14 22" stroke="currentColor" strokeWidth="1.2" fill="none" />
        <path d="M50 22 L46 34 Q50 40 54 34 L50 22" stroke="currentColor" strokeWidth="1.2" fill="none" />
        <circle cx="32" cy="10" r="3" stroke="currentColor" strokeWidth="1.2" />
        <line x1="28" y1="54" x2="36" y2="54" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    )
  }
  if (symbol === '◈') {
    // 사르트르 — 실존의 창
    return (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="opacity-20">
        <rect x="20" y="20" width="24" height="24" stroke="currentColor" strokeWidth="1.5" transform="rotate(45 32 32)" />
        <rect x="26" y="26" width="12" height="12" stroke="currentColor" strokeWidth="1" transform="rotate(45 32 32)" opacity="0.6" />
        <circle cx="32" cy="32" r="3" fill="currentColor" opacity="0.4" />
        <line x1="32" y1="4" x2="32" y2="14" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        <line x1="32" y1="50" x2="32" y2="60" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        <line x1="4" y1="32" x2="14" y2="32" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        <line x1="50" y1="32" x2="60" y2="32" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      </svg>
    )
  }
  if (symbol === '⚡') {
    // 니체 — 번개/망치
    return (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="opacity-20">
        <path d="M36 8 L20 36 H30 L28 56 L44 28 H34 Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>
    )
  }
  // 기본 — 열린 책
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="opacity-20">
      <path d="M32 16 Q20 12 10 16 L10 50 Q20 46 32 50 Q44 46 54 50 L54 16 Q44 12 32 16 Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <line x1="32" y1="16" x2="32" y2="50" stroke="currentColor" strokeWidth="1.5" />
      <line x1="16" y1="24" x2="28" y2="22" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <line x1="16" y1="30" x2="28" y2="28" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <line x1="16" y1="36" x2="28" y2="34" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <line x1="36" y1="22" x2="48" y2="24" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <line x1="36" y1="28" x2="48" y2="30" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <line x1="36" y1="34" x2="48" y2="36" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    </svg>
  )
}

export function QuoteLoader() {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * QUOTES.length))

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % QUOTES.length)
    }, 3500)
    return () => clearInterval(timer)
  }, [])

  const quote = QUOTES[index]
  const { Icon } = quote

  return (
    <div className="min-h-screen max-w-md mx-auto bg-background relative overflow-hidden flex items-center justify-center">
      {/* B: 배경 ghost 문구 */}
      {BG_PHRASES.map((phrase, i) => (
        <span
          key={i}
          className="absolute text-xs text-foreground pointer-events-none select-none blur-[1.5px]"
          style={{
            left: phrase.left,
            top: phrase.top,
            opacity: 0.04 + (i % 3) * 0.012,
            transform: `rotate(${phrase.rotate}deg)`,
            whiteSpace: 'nowrap',
          }}
        >
          {phrase.text}
        </span>
      ))}

      {/* 메인 인용문 */}
      <div className="relative z-10 text-center px-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 1.0, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col items-center gap-6"
          >
            {/* B: SVG 일러스트 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-foreground"
            >
              <PhilosopherIllustration symbol={quote.symbol} />
            </motion.div>

            {/* A: lucide 아이콘 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Icon size={18} className="text-muted-foreground/60 mx-auto" />
            </motion.div>

            {/* 인용 텍스트 */}
            <p className="text-2xl font-light text-foreground leading-relaxed whitespace-pre-line tracking-tight">
              &ldquo;{quote.text}&rdquo;
            </p>

            {/* C: 철학자 이름 + 심볼 */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-xs text-muted-foreground tracking-[0.18em] uppercase flex items-center gap-1.5"
            >
              <span className="opacity-50 text-[10px]">{quote.symbol}</span>
              <span>— {quote.philosopher}</span>
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
