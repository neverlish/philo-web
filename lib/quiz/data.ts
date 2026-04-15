export type PhilosopherKey =
  | 'socrates'
  | 'nietzsche'
  | 'epictetus'
  | 'epicurus'
  | 'confucius'
  | 'kant'
  | 'zhuangzi'
  | 'kierkegaard'

export interface PhilosopherType {
  key: PhilosopherKey
  name: string
  typeName: string
  era: string
  headline: string
  description: string
  quote: string
  quoteContext: string
  symbol: string
  compatibleType: PhilosopherKey
  samplePrescription: {
    concern: string
    text: string
  }
}

export interface AnswerChoice {
  text: string
  scores: Partial<Record<PhilosopherKey, number>>
}

export interface Question {
  id: number
  question: string
  choices: [AnswerChoice, AnswerChoice, AnswerChoice, AnswerChoice]
}

export const PHILOSOPHER_TYPES: Record<PhilosopherKey, PhilosopherType> = {
  socrates: {
    key: 'socrates',
    name: '소크라테스',
    typeName: '탐구하는 자',
    era: '고대 그리스 (BC 470–399)',
    headline: '당신은 끊임없이 질문하며 진리를 찾아가는 사람입니다',
    description:
      '당신은 표면 아래를 파고드는 사람입니다. 당연하게 여겨지는 것들에 "왜?"라고 묻고, 대화 속에서 새로운 이해를 발견합니다. 때로는 답보다 질문 자체가 더 소중하다는 것을 압니다.',
    quote: '나는 내가 아무것도 모른다는 것을 안다.',
    quoteContext: '소크라테스의 역설적 지혜 — 무지의 인식이 앎의 시작이다',
    symbol: 'Search',
    compatibleType: 'kierkegaard',
    samplePrescription: {
      concern: '내가 왜 이 일을 하는지 모르겠어요',
      text: '그 물음을 멈추지 마세요. "왜 하는지 모르겠다"는 느낌은 무언가 중요한 것이 흔들리고 있다는 신호입니다. 지금 당신에게 필요한 건 답이 아니라, 더 정확한 질문일 수 있어요.',
    },
  },
  nietzsche: {
    key: 'nietzsche',
    name: '니체',
    typeName: '돌파하는 자',
    era: '근대 독일 (1844–1900)',
    headline: '당신은 기존의 틀을 깨고 자신만의 가치를 창조하는 사람입니다',
    description:
      '당신은 주어진 것에 안주하지 않습니다. 사회가 당연하다고 여기는 것에 의문을 품고, 더 강한 자신을 만들어가는 길을 선택합니다. 고통조차 성장의 원료로 삼는 힘이 있습니다.',
    quote: '나를 죽이지 못하는 것은 나를 더 강하게 만든다.',
    quoteContext: '니체의 운명애(Amor Fati) — 삶의 모든 것을 긍정하라',
    symbol: 'Zap',
    compatibleType: 'zhuangzi',
    samplePrescription: {
      concern: '반복되는 일상이 지루하고 답답해요',
      text: '그 답답함은 당신 안의 힘이 더 넓은 공간을 원한다는 신호입니다. 지금 당신에게 필요한 건 탈출이 아니라, 스스로 정한 새로운 방향입니다. 무엇을 창조하고 싶으세요?',
    },
  },
  epictetus: {
    key: 'epictetus',
    name: '에픽테토스',
    typeName: '내면을 다스리는 자',
    era: '로마 스토아 (AD 50–135)',
    headline: '당신은 통제할 수 있는 것에 집중하며 마음의 평정을 찾는 사람입니다',
    description:
      '당신은 외부 상황보다 자신의 반응에 주목합니다. 어떤 상황에서도 내면의 평화를 유지하려 하고, 감정에 휩쓸리기보다 이성적으로 대처하는 힘을 키워왔습니다. 진정한 자유는 내면에 있다는 것을 압니다.',
    quote: '고통은 필연이지만, 괴로움은 선택이다.',
    quoteContext: '에픽테토스의 핵심 — 우리가 통제할 수 있는 것과 없는 것의 구분',
    symbol: 'Anchor',
    compatibleType: 'kant',
    samplePrescription: {
      concern: '다른 사람의 말에 너무 상처받아요',
      text: '상처받은 것은 당신의 반응이지, 그 말 자체가 아닙니다. 오늘, 내가 통제할 수 있는 것에만 에너지를 쓰겠다고 결심해보세요. 그 선택만으로도 하루가 달라집니다.',
    },
  },
  epicurus: {
    key: 'epicurus',
    name: '에피쿠로스',
    typeName: '지금을 즐기는 자',
    era: '고대 그리스 (BC 341–270)',
    headline: '당신은 소소한 순간에서 진정한 행복을 발견하는 사람입니다',
    description:
      '당신은 거창한 성취보다 오늘의 작은 기쁨을 소중히 여깁니다. 좋은 음식, 따뜻한 대화, 햇살 같은 일상의 감각에서 충만함을 느낍니다. 행복이 멀리 있지 않다는 것을 몸으로 알고 있습니다.',
    quote: '현명하고 고결하게 살지 않으면서 즐겁게 살 수는 없다.',
    quoteContext: '에피쿠로스의 쾌락주의 — 진정한 즐거움은 절제와 우정에 있다',
    symbol: 'Sun',
    compatibleType: 'confucius',
    samplePrescription: {
      concern: '미래가 너무 불안하고 걱정돼요',
      text: '지금 이 순간, 당신 곁에 있는 좋은 것 하나를 찾아보세요. 미래의 불안은 현재를 살지 않을 때 더 커집니다. 오늘 저녁 한 가지, 당신을 기쁘게 할 작은 것을 계획해보세요.',
    },
  },
  confucius: {
    key: 'confucius',
    name: '공자',
    typeName: '관계를 소중히 하는 자',
    era: '중국 춘추시대 (BC 551–479)',
    headline: '당신은 사람과의 관계 속에서 의미와 성장을 찾는 사람입니다',
    description:
      '당신에게 삶의 중심은 사람입니다. 신뢰를 쌓고, 상대를 배려하고, 자신의 역할에 최선을 다하는 것이 삶의 방식입니다. 함께하는 것에서 혼자서는 얻을 수 없는 무언가를 발견합니다.',
    quote: '배우고 때로 익히면 또한 기쁘지 아니한가.',
    quoteContext: '논어 첫 구절 — 배움과 실천, 그리고 사람과의 나눔',
    symbol: 'Users',
    compatibleType: 'epicurus',
    samplePrescription: {
      concern: '소중한 사람과 사이가 멀어진 것 같아요',
      text: '관계는 말 한마디로 다시 가까워질 수 있습니다. 오늘 그 사람에게 먼저 연락해보세요. "잘 지내?"라는 한 마디가 때로는 긴 침묵을 녹입니다.',
    },
  },
  kant: {
    key: 'kant',
    name: '칸트',
    typeName: '원칙을 지키는 자',
    era: '근대 독일 (1724–1804)',
    headline: '당신은 어떤 상황에서도 자신의 원칙을 지키려 하는 사람입니다',
    description:
      '당신은 결과보다 과정을 중시합니다. 옳다고 생각하는 것은 어렵더라도 실천하고, 모든 사람에게 적용될 수 있는 기준으로 행동을 판단합니다. 일관성과 정직함이 당신의 강점입니다.',
    quote: '두 가지가 나를 경외심으로 채운다: 위의 별 하늘과 내 마음속의 도덕 법칙.',
    quoteContext: '순수이성비판 결론 — 자연의 질서와 도덕 법칙의 숭고함',
    symbol: 'Scale',
    compatibleType: 'epictetus',
    samplePrescription: {
      concern: '타협을 강요받는 상황이 너무 힘들어요',
      text: '당신이 불편함을 느끼는 이유가 있습니다. 그 불편함은 당신의 기준이 살아있다는 신호입니다. 모든 사람이 납득할 수 있는 행동 기준을 스스로에게 물어보세요. 그 답이 당신의 길입니다.',
    },
  },
  zhuangzi: {
    key: 'zhuangzi',
    name: '장자',
    typeName: '흐름을 따르는 자',
    era: '중국 전국시대 (BC 369–286)',
    headline: '당신은 억지로 하지 않고 자연스러운 흐름 속에서 길을 찾는 사람입니다',
    description:
      '당신은 통제하려 하기보다 흘러가도록 둡니다. 삶에는 인간의 의도로 파악되지 않는 더 큰 흐름이 있다고 느끼고, 그 흐름에 몸을 맡기는 것이 오히려 자유롭다는 것을 압니다.',
    quote: '꿈에 나비가 되었는지, 나비가 꿈에 사람이 되었는지 알 수 없다.',
    quoteContext: '장자의 호접몽 — 고정된 자아와 경계를 넘어서는 사유',
    symbol: 'Wind',
    compatibleType: 'nietzsche',
    samplePrescription: {
      concern: '모든 걸 내려놓고 싶어요',
      text: '그 마음이 잘못된 것이 아닙니다. 억지로 붙들고 있던 것들을 잠시 내려놓는 것, 그 자체가 지혜일 수 있습니다. 지금 당장 해결하려 하지 말고, 그냥 흘러가도록 두어보세요.',
    },
  },
  kierkegaard: {
    key: 'kierkegaard',
    name: '키르케고르',
    typeName: '의미를 찾는 자',
    era: '근대 덴마크 (1813–1855)',
    headline: '당신은 자신만의 진정한 삶의 의미를 탐색하는 사람입니다',
    description:
      '당신은 "왜 살아야 하는가"를 진지하게 묻습니다. 남들이 당연히 여기는 삶의 방식을 그대로 따르지 않고, 스스로 선택하고 책임지는 삶을 원합니다. 그 불안 속에 오히려 진정성이 있습니다.',
    quote: '가장 흔한 절망은 자기 자신이 되지 않기로 선택하는 것이다.',
    quoteContext: '사망에 이르는 병 — 실존적 절망과 진정한 자아의 선택',
    symbol: 'Compass',
    compatibleType: 'socrates',
    samplePrescription: {
      concern: '내가 진짜 원하는 게 뭔지 모르겠어요',
      text: '그 모름 자체가 출발점입니다. 다른 사람의 기대가 아닌 "나"로서 살았을 때 어떤 느낌일지 상상해보세요. 불안은 선택의 자유가 살아있다는 증거입니다.',
    },
  },
}

