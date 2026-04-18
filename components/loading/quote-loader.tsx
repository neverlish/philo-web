'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QUOTES, BG_PHRASES } from './quotes-data'
import { PhilosopherIllustration } from './philosopher-illustration'

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
