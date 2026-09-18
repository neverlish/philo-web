'use client'

import Link from 'next/link'
import { EXPLORER_PAGES, EXPLORER_SLUGS, type ExplorerSlug } from '@/lib/explorer/pages'
import { trackExplorer } from '@/lib/posthog/explorer-events'

const nextThought: Record<ExplorerSlug, { destination: ExplorerSlug; question: string; note: string }> = {
  index: { destination: 'plato', question: '우선, 동굴 안으로 들어가볼까요?', note: '그림자에서 시작하는 다섯 장면. 정답을 찾지 않아도 괜찮아요.' },
  plato: { destination: 'descartes', question: '보이는 것을, 다른 방식으로 의심한다면?', note: '이번에는 데카르트의 방으로 가보세요. 동굴의 비유와는 다른 출발점을 만납니다.' },
  descartes: { destination: 'compare', question: '동굴과 이 방은, 무엇이 달랐을까요?', note: '플라톤과 데카르트를 세 질문으로 나란히 놓아보세요.' },
  compare: { destination: 'aristotle', question: '이번에는 일상의 판단으로 가볼까요?', note: '약속에 늦은 친구에게 건넬 한마디. 아리스토텔레스의 중용을 만나는 작은 입구예요.' },
  aristotle: { destination: 'map', question: '이 생각은 누구와 연결되어 있을까요?', note: '플라톤에게 배운 아리스토텔레스. 배움의 관계와 관점의 비교를 지도에서 구분해보세요.' },
  map: { destination: 'aristotle', question: '이름과 이름 사이에서, 일상으로.', note: '아리스토텔레스의 체험에서 상황이 바뀌면 판단도 달라지는지 살펴보세요.' },
}

export function ContinueExploring({ slug }: { slug: ExplorerSlug }) {
  const next = nextThought[slug]
  const philosopher = EXPLORER_PAGES[slug].philosopher
  const navigate = (destination: ExplorerSlug, placement: 'recommendation' | 'footer') =>
    trackExplorer('explorer_navigation_clicked', slug, { destination, placement })
  const guide = (person: 'plato' | 'aristotle' | 'descartes') =>
    trackExplorer('explorer_guide_clicked', slug, { philosopher: person, placement: 'footer' })
  return (
    <div className="mt-12 border-t border-[#7c623a]/40 pt-8">
      <p className="text-[11px] tracking-[0.18em] text-[#766347]">다음 생각으로 · 정해진 순서는 없어요</p>
      <a href={EXPLORER_PAGES[next.destination].path}
        onClick={() => navigate(next.destination, 'recommendation')}
        className="group my-5 block border-l-2 border-[#9b7e4d] py-2 pl-5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7c623a]">
        <h3 className="font-serif text-2xl leading-relaxed sm:text-3xl">{next.question}</h3>
        <p className="mt-3 max-w-xl text-sm leading-7 text-[#65543c]">{next.note}</p>
        <span className="mt-4 inline-block py-2 text-sm underline underline-offset-4">{EXPLORER_PAGES[next.destination].title.split(' — ')[0]} <span aria-hidden="true">→</span></span>
      </a>
      <nav aria-label="다른 철학 체험" className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        {EXPLORER_SLUGS.filter(key => key !== slug && key !== next.destination).map(key =>
          <a key={key} href={EXPLORER_PAGES[key].path} onClick={() => navigate(key, 'footer')} className="inline-flex min-h-11 items-center underline underline-offset-4">{EXPLORER_PAGES[key].title.split(' — ')[0]}</a>
        )}
      </nav>
      <nav aria-label="핵심 사상 더 읽기" className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-[#7c623a]/20 pt-5 text-sm">
        {(slug === 'compare' ? ['plato', 'descartes'] as const : [philosopher]).map(person =>
          <Link key={person} prefetch={false} href={`/philosopher/${person}`} onClick={() => guide(person)} className="inline-flex min-h-11 items-center underline underline-offset-4">
            {{ plato: '플라톤', aristotle: '아리스토텔레스', descartes: '데카르트' }[person]}의 핵심 사상 더 읽기
          </Link>
        )}
        <Link href="/" prefetch={false} onClick={() => trackExplorer('explorer_home_clicked', slug, { placement: 'footer' })} className="inline-flex min-h-11 items-center underline underline-offset-4">오늘의철학 홈</Link>
      </nav>
    </div>
  )
}
