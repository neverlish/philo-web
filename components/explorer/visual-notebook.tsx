import { Artwork } from './artwork'
import { PlatoLooking } from './plato-looking'
import { AristotleTable } from './aristotle-table'
import type { ExplorerSlug } from '@/lib/explorer/pages'

const plates = {
  plato: {
    name: '플라톤', title: '보이는 것은, 전부일까.',
    alt: '어두운 돌벽에 크게 드리워진 작은 토기의 그림자와 가느다란 빛을 그린 상징 회화',
    caption: '작은 사물과 크게 드리워진 그림자. 같은 것이라고 믿었던 둘 사이에 잠시 머물러보세요. 동굴 전체의 재현이 아니라, 보이는 것에 관한 질문을 담은 그림입니다.',
    labels: ['그림자에 익숙해짐', '시선을 돌려 살펴봄', '밖으로 나아가 배움', '동굴로 돌아옴'],
    note: '빛을 보면 곧바로 진리를 얻는다는 뜻은 아니에요. 인식의 전환과 교육, 공동체로의 귀환을 함께 묻는 비유입니다.',
    source: '읽기의 바탕 · 『국가』 7권',
  },
  aristotle: {
    name: '아리스토텔레스', title: '말을 건네기 전의, 잠깐.',
    alt: '어두운 나무 식탁을 사이에 두고 마주한 두 사람의 손과 작은 잔을 그린 회화',
    caption: '마주한 손, 아직 건네지 않은 말. 같은 말도 누구에게, 언제 하는지에 따라 달라져요. 특정한 원전 장면이 아니라 판단 직전의 순간을 상상한 그림입니다.',
    labels: ['누구에게?', '언제?', '무엇 때문에?', '어떤 방식으로?'],
    note: '네 질문은 순서나 점수가 아니라 함께 고려할 조건이에요. 중용은 산술적인 중간도, 무엇이든 괜찮다는 뜻도 아닙니다.',
    source: '읽기의 바탕 · 『니코마코스 윤리학』 2권',
  },
  descartes: {
    name: '데카르트', title: '익숙한 방이, 낯설어질 때.',
    alt: '흐린 창문과 물이 든 유리잔, 그림자 속 빈 의자가 놓인 고요한 방을 그린 회화',
    caption: '물잔도, 창밖도 그대로인데 잠시 낯설어집니다. 사물이 사라지는 것이 아니라 확실히 안다는 판단을 멈춰보는 장면이에요. 데카르트의 실제 방을 복원한 그림은 아닙니다.',
    labels: ['확실하다고 여긴 것', '의심할 여지가 있는가?', '의심하고 생각하는 나'],
    note: '이 흐름은 생각하는 자신의 존재를 출발점으로 삼는 부분만 보여줘요. 세계가 가짜라거나 생각이 현실을 만든다는 주장은 아닙니다.',
    source: '읽기의 바탕 · 『방법서설』 4부',
  },
} as const

type Subject = keyof typeof plates
const subjects: Record<ExplorerSlug, readonly Subject[]> = {
  index: ['plato', 'aristotle', 'descartes'],
  plato: ['plato'], aristotle: ['aristotle'], descartes: ['descartes'],
  compare: ['plato', 'descartes'], map: [],
}

/** Crawlable reading with a small client boundary for explicit artwork clicks. */
export function VisualNotebook({ slug }: { slug: ExplorerSlug }) {
  if (!subjects[slug].length) return null
  return <section aria-labelledby="visual-notebook-title" className="bg-[#f2f0e9] px-5 py-16 text-[#29372f] sm:px-8 sm:py-24">
    <div className="mx-auto max-w-5xl">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-[#88704b]/40 pb-6">
        <div>
          <p className="text-xs tracking-[0.2em] text-[#535d53]">사유의 도록 · 세 개의 시선</p>
          <h2 id="visual-notebook-title" className="mt-4 font-serif text-3xl leading-relaxed sm:text-5xl">그림 앞에서,<br />질문이 시작됩니다.</h2>
        </div>
        <p className="max-w-xs text-sm leading-7">먼저 바라보고, 잠시 머물러보세요.<br />해설은 그다음에 읽어도 좋아요.</p>
      </div>
      <div className="space-y-24 sm:space-y-32">
        {subjects[slug].map((subject, index) => {
          const plate = plates[subject]
          const contextual = subject === 'aristotle'
          return <article key={subject} aria-labelledby={`plate-${subject}`}>
            <p className="mb-3 text-xs tracking-widest text-[#715b3b]">도판 {String(index + 1).padStart(2, '0')} · {plate.name}</p>
            <h3 id={`plate-${subject}`} className="mb-8 max-w-2xl font-serif text-3xl leading-relaxed sm:text-4xl">{plate.title}</h3>
            <figure>
              {slug === 'plato' && subject === 'plato' ? <PlatoLooking />
                : slug === 'aristotle' && subject === 'aristotle' ? <AristotleTable />
                : <Artwork visual={subject} slug={slug} alt={plate.alt} />}
              <figcaption className="mt-4 flex flex-col gap-2 text-sm leading-7 sm:flex-row sm:gap-8">
                <span className="shrink-0 text-xs text-[#535d53]">AI 생성 상상화 · 역사적 복원 아님</span>
                <span>{plate.caption}</span>
              </figcaption>
            </figure>
            <div className="mt-7 border-y border-[#88704b]/40 py-6">
              <p className="mb-5 text-xs tracking-widest text-[#715b3b]">{contextual ? '판단을 둘러싼 네 질문' : '생각의 흐름 · 입문용 요약'}</p>
              {contextual ? <ul className="grid grid-cols-2 gap-5 sm:grid-cols-4">
                {plate.labels.map(label => <li key={label} className="border-l border-[#88704b] pl-4 font-serif text-lg">{label}</li>)}
              </ul> : <ol className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-5">
                {plate.labels.map((label, step) => <li key={label} className="flex flex-1 items-baseline gap-3 font-serif text-lg leading-8">
                  <span aria-hidden="true" className="text-sm text-[#715b3b]">{step + 1}.</span>
                  <span className="flex-1">{label}</span>
                  {step < plate.labels.length - 1 && <span aria-hidden="true" className="hidden text-[#715b3b] sm:inline">→</span>}
                </li>)}
              </ol>}
              <p className="mt-5 max-w-3xl text-sm leading-7">{plate.note}</p>
            </div>
            <p className="mt-3 text-xs leading-6 text-[#715b3b]">{plate.source} · 그림과 요약은 교육용 재구성이며 원전의 직접 인용이 아닙니다.</p>
          </article>
        })}
      </div>
    </div>
  </section>
}
