'use client'

import Link from 'next/link'
import { ArrowLeft, RotateCcw } from 'lucide-react'

export default function SearchError() {
  return (
    <main className="mx-auto min-h-dvh max-w-md bg-background px-6 py-6 text-foreground">
      <Link href="/" className="inline-flex min-h-11 items-center gap-2 text-sm text-muted">
        <ArrowLeft className="h-4 w-4" aria-hidden />
        홈으로
      </Link>
      <section aria-labelledby="search-error-title" className="mt-16 border-y border-foreground/10 py-10">
        <h1 id="search-error-title" className="font-serif text-3xl leading-snug">지혜를 불러오지<br />못했어요</h1>
        <p role="alert" className="mt-5 text-sm leading-7 text-muted">
          잠시 후 다시 시도해주세요. 입력한 검색어는 주소에 남아 있어요.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-foreground px-5 text-sm text-background focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          <RotateCcw className="h-4 w-4" aria-hidden />
          다시 시도
        </button>
        <Link href="/wisdom" className="mt-4 flex min-h-12 items-center justify-center text-sm text-muted underline underline-offset-4">
          고민별 철학 가이드 먼저 읽기
        </Link>
      </section>
    </main>
  )
}
