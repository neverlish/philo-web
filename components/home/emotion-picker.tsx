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
      <div className="grid grid-cols-4 gap-2">
        {EMOTIONS.map(({ label, concern }) => (
          <motion.button
            key={label}
            whileTap={{ scale: 0.9 }}
            onClick={() => onSelectEmotion(concern)}
            className="py-2.5 rounded-xl bg-stone-100 text-xs text-foreground font-medium hover:bg-stone-200 transition-colors text-center"
          >
            {label}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
