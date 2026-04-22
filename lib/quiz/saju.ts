import type { PhilosopherKey } from './data'

export interface SajuInfo {
  zodiac: string
  zodiacEmoji: string
  zodiacDesc: string
  scores: Partial<Record<PhilosopherKey, number>>
}

const ZODIAC_DATA: SajuInfo[] = [
  { zodiac: '쥐', zodiacEmoji: '🐭', zodiacDesc: '작은 틈도 파고드는 탐구자', scores: { socrates: 2 } },
  { zodiac: '소', zodiacEmoji: '🐮', zodiacDesc: '묵묵히 관계를 쌓는 성실함', scores: { confucius: 2 } },
  { zodiac: '호랑이', zodiacEmoji: '🐯', zodiacDesc: '경계를 넘어 스스로 강해진다', scores: { nietzsche: 2 } },
  { zodiac: '토끼', zodiacEmoji: '🐰', zodiacDesc: '감수성 풍부하게 지금을 즐긴다', scores: { epicurus: 2 } },
  { zodiac: '용', zodiacEmoji: '🐲', zodiacDesc: '나만의 의미와 비전을 추구한다', scores: { kierkegaard: 2 } },
  { zodiac: '뱀', zodiacEmoji: '🐍', zodiacDesc: '형태를 바꾸며 흐름에 따른다', scores: { zhuangzi: 2 } },
  { zodiac: '말', zodiacEmoji: '🐴', zodiacDesc: '경계 없이 자유롭게 내달린다', scores: { nietzsche: 2 } },
  { zodiac: '양', zodiacEmoji: '🐑', zodiacDesc: '온순하게 조화를 이루어간다', scores: { confucius: 2 } },
  { zodiac: '원숭이', zodiacEmoji: '🐵', zodiacDesc: '유연하게 변화하며 경계를 넘는다', scores: { zhuangzi: 2 } },
  { zodiac: '닭', zodiacEmoji: '🐔', zodiacDesc: '원칙대로 매일 같은 질서를 지킨다', scores: { kant: 2 } },
  { zodiac: '개', zodiacEmoji: '🐶', zodiacDesc: '충실하게 내 감정을 다스린다', scores: { epictetus: 2 } },
  { zodiac: '돼지', zodiacEmoji: '🐷', zodiacDesc: '풍요롭게 지금의 기쁨을 누린다', scores: { epicurus: 2 } },
]

export function getSajuInfo(birthYear: number): SajuInfo {
  const idx = ((birthYear - 4) % 12 + 12) % 12
  return ZODIAC_DATA[idx]
}
