// lib/data.ts
import { Philosopher, Quote, Prescription, SavedPrescription } from "@/types";

export const philosophers: Philosopher[] = [
  {
    id: "marcus-aurelius",
    name: "마르쿠스 아우렐리우스",
    nameEn: "Marcus Aurelius",
    era: "고대 (121-180)",
    school: "스토아 학파",
    description: "로마 제국의 철학자 황제. <명상록>을 저술하여 스토아 철학의 핵심을 전했다.",
  },
  {
    id: "seneca",
    name: "세네카",
    nameEn: "Seneca",
    era: "고대 (기원전 4-기원후65)",
    school: "스토아 학파",
    description: "로마의 철학자이자 정치가. 시간과 삶의 가치에 대해 깊이 탐구했다.",
  },
  {
    id: "epicurus",
    name: "에피쿠로스",
    nameEn: "Epicurus",
    era: "고대 (기원전341-270)",
    school: "에피쿠로스 학파",
    description: "진정한 행복은 욕망을 줄이고 마음의 평화를 얻는 것이라 가르쳤다.",
  },
  {
    id: "laozi",
    name: "노자",
    nameEn: "Laozi",
    era: "고대 (기원전6세기)",
    school: "도가",
    description: "도덕경의 저자. 무위자연과 물의 철학을 설파했다.",
  },
];

export const quotes: Quote[] = [
  {
    id: "quote-1",
    philosopherId: "marcus-aurelius",
    text: "타인이 너를 어떻게 생각하는지는 너의 통제 범위 밖이다. 네가 집중해야 할 유일한 것은 오직 자신의 정의로운 행동과 품위뿐이다.",
    meaning: "우리는 종종 내가 아닌 타인의 시선이라는 거울을 통해 자신을 바라봅니다. 하지만 스토아 철학자 마르쿠스 아우렐리우스는 우리에게 단호하게 조언합니다. 타인의 생각은 결코 우리가 조절할 수 있는 영역이 아니라고 말이죠.",
    application: "오늘 하루, 남의 시선이 의식될 때마다 눈을 감고 깊은 숨을 세 번 들이마셔 보세요. 그리고 '그건 내 몫이 아니야'라고 작게 속삭여보세요.",
    category: "인간관계",
    date: "2024-05-20",
  },
  {
    id: "quote-2",
    philosopherId: "seneca",
    text: "우리가 가진 시간이 부족한 것이 아니라, 우리가 너무 많은 시간을 허비하는 것입니다.",
    meaning: "시간은 부족하지 않습니다. 우리가 시간을 낭비하고 있을 뿐입니다. 세네카는 우리에게 시간의 소중함을 일깨웁니다.",
    application: "오늘 당장 할 수 있는 일을 미루지 마세요. 지금 이 순간이 가장 소중한 시간입니다.",
    category: "시간",
    date: "2024-05-18",
  },
  {
    id: "quote-3",
    philosopherId: "epicurus",
    text: "가진 것에 만족하지 못하는 사람은 세계를 소유하더라도 불행할 것이다.",
    meaning: "진정한 행복은 더 많이 갖는 것이 아니라, 가진 것에 만족하는 능력에서 옵니다.",
    application: "오늘 이미 가진 것 three 가지에 대해 감사해보세요.",
    category: "행복",
    date: "2024-05-12",
  },
];

export const prescriptions: Prescription[] = [
  {
    id: "prescription-1",
    quote: quotes[0],
    philosopher: philosophers[0],
    title: "타인을 의식하는 마음에 대하여",
    subtitle: "관점의 전환이 필요한 순간",
  },
  {
    id: "prescription-2",
    quote: quotes[1],
    philosopher: philosophers[1],
    title: "불안을 다스리는 지혜",
    subtitle: "지금 이 순간에 집중하기",
  },
  {
    id: "prescription-3",
    quote: quotes[2],
    philosopher: philosophers[2],
    title: "진정한 행복의 기원",
    subtitle: "내면의 충족감 찾기",
  },
];

export const savedPrescriptions: SavedPrescription[] = [
  {
    id: "saved-1",
    prescriptionId: "prescription-1",
    savedAt: "2024-05-20",
    prescription: prescriptions[0],
  },
  {
    id: "saved-2",
    prescriptionId: "prescription-2",
    savedAt: "2024-05-18",
    prescription: prescriptions[1],
  },
  {
    id: "saved-3",
    prescriptionId: "prescription-3",
    savedAt: "2024-05-12",
    prescription: prescriptions[2],
  },
];

export const sharedThoughts = [
  {
    id: "thought-1",
    content: "인간관계가 너무 힘들어요",
    authorName: "익명",
    createdAt: "2시간 전",
    likes: 12,
  },
  {
    id: "thought-2",
    content: "내가 뭘 원하는지 모르겠어요",
    authorName: "익명",
    createdAt: "5시간 전",
    likes: 8,
  },
];
