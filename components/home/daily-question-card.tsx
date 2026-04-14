"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

const DAILY_QUESTIONS = [
  {
    question: "지금 이 순간, 나를 가장 무겁게 짓누르는 것은 무엇인가?",
    philosopher: "소크라테스",
    hint: "아는 척하지 않는 것에서 지혜가 시작돼요. 그 무게의 이름을 먼저 불러보세요.",
  },
  {
    question: "10년 후의 나는 오늘을 어떻게 기억할까?",
    philosopher: "마르쿠스 아우렐리우스",
    hint: "지금의 고통은 미래에서 보면 다르게 보일 수 있어요. 긴 호흡으로 바라보세요.",
  },
  {
    question: "내가 두려워하는 것이 정말 일어날까, 아니면 일어날 것 같은 상상인가?",
    philosopher: "에픽테토스",
    hint: "통제할 수 있는 것과 없는 것을 구분하는 것이 자유의 시작이에요.",
  },
  {
    question: "나는 지금 어떤 사람이 되어가고 있는가?",
    philosopher: "아리스토텔레스",
    hint: "한 번의 행동이 아니라 습관이 우리의 성품을 만들어요.",
  },
  {
    question: "나에게 정말 중요한 것은 무엇이고, 그것을 위해 오늘 무엇을 했는가?",
    philosopher: "세네카",
    hint: "시간은 생명이에요. 무엇에 쓰고 있는지 돌아보세요.",
  },
  {
    question: "지금 내가 느끼는 감정의 이름은 무엇인가?",
    philosopher: "스피노자",
    hint: "감정을 이해하는 것이 감정에 휘둘리지 않는 첫걸음이에요.",
  },
  {
    question: "만약 실패가 불가능하다면, 나는 무엇을 하겠는가?",
    philosopher: "니체",
    hint: "두려움을 걷어낸 자리에 진짜 원하는 것이 있어요.",
  },
  {
    question: "나는 지금 흘러가는 강물인가, 아니면 강물을 거슬러 올라가려는가?",
    philosopher: "노자",
    hint: "자연스러운 흐름에 맡기는 것도 하나의 지혜예요.",
  },
  {
    question: "오늘 만난 사람에게 나는 어떤 존재였는가?",
    philosopher: "공자",
    hint: "관계 속에서 나를 발견하고, 나를 통해 타인을 이해해요.",
  },
  {
    question: "지금 이 순간의 고통은 어떤 가르침을 주고 있는가?",
    philosopher: "붓다",
    hint: "고통은 피할 것이 아니라 이해할 것이에요. 거기에 길이 있어요.",
  },
  {
    question: "내가 가진 것 중 진정으로 내 것은 무엇인가?",
    philosopher: "에픽테토스",
    hint: "소유가 아닌 선택과 의지 안에서 진짜 자유를 찾을 수 있어요.",
  },
  {
    question: "나는 지금 '있어야 할 나'와 '실제 나' 중 누구로 살고 있는가?",
    philosopher: "사르트르",
    hint: "스스로 정의하지 않으면 타인이 정의해요. 진짜 나를 선택하세요.",
  },
  {
    question: "지금 포기하고 싶은 것이 있다면, 그 이유는 두려움인가 지혜인가?",
    philosopher: "헤라클레이토스",
    hint: "변화 속에서 무엇을 붙잡고 무엇을 흘려보낼지 아는 것이 용기예요.",
  },
  {
    question: "내 삶에서 반복되는 패턴은 무엇인가?",
    philosopher: "칼 융",
    hint: "무의식의 패턴을 의식하는 순간, 그것은 운명이 아닌 선택이 돼요.",
  },
  {
    question: "오늘 하루 중 가장 살아있음을 느낀 순간은 언제인가?",
    philosopher: "몽테뉴",
    hint: "작은 순간들 속에 삶의 진짜 의미가 숨어있어요.",
  },
  {
    question: "나는 다른 사람의 시선 없이도 같은 선택을 할 수 있는가?",
    philosopher: "칸트",
    hint: "그것이 '옳은 것'과 '보여지고 싶은 것'을 구분하는 기준이에요.",
  },
  {
    question: "지금 내가 저항하는 것을 받아들이면 어떻게 될까?",
    philosopher: "마르쿠스 아우렐리우스",
    hint: "저항이 멈추는 곳에서 새로운 가능성이 열리기도 해요.",
  },
  {
    question: "내 삶이 의미 있으려면 무엇이 필요한가?",
    philosopher: "빅터 프랭클",
    hint: "의미는 발견하는 것이 아니라, 어떤 상황에서도 만들어낼 수 있어요.",
  },
  {
    question: "지금 내가 말하지 못하고 있는 것은 무엇인가?",
    philosopher: "소크라테스",
    hint: "침묵 속에 갇힌 말이 우리를 가장 오래 붙잡아요.",
  },
  {
    question: "나는 타인의 행복과 내 행복을 어떻게 균형 잡고 있는가?",
    philosopher: "존 스튜어트 밀",
    hint: "나를 비우는 것도, 나만 채우는 것도 모두 편향이에요.",
  },
]

interface DailyQuestionCardProps {
  onWriteThought?: () => void
}

export function DailyQuestionCard({ onWriteThought }: DailyQuestionCardProps) {
  const [flipped, setFlipped] = useState(false)

  const dayIndex = Math.floor(Date.now() / 86400000) % DAILY_QUESTIONS.length
  const { question, philosopher, hint } = DAILY_QUESTIONS[dayIndex]

  return (
    <div className="w-full mb-6">
      <span className="inline-block mb-3 text-[10px] font-medium tracking-[0.2em] uppercase text-muted">
        오늘의 질문
      </span>
      <div
        className="relative w-full rounded-2xl border border-primary/20 bg-stone-50 overflow-hidden cursor-pointer active:bg-stone-100 transition-colors"
        onClick={() => setFlipped((f) => !f)}
        style={{ minHeight: 136 }}
      >
        <AnimatePresence mode="wait">
          {!flipped ? (
            <motion.div
              key="front"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="p-5"
            >
              <p className="text-base font-serif leading-relaxed text-foreground mb-4 break-keep">
                {question}
              </p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-primary">— {philosopher}</p>
                <p className="text-xs text-muted/60">탭해서 힌트</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="back"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="p-5"
            >
              <p className="text-[10px] font-medium tracking-widest text-muted uppercase mb-2">성찰 힌트</p>
              <p className="text-sm leading-relaxed text-foreground mb-4 break-keep">
                {hint}
              </p>
              <div className="flex items-center justify-between">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onWriteThought?.()
                  }}
                  className="text-xs text-primary font-medium"
                >
                  내 생각 적기 →
                </button>
                <p className="text-xs text-muted/60">탭해서 질문으로</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
