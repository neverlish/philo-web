import type { PhilosopherKey } from './data'

export interface MbtiMapping {
  philosopher: PhilosopherKey
  scores: Partial<Record<PhilosopherKey, number>>
  combinedTitle: string
  combinedDesc: string
}

export const MBTI_MAPPINGS: Record<string, MbtiMapping> = {
  INTJ: {
    philosopher: 'kant',
    scores: { kant: 3, kierkegaard: 1 },
    combinedTitle: '원칙을 설계하는 자',
    combinedDesc: 'INTJ의 체계적 사고와 칸트의 도덕 법칙이 만납니다. 당신은 스스로 세운 원칙으로 세상을 이해합니다.',
  },
  INFJ: {
    philosopher: 'kierkegaard',
    scores: { kierkegaard: 3, zhuangzi: 1 },
    combinedTitle: '의미를 꿰뚫는 자',
    combinedDesc: 'INFJ의 깊은 통찰과 키르케고르의 실존적 탐색이 공명합니다. 당신은 겉이 아닌 본질을 봅니다.',
  },
  INFP: {
    philosopher: 'kierkegaard',
    scores: { kierkegaard: 3, socrates: 1 },
    combinedTitle: '진정성을 찾는 자',
    combinedDesc: 'INFP의 이상주의와 키르케고르의 "진정한 나로 살기"가 닮아 있습니다. 당신은 내면의 소리에 귀를 기울입니다.',
  },
  INTP: {
    philosopher: 'socrates',
    scores: { socrates: 3, kant: 1 },
    combinedTitle: '논리의 해부자',
    combinedDesc: 'INTP의 분석적 사고와 소크라테스의 산파술이 만납니다. 당신은 모든 것에 "왜?"라고 묻습니다.',
  },
  ENTJ: {
    philosopher: 'nietzsche',
    scores: { nietzsche: 3, kant: 1 },
    combinedTitle: '의지의 지휘자',
    combinedDesc: 'ENTJ의 추진력과 니체의 힘에의 의지가 공명합니다. 당신은 목표를 향해 경계를 넘어섭니다.',
  },
  ENTP: {
    philosopher: 'socrates',
    scores: { socrates: 3, nietzsche: 1 },
    combinedTitle: '생각의 도전자',
    combinedDesc: 'ENTP의 토론 본능과 소크라테스의 변증법이 만납니다. 당신은 기존 생각을 흔드는 것을 즐깁니다.',
  },
  ENFJ: {
    philosopher: 'confucius',
    scores: { confucius: 3, kierkegaard: 1 },
    combinedTitle: '관계의 건축가',
    combinedDesc: 'ENFJ의 공감 능력과 공자의 인(仁) 철학이 공명합니다. 당신에게 삶의 중심은 사람입니다.',
  },
  ENFP: {
    philosopher: 'kierkegaard',
    scores: { kierkegaard: 3, epicurus: 1 },
    combinedTitle: '가능성의 탐험가',
    combinedDesc: 'ENFP의 자유로운 영혼과 키르케고르의 실존적 선택이 만납니다. 당신은 정해진 길보다 스스로 만드는 길을 걷습니다.',
  },
  ISTJ: {
    philosopher: 'epictetus',
    scores: { epictetus: 3, kant: 1 },
    combinedTitle: '의무의 수호자',
    combinedDesc: 'ISTJ의 성실함과 에픽테토스의 내면 통제가 공명합니다. 당신은 말보다 행동으로 증명합니다.',
  },
  ISFJ: {
    philosopher: 'confucius',
    scores: { confucius: 3, epictetus: 1 },
    combinedTitle: '헌신의 지킴이',
    combinedDesc: 'ISFJ의 배려심과 공자의 예(禮) 철학이 만납니다. 당신은 소중한 사람을 위해 묵묵히 곁을 지킵니다.',
  },
  ISTP: {
    philosopher: 'epictetus',
    scores: { epictetus: 3, zhuangzi: 1 },
    combinedTitle: '실용의 달인',
    combinedDesc: 'ISTP의 현실적 문제 해결과 에픽테토스의 통제 철학이 공명합니다. 당신은 쓸모 없는 것에 에너지를 낭비하지 않습니다.',
  },
  ISFP: {
    philosopher: 'epicurus',
    scores: { epicurus: 3, zhuangzi: 1 },
    combinedTitle: '감각의 탐미자',
    combinedDesc: 'ISFP의 심미적 감성과 에피쿠로스의 쾌락주의가 만납니다. 당신은 지금 이 순간의 아름다움을 알아채는 사람입니다.',
  },
  ESTJ: {
    philosopher: 'kant',
    scores: { kant: 3, confucius: 1 },
    combinedTitle: '질서의 집행자',
    combinedDesc: 'ESTJ의 체계적 실행력과 칸트의 보편 법칙이 공명합니다. 당신은 원칙이 있는 곳에 신뢰가 생긴다고 믿습니다.',
  },
  ESFJ: {
    philosopher: 'confucius',
    scores: { confucius: 3, epicurus: 1 },
    combinedTitle: '조화의 연결자',
    combinedDesc: 'ESFJ의 협력 본능과 공자의 화(和) 철학이 만납니다. 당신은 모든 사람이 함께 잘 지내는 것을 소중히 여깁니다.',
  },
  ESTP: {
    philosopher: 'nietzsche',
    scores: { nietzsche: 3, epictetus: 1 },
    combinedTitle: '행동의 선구자',
    combinedDesc: 'ESTP의 즉각적 행동력과 니체의 "지금 여기서 살아라"가 공명합니다. 당신은 생각보다 먼저 움직입니다.',
  },
  ESFP: {
    philosopher: 'epicurus',
    scores: { epicurus: 3, zhuangzi: 1 },
    combinedTitle: '순간의 예술가',
    combinedDesc: 'ESFP의 활기찬 에너지와 에피쿠로스의 현재 철학이 만납니다. 당신이 있는 곳에 생기가 넘칩니다.',
  },
}

export function getMbtiMapping(mbti: string): MbtiMapping | null {
  return MBTI_MAPPINGS[mbti.toUpperCase()] ?? null
}
