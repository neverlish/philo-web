import type { ExplorerSlug } from '@/lib/explorer/pages'
import { searchIntent } from '@/lib/explorer/search-intents'

export function SearchIntroduction({ slug }: { slug: ExplorerSlug }) {
  const intent = searchIntent(slug)
  if (!intent) return null
  return <section aria-label="체험을 시작하기 전, 짧은 답" className="bg-[#f2f0e9] px-6 py-8 text-[#29372f] sm:py-10">
    <div className="mx-auto max-w-3xl border-l-2 border-[#9b7e4d] pl-5">
      <p className="text-xs tracking-widest text-[#715b3b]">그림으로 읽는 철학 · 로그인 없이</p>
      <p className="mb-3 mt-4 font-serif text-xl leading-relaxed sm:text-2xl">{intent.question}</p>
      <p className="text-sm leading-7">{intent.answer}</p>
      <p className="mt-4 text-xs leading-6 text-[#715b3b]">아래 장면을 직접 움직이며 살펴보세요. 정답을 제출하지 않아도 괜찮아요.</p>
    </div>
  </section>
}

export function SearchQuestions({ slug }: { slug: ExplorerSlug }) {
  const intent = searchIntent(slug)
  if (!intent) return null
  return <section aria-labelledby="search-questions-title" className="my-10 border-y border-[#88704b]/30 py-7">
    <h3 id="search-questions-title" className="font-serif text-xl">조금 더 궁금하다면</h3>
    <dl>{intent.questions.map(([question, answer]) => <div key={question} className="mt-6">
      <dt className="font-serif text-base leading-7">{question}</dt>
      <dd className="mt-2 text-sm leading-8">{answer}</dd>
    </div>)}</dl>
    <p className="mt-6 text-xs leading-6 text-[#715b3b]">읽기의 바탕: {intent.source}. 위 설명은 입문용 요약이며 원전의 직접 인용이 아닙니다.</p>
  </section>
}
