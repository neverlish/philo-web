import type { Metadata } from 'next'
import Link from 'next/link'
import { ControlPractice } from '@/components/practice/control-practice'

export const metadata: Metadata = {
  title: '통제할 수 있는 것 나누기 — 로그인 없는 3분 철학 연습',
  description: '걱정 속에서 내가 선택할 행동과 뜻대로 되지 않는 결과를 나눠보세요. 에픽테토스의 철학에서 착안한 무료 연습 도구로, 로그인이나 AI 전송 없이 사용할 수 있습니다.',
  alternates: { canonical: '/practice/control' },
  openGraph: { title: '통제할 수 있는 것 나누기', description: '지금 선택할 수 있는 작은 행동 하나를 찾아보세요. 로그인 없이 쓰는 3분 철학 연습.', url: '/practice/control' },
}

export default function ControlPage() {
  return (
    <div className="min-h-dvh bg-[#F4F0E8] text-[#29231F]">
      <main className="mx-auto max-w-3xl px-5 py-8 sm:px-10">
        <Link href="/wisdom" className="text-sm text-[#655D56] underline underline-offset-4">← 고민별 철학</Link>
        <header className="border-b border-[#29231F]/20 pb-10 pt-14">
          <p className="text-xs tracking-[0.2em] text-[#9A5B38]">작은 철학 연습 / 01</p>
          <h1 className="mt-5 font-serif text-4xl leading-tight sm:text-6xl">통제할 수 있는 것<br />나누기</h1>
          <p className="mt-6 max-w-lg leading-8 text-[#655D56]">내가 바꿀 수 없는 결과와 지금 선택할 행동을 나눠보세요. 약 3분, 로그인 없이 나만의 다음 한 걸음을 정합니다.</p>
        </header>
        <section className="py-8 text-sm leading-7 text-[#655D56]" aria-label="사용 방법">
          <p>① 걱정을 짧게 적고 → ② 두 칸으로 나눈 뒤 → ③ 오늘 할 행동 하나를 정해보세요.</p>
          <p className="mt-2">예: 면접의 합격 여부는 내 뜻대로 정할 수 없지만, 예상 질문을 연습하는 행동은 선택할 수 있습니다.</p>
        </section>
        <ControlPractice />
        <section className="border-t border-[#29231F]/20 py-10 text-sm leading-7 text-[#655D56]">
          <h2 className="font-serif text-2xl text-[#29231F]">결과를 놓는 일과 포기는 달라요</h2>
          <p className="mt-4">에픽테토스는 엥케이리디온 제1절에서 자신의 판단과 행동을 평판이나 재산 같은 외부 조건과 구별합니다. 이 도구는 그 구분에서 착안한 오늘의철학의 연습이며, 원전의 분류를 그대로 재현하는 검사가 아닙니다.</p>
          <p className="mt-3">영향을 줄 수 있어도 결과를 보장할 수 없는 일이 있습니다. 그런 경우 결과와 내가 시도할 행동을 각각의 칸에 나누어 적어보세요. 힘든 상황의 책임을 모두 자신에게 돌리거나 위험한 상황을 참으라는 뜻은 아닙니다.</p>
          <a className="mt-4 inline-block underline underline-offset-4" href="https://classics.mit.edu/Epictetus/epicench.html">원전: 엥케이리디온 제1절 · Elizabeth Carter 영어 번역</a>
          <div className="mt-6 flex flex-wrap gap-5">
            <Link href="/philosopher/epictetus" className="underline underline-offset-4">에픽테토스 더 읽기</Link>
            <Link href="/wisdom/anxiety" className="underline underline-offset-4">불안에 관한 가이드</Link>
            <Link href="/wisdom/comparison" className="underline underline-offset-4">비교에 관한 가이드</Link>
          </div>
        </section>
      </main>
    </div>
  )
}
