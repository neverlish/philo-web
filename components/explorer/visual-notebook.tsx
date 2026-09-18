import { Artwork } from './artwork'
import type { ExplorerSlug } from '@/lib/explorer/pages'

const plates = {
  plato: {
    name: '플라톤', title: '그림자를 보던 눈이 돌아서는 순간',
    alt: '동굴 벽의 그림자를 바라보는 사람들, 뒤편의 불과 물체, 빛이 들어오는 출구를 그린 상상화',
    caption: '벽의 그림자와 그것을 만드는 물체를 따로 살펴보세요. 시선을 돌리는 일이 배움의 출발이 됩니다.',
    labels: ['그림자에 익숙해짐', '시선을 돌려 살펴봄', '밖으로 나아가 배움', '동굴로 돌아옴'],
    note: '빛을 보면 곧바로 진리를 얻는다는 뜻은 아니에요. 인식의 전환과 교육, 공동체로의 귀환을 함께 묻는 비유입니다.',
    source: '읽기의 바탕 · 『국가』 7권',
  },
  aristotle: {
    name: '아리스토텔레스', title: '가운데를 고르는 대신, 상황을 살피기',
    alt: '고대 그리스의 회랑에서 스승과 두 성인이 서로의 말을 듣고 토론하는 상상화',
    caption: '같은 말도 누구에게, 언제 건네는지에 따라 달라집니다. 그림 속 대화를 떠올리며 판단의 이유를 살펴보세요.',
    labels: ['누구에게?', '언제?', '무엇 때문에?', '어떤 방식으로?'],
    note: '네 질문은 순서나 점수가 아니라 함께 고려할 조건이에요. 중용은 산술적인 중간도, 무엇이든 괜찮다는 뜻도 아닙니다.',
    source: '읽기의 바탕 · 『니코마코스 윤리학』 2권',
  },
  descartes: {
    name: '데카르트', title: '의심하는 동안에도, 생각은 일어난다',
    alt: '창문과 컵, 펼친 노트가 놓인 어두운 서재에서 생각에 잠긴 17세기 인물의 상상화',
    caption: '눈앞의 컵이 사라지는 이야기가 아니에요. 그것을 확실히 안다는 판단을 잠시 보류하는 데서 시작합니다.',
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
  return <section aria-labelledby="visual-notebook-title" className="bg-[#e5dac2] px-5 py-16 text-[#322819] sm:px-8">
    <div className="mx-auto max-w-5xl">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-[#88704b]/40 pb-6">
        <div>
          <p className="text-xs tracking-[0.2em] text-[#715b3b]">철학자의 그림 수첩</p>
          <h2 id="visual-notebook-title" className="mt-3 font-serif text-3xl leading-relaxed sm:text-4xl">한 장면에서, 한 생각으로.</h2>
        </div>
        <p className="max-w-xs text-sm leading-7">그림을 천천히 보고,<br />그 아래 생각의 길을 따라가보세요.</p>
      </div>
      <div className="space-y-16">
        {subjects[slug].map((subject, index) => {
          const plate = plates[subject]
          const contextual = subject === 'aristotle'
          return <article key={subject} aria-labelledby={`plate-${subject}`}>
            <p className="mb-3 text-xs tracking-widest text-[#715b3b]">도판 {String(index + 1).padStart(2, '0')} · {plate.name}</p>
            <h3 id={`plate-${subject}`} className="mb-6 font-serif text-2xl leading-relaxed">{plate.title}</h3>
            <figure>
              <Artwork visual={subject} slug={slug} alt={plate.alt} />
              <figcaption className="mt-4 flex flex-col gap-2 text-sm leading-7 sm:flex-row sm:gap-8">
                <span className="shrink-0 text-xs text-[#715b3b]">AI 생성 상상화 · 역사적 복원 아님</span>
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
