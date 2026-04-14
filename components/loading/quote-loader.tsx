'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const QUOTES = [
  { text: '너 자신을 알라', philosopher: '소크라테스' },
  { text: '나는 생각한다,\n고로 나는 존재한다', philosopher: '데카르트' },
  { text: '우리는 반복하는 것들로\n이루어진다', philosopher: '아리스토텔레스' },
  { text: '존재는 본질에 앞선다', philosopher: '사르트르' },
  { text: '무지를 아는 것이\n지혜의 시작이다', philosopher: '소크라테스' },
  { text: '고통은 필연적이나,\n괴로움은 선택이다', philosopher: '에픽테토스' },
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

export function QuoteLoader() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % QUOTES.length)
    }, 3200)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen max-w-md mx-auto bg-background relative overflow-hidden flex items-center justify-center">
      {/* Background ghost phrases */}
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

      {/* Cycling main quote */}
      <div className="relative z-10 text-center px-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 1.0, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <p className="text-2xl font-light text-foreground leading-relaxed whitespace-pre-line tracking-tight mb-5">
              &ldquo;{QUOTES[index].text}&rdquo;
            </p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xs text-muted-foreground tracking-[0.18em] uppercase"
            >
              — {QUOTES[index].philosopher}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
