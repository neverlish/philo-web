'use client'

import Image from 'next/image'
import Link from 'next/link'
import { EXPLORER_PAGES } from '@/lib/explorer/pages'
import { trackExplorer } from '@/lib/posthog/explorer-events'

const invitations = {
  plato: { question: '그림자 너머에는 무엇이 있을까요?', action: '플라톤의 동굴로 들어가기', detail: '다섯 장면을 따라 시선을 돌려보세요.' },
  aristotle: { question: '같은 말도, 상황이 달라지면요?', action: '아리스토텔레스의 중용 체험하기', detail: '한마디를 고르고, 상황만 바꿔보세요.' },
  descartes: { question: '모든 것을 의심해도 남는 것은?', action: '데카르트의 방으로 들어가기', detail: '창문과 컵, 노트에서 생각을 시작해보세요.' },
} as const

export function PhilosopherExperienceLink({ slug }: { slug: string }) {
  if (slug !== 'plato' && slug !== 'aristotle' && slug !== 'descartes') return null
  const invitation = invitations[slug]
  return (
    <aside aria-label="이 철학자의 생각 체험하기" className="mb-9 border-y border-[#9A7C48]/40 bg-[#eee4cd]/30 py-6">
      <p className="mb-4 text-[11px] tracking-widest text-muted">읽은 생각 속으로 · 로그인 없이</p>
      <Link href={EXPLORER_PAGES[slug].path} prefetch={false}
        onClick={() => trackExplorer('explorer_entry_clicked', slug, { source: 'philosopher', philosopher: slug })}
        className="group flex items-center gap-5 py-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9A7C48]">
        <Image src={`/explorer/${slug}-oil-v1.webp`} alt="" width={80} height={108}
          sizes="80px" className="h-[108px] w-20 shrink-0 rounded-t-[40px] border border-[#9A7C48]/50 object-cover object-[73%_28%] p-1" />
        <div className="min-w-0">
          <h2 className="font-serif text-xl leading-8 text-foreground">{invitation.question}</h2>
          <p className="mt-2 text-xs leading-6 text-muted">{invitation.detail}</p>
          <p className="mt-3 text-xs leading-6 text-primary-readable underline underline-offset-4">{invitation.action} <span aria-hidden="true">→</span></p>
        </div>
      </Link>
      <p className="mt-3 text-[10px] leading-5 text-muted">초상은 AI로 재구성한 역사적 상상화입니다.</p>
    </aside>
  )
}
