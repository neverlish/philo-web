import {
  Eye, Lightbulb, Scale, Feather, Anchor, Compass,
  Flame, Wind, Telescope, BookOpen, Infinity, Leaf,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type QuoteItem = {
  text: string
  philosopher: string
  symbol: string
  Icon: LucideIcon
}

export const QUOTES: QuoteItem[] = [
  { text: '너 자신을 알라', philosopher: '소크라테스', symbol: '∅', Icon: Eye },
  { text: '나는 생각한다,\n고로 나는 존재한다', philosopher: '데카르트', symbol: '✦', Icon: Lightbulb },
  { text: '우리는 반복하는 것들로\n이루어진다', philosopher: '아리스토텔레스', symbol: '⚖', Icon: Scale },
  { text: '존재는 본질에 앞선다', philosopher: '사르트르', symbol: '◈', Icon: Feather },
  { text: '무지를 아는 것이\n지혜의 시작이다', philosopher: '소크라테스', symbol: '∅', Icon: Eye },
  { text: '고통은 필연적이나,\n괴로움은 선택이다', philosopher: '에픽테토스', symbol: '⚓', Icon: Anchor },
  { text: '인간은 만물의 척도다', philosopher: '프로타고라스', symbol: '◎', Icon: Compass },
  { text: '덕은 중용에 있다', philosopher: '아리스토텔레스', symbol: '⚖', Icon: Scale },
  { text: '용기는 두려움과\n무모함 사이에 있다', philosopher: '아리스토텔레스', symbol: '⚖', Icon: Flame },
  { text: '자유란 책임이다', philosopher: '사르트르', symbol: '◈', Icon: Wind },
  { text: '의심할 수 없는 것만이\n진리다', philosopher: '데카르트', symbol: '✦', Icon: Telescope },
  { text: '철학은 죽음의 연습이다', philosopher: '소크라테스', symbol: '∅', Icon: BookOpen },
  { text: '신은 죽었다', philosopher: '니체', symbol: '⚡', Icon: Infinity },
  { text: '고통 없이 위대함은\n없다', philosopher: '니체', symbol: '⚡', Icon: Flame },
  { text: '자연을 따르는 것이\n최선의 삶이다', philosopher: '에픽테토스', symbol: '⚓', Icon: Leaf },
]

export const BG_PHRASES = [
  { text: '덕은 습관이다', left: '8%', top: '11%', rotate: -4 },
  { text: '너 자신을 알라', left: '58%', top: '19%', rotate: 3 },
  { text: '의심하라, 그리고 사유하라', left: '4%', top: '52%', rotate: -3 },
  { text: '인간은 사회적 동물이다', left: '48%', top: '68%', rotate: 2 },
  { text: '자유란 필연의 인식이다', left: '12%', top: '79%', rotate: -2 },
  { text: '고통은 성장의 씨앗이다', left: '52%', top: '41%', rotate: 4 },
  { text: '아는 것이 힘이다', left: '22%', top: '30%', rotate: -1 },
]