export const QUESTIONS: Question[] = [
  {
    id: 1,
    question: '요즘 내 머릿속을 가장 많이 차지하는 생각은?',
    choices: [
      {
        text: '이게 정말 맞는 건지, 왜 이런 건지 알고 싶다',
        scores: { socrates: 2, kierkegaard: 1 },
      },
      {
        text: '이 상황을 어떻게 바꾸고 더 나아갈 수 있을까',
        scores: { nietzsche: 2, kant: 1 },
      },
      {
        text: '지금 이 순간, 좋은 것들에 더 집중하고 싶다',
        scores: { epicurus: 2, zhuangzi: 1 },
      },
      {
        text: '내가 해야 할 역할을 제대로 하고 있는 걸까',
        scores: { confucius: 2, epictetus: 1 },
      },
    ],
  },
  {
    id: 2,
    question: '힘든 일이 생겼을 때 내가 가장 먼저 하는 것은?',
    choices: [
      {
        text: '내가 어쩔 수 없는 것과 할 수 있는 것을 구분한다',
        scores: { epictetus: 2, zhuangzi: 1 },
      },
      {
        text: '이 상황이 내 삶에서 어떤 의미인지 찾으려 한다',
        scores: { kierkegaard: 2, socrates: 1 },
      },
      {
        text: '억지로 해결하려 하지 않고 시간이 흘러가도록 둔다',
        scores: { zhuangzi: 2, epicurus: 1 },
      },
      {
        text: '원칙에 맞는 해결 방법을 차분히 찾는다',
        scores: { kant: 2, confucius: 1 },
      },
    ],
  },
  {
    id: 3,
    question: '나에게 정말 좋은 하루란?',
    choices: [
      {
        text: '깊이 생각하고 대화하면서 무언가를 발견한 날',
        scores: { socrates: 2, kierkegaard: 1 },
      },
      {
        text: '좋아하는 것을 하고 충분히 쉰 날',
        scores: { epicurus: 2, zhuangzi: 1 },
      },
      {
        text: '해야 할 일을 해내고 뿌듯하게 마무리한 날',
        scores: { kant: 2, epictetus: 1 },
      },
      {
        text: '소중한 사람들과 따뜻하게 연결된 날',
        scores: { confucius: 2, epicurus: 1 },
      },
    ],
  },
  {
    id: 4,
    question: '관계에서 내가 가장 중요하게 생각하는 것은?',
    choices: [
      {
        text: '서로의 진짜 모습을 보여주며 깊이 연결되는 것',
        scores: { kierkegaard: 2, socrates: 1 },
      },
      {
        text: '서로의 역할을 다하고 믿음을 쌓아가는 것',
        scores: { confucius: 2, kant: 1 },
      },
      {
        text: '상대의 자유를 존중하고 묶어두지 않는 것',
        scores: { zhuangzi: 2, epictetus: 1 },
      },
      {
        text: '상대에게 의존하지 않고 각자 단단하게 서는 것',
        scores: { epictetus: 2, nietzsche: 1 },
      },
    ],
  },
  {
    id: 5,
    question: '나를 앞으로 나아가게 만드는 힘은?',
    choices: [
      {
        text: '지금의 나를 뛰어넘고 더 강해지고 싶다는 욕구',
        scores: { nietzsche: 2, kierkegaard: 1 },
      },
      {
        text: '이 일이 나에게 진정한 의미가 있다는 확신',
        scores: { kierkegaard: 2, socrates: 1 },
      },
      {
        text: '해야 한다는 의무감과 원칙에 대한 신념',
        scores: { kant: 2, confucius: 1 },
      },
      {
        text: '어떤 상황에서도 흔들리지 않겠다는 내면의 다짐',
        scores: { epictetus: 2, zhuangzi: 1 },
      },
    ],
  },
  {
    id: 6,
    question: '예상치 못한 변화나 위기 앞에서 나는?',
    choices: [
      {
        text: '일단 받아들이고 자연스럽게 흘러가도록 놔둔다',
        scores: { zhuangzi: 2, epicurus: 1 },
      },
      {
        text: '이걸 발판 삼아 더 나아갈 방법을 적극적으로 찾는다',
        scores: { nietzsche: 2, kierkegaard: 1 },
      },
      {
        text: '왜 이런 일이 생겼는지 근본부터 이해하려 한다',
        scores: { socrates: 2, kant: 1 },
      },
      {
        text: '지금 당장 안정을 되찾고 소소한 위안을 찾는다',
        scores: { epicurus: 2, confucius: 1 },
      },
    ],
  },
  {
    id: 7,
    question: '지금 이 순간 나에게 가장 필요한 것은?',
    choices: [
      {
        text: '나를 아끼는 사람들과 따뜻한 시간',
        scores: { confucius: 2, epicurus: 1 },
      },
      {
        text: '어떤 상황에도 흔들리지 않는 내면의 단단함',
        scores: { epictetus: 2, kant: 1 },
      },
      {
        text: '내가 진짜 무엇을 원하는지에 대한 이해',
        scores: { socrates: 2, kierkegaard: 1 },
      },
      {
        text: '아무 생각 없이 충분히 쉬고 충전하는 시간',
        scores: { epicurus: 2, zhuangzi: 1 },
      },
    ],
  },
]
