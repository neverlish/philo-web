import type { Metadata } from 'next'
import { FriendshipReflection } from '@/components/practice/friendship-reflection'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '친구에게 화가 난 날 — 생각을 다시 보는 철학 연습',
  description: '첫 생각과 달라진 생각을 비교하고 작은 실험으로 이어가세요. 로그인 없이 시작하고, 원할 때만 이 기기에 기록을 남기는 생활 철학 연습.',
  alternates: { canonical: '/practice/friendship' },
  openGraph: { title: '친구에게 화가 난 날', description: '같은 말, 다른 사정. 내 판단을 다시 보는 작은 철학 연습.', url: '/practice/friendship', images: ['/explorer/aristotle-scene-v2.webp'] },
  twitter: { card: 'summary_large_image', title: '친구에게 화가 난 날 — 생활 철학 연습', description: '아리스토텔레스의 중용에서 출발해 내 판단을 다시 살펴보세요.', images: ['/explorer/aristotle-scene-v2.webp'] },
}

export default function FriendshipPage() {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://philo-web.vercel.app'
  const structured = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'WebPage', name: '친구에게 화가 난 날 — 생각을 다시 보는 철학 연습', url: `${site}/practice/friendship`, inLanguage: 'ko-KR', isAccessibleForFree: true, image: `${site}/explorer/aristotle-scene-v2.webp` },
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: '오늘의철학', item: site },
      { '@type': 'ListItem', position: 2, name: '친구에게 화가 난 날', item: `${site}/practice/friendship` },
    ] },
  ] }
  return <main className="min-h-screen bg-[#f2f0e9]">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structured).replace(/</g, '\\u003c') }} />
    <FriendshipReflection />
    <section className="mx-auto max-w-3xl border-t border-[#35463d]/20 px-6 py-10 text-[#29372f]" aria-labelledby="friendship-about">
      <h2 id="friendship-about" className="font-serif text-2xl">친구와의 갈등을 철학으로 살펴보는 방법</h2>
      <p className="mt-4 text-sm leading-8">친구가 약속에 늦었을 때, 일어난 사실과 내가 붙인 해석은 같을까요? 이 연습은 첫 생각을 살펴보고 다른 사정을 만난 뒤, 내 불편을 어떻게 표현할지 다시 질문합니다. 상대를 무조건 이해하거나 내 감정을 참는 것이 목표는 아닙니다.</p>
      <h3 className="mt-6 font-serif text-lg">생각이 바뀌어야 하나요?</h3>
      <p className="mt-3 text-sm leading-8">아니요. 처음의 생각이 그대로여도 괜찮아요. 내 판단의 이유를 더 분명하게 알아보는 데 의미가 있습니다. 글을 적지 않고 가상의 상황만 따라가도 됩니다.</p>
      <h3 className="mt-6 font-serif text-lg">로그인하거나 기록을 저장해야 하나요?</h3>
      <p className="mt-3 text-sm leading-8">로그인과 저장은 필요하지 않습니다. 원할 때만 현재 브라우저에 기록 한 건을 저장할 수 있고, 다음 방문에 직접 이어볼 수 있습니다. 기록은 다른 기기와 동기화되지 않습니다.</p>
      <nav aria-label="함께 살펴볼 철학" className="mt-6 flex flex-wrap gap-5 text-sm underline underline-offset-4">
        <Link href="/">오늘의 질문으로 돌아가기</Link><Link href="/explore/aristotle">아리스토텔레스의 중용 체험</Link><Link href="/practice/control">통제할 수 있는 것 나누기</Link>
      </nav>
    </section>
  </main>
}
