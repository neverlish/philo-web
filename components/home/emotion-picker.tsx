"use client"

import { motion } from "framer-motion"

const EMOTIONS = [
  { label: "불안", concern: "요즘 불안하고 두려운 마음이 있어요." },
  { label: "외로움", concern: "외롭고 고립된 느낌이 들어요." },
  { label: "막막함", concern: "앞길이 막막하고 어떻게 해야 할지 모르겠어요." },
  { label: "허무", concern: "삶의 의미를 잃은 것 같은 허무감이 있어요." },
  { label: "억울함", concern: "억울하고 화가 나는 상황이 있어요." },
  { label: "후회", concern: "후회되는 일로 마음이 괴로워요." },
  { label: "무기력", concern: "의욕이 없고 무기력한 느낌이에요." },
  { label: "혼란", concern: "머릿속이 복잡하고 정리가 안 돼요." },
]

interface EmotionPickerProps {
  onSelectEmotion: (concern: string) => void
}

export function EmotionPicker({ onSelectEmotion }: EmotionPickerProps) {
  return (
    <div className="w-full mb-6">
      <span className="inline-block mb-3 text-[10px] font-medium tracking-[0.2em] uppercase text-muted">
        지금 이런 마음인가요?
      </span>
      <div className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
        {EMOTIONS.map(({ label, concern }) => (
          <motion.button
            key={label}
            whileTap={{ scale: 0.92 }}
            onClick={() => onSelectEmotion(concern)}
            className="flex-none px-4 py-2 rounded-full border border-primary/20 bg-stone-50 text-sm text-muted hover:bg-stone-100 hover:border-primary/40 hover:text-foreground transition-colors whitespace-nowrap"
          >
            {label}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
