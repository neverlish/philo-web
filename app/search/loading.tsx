import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function SearchLoading() {
  return (
    <main className="mx-auto min-h-dvh max-w-md bg-background px-6 py-6 text-foreground">
      <Link href="/" className="inline-flex min-h-11 items-center gap-2 text-sm text-muted">
        <ArrowLeft className="h-4 w-4" aria-hidden />
        홈으로
      </Link>
      <h1 className="mt-8 font-serif text-3xl">지혜 찾기</h1>
      <p role="status" className="mt-4 text-sm text-muted">검색할 지혜를 불러오고 있어요.</p>
      <div aria-hidden="true" className="mt-8 space-y-6 motion-safe:animate-pulse">
        <div className="h-14 rounded-2xl bg-primary/10" />
        <div className="h-4 w-36 rounded bg-primary/10" />
        <div className="h-36 rounded-2xl bg-primary/10" />
        <div className="h-36 rounded-2xl bg-primary/10" />
      </div>
    </main>
  )
}
