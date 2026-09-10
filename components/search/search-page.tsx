'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Search, X } from 'lucide-react'
import { usePostHog } from 'posthog-js/react'
import { Header } from '@/components/navigation/header'
import { BottomNav } from '@/components/navigation/bottom-nav'
import { getPhilosopherPath } from '@/lib/philosopher-slugs'
import { searchContent, type SearchablePhilosopher, type SearchableQuote } from '@/lib/content-search'
import type { WisdomTopic } from '@/lib/wisdom-topics'

interface SearchPageProps {
  philosophers: SearchablePhilosopher[]
  topics: WisdomTopic[]
  quotes: SearchableQuote[]
  initialQuery: string
}

const suggestions = ['불안', '인간관계', '삶의 의미', '통제', '니체']

export function SearchPage({ philosophers, topics, quotes, initialQuery }: SearchPageProps) {
  const [query, setQuery] = useState(initialQuery)
  const inputRef = useRef<HTMLInputElement>(null)
  const posthog = usePostHog()
  const trimmedQuery = query.trim()
  const results = useMemo(
    () => searchContent(trimmedQuery, philosophers, topics, quotes),
    [trimmedQuery, philosophers, topics, quotes],
  )
  const total = results.philosophers.length + results.topics.length + results.quotes.length

  const updateQuery = (value: string) => {
    const nextQuery = value.slice(0, 100)
    setQuery(nextQuery)
    const url = new URL(window.location.href)
    if (nextQuery.trim()) url.searchParams.set('q', nextQuery.trim())
    else url.searchParams.delete('q')
    window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`)
  }

  useEffect(() => {
    const restoreQuery = () => {
      setQuery((new URL(window.location.href).searchParams.get('q') ?? '').slice(0, 100))
    }
    window.addEventListener('popstate', restoreQuery)
    return () => window.removeEventListener('popstate', restoreQuery)
  }, [])

  const trackSearch = (value: string) => {
    const found = searchContent(value, philosophers, topics, quotes)
    posthog?.capture('content_searched', {
      query: value,
      result_count: found.philosophers.length + found.topics.length + found.quotes.length,
    })
  }

  const chooseSuggestion = (suggestion: string) => {
    updateQuery(suggestion)
    trackSearch(suggestion)
    inputRef.current?.focus()
  }

  return (
    <div className="min-h-dvh max-w-md mx-auto bg-background shadow-2xl flex flex-col">
      <Header title="지혜 찾기" showSearch={false} showBack />

      <main className="flex-1 px-6 pb-28 pt-5">
        <form
          role="search"
          onSubmit={(event) => {
            event.preventDefault()
            if (trimmedQuery) trackSearch(trimmedQuery)
          }}
          className="relative"
        >
          <label htmlFor="content-search" className="sr-only">철학자와 고민별 가이드 검색</label>
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" strokeWidth={1.6} aria-hidden />
          <input
            ref={inputRef}
            id="content-search"
            name="q"
            type="text"
            enterKeyHint="search"
            autoFocus
            autoComplete="off"
            maxLength={100}
            value={query}
            onChange={(event) => updateQuery(event.target.value)}
            placeholder="고민이나 철학자를 검색하세요"
            className="h-14 w-full rounded-2xl border border-foreground/15 bg-card pl-12 pr-12 text-[15px] text-foreground shadow-[0_8px_30px_rgba(44,36,32,0.06)] outline-none transition focus:border-primary-readable focus:ring-2 focus:ring-primary/10"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                updateQuery('')
                inputRef.current?.focus()
              }}
              aria-label="검색어 지우기"
              className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-muted transition hover:bg-stone-100 hover:text-foreground"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          )}
        </form>

        <div className="mt-4 flex flex-wrap gap-2" aria-label="추천 검색어">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => chooseSuggestion(suggestion)}
              className="rounded-full border border-primary/15 bg-card px-3 py-1.5 text-xs text-muted transition hover:border-primary/40 hover:text-foreground"
            >
              {suggestion}
            </button>
          ))}
        </div>

        {!trimmedQuery ? (
          <section className="relative mt-16 overflow-hidden border-y border-foreground/10 py-12 text-center">
            <span className="absolute -right-2 -top-8 font-serif text-8xl text-primary/[0.06]" aria-hidden>?</span>
            <p className="text-[10px] font-semibold tracking-[0.24em] text-primary-readable">SEARCH FOR WISDOM</p>
            <h2 className="mt-4 font-serif text-2xl leading-relaxed text-foreground">
              좋은 검색은<br />좋은 질문에서 시작됩니다
            </h2>
            <p className="mx-auto mt-4 max-w-xs text-sm leading-6 text-muted">
              지금 마음에 걸리는 단어나 만나고 싶은 철학자의 이름을 입력해보세요.
            </p>
          </section>
        ) : (
          <div className="mt-10">
            <p className="mb-8 text-xs text-muted" aria-live="polite">
              <strong className="font-medium text-foreground">&lsquo;{trimmedQuery}&rsquo;</strong>에 관한 지혜 {total}개
            </p>

            {total === 0 && (
              <section className="rounded-2xl border border-dashed border-foreground/20 px-6 py-12 text-center">
                <p className="font-serif text-xl text-foreground">아직 연결된 지혜가 없어요</p>
                <p className="mt-3 text-sm leading-6 text-muted">짧은 단어로 다시 찾아보거나 추천 검색어를 선택해보세요.</p>
              </section>
            )}

            {results.topics.length > 0 && (
              <section aria-labelledby="guide-results" className="mb-12">
                <div className="mb-4 flex items-center justify-between border-b border-foreground/10 pb-3">
                  <h2 id="guide-results" className="text-[10px] font-semibold tracking-[0.22em] text-muted">고민별 철학 가이드</h2>
                  <span className="font-mono text-[10px] text-muted">0{results.topics.length}</span>
                </div>
                <div className="space-y-3">
                  {results.topics.map((topic) => (
                    <Link
                      key={topic.slug}
                      href={`/wisdom/${topic.slug}`}
                      onClick={() => posthog?.capture('search_result_clicked', { query: trimmedQuery, type: 'wisdom', slug: topic.slug })}
                      className="group block rounded-2xl border border-foreground/10 bg-card p-5 transition hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-[0_10px_30px_rgba(44,36,32,0.07)]"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[10px] font-semibold tracking-[0.18em]" style={{ color: topic.accent }}>{topic.eyebrow}</p>
                          <h3 className="mt-2 font-serif text-xl leading-snug text-foreground">{topic.title}</h3>
                        </div>
                        <span className="font-serif text-2xl" style={{ color: topic.accent }} aria-hidden>{topic.symbol}</span>
                      </div>
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">{topic.description}</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {results.quotes.length > 0 && (
              <section aria-labelledby="quote-results" className="mb-12">
                <div className="mb-2 flex items-center justify-between border-b border-foreground/10 pb-3">
                  <h2 id="quote-results" className="text-[10px] font-semibold tracking-[0.22em] text-muted">명언과 해설</h2>
                  <span className="font-mono text-[10px] text-muted">{String(results.quotes.length).padStart(2, '0')}</span>
                </div>
                <div className="divide-y divide-foreground/10">
                  {results.quotes.map((quote) => (
                    <Link
                      key={quote.id}
                      href={`${getPhilosopherPath(quote.philosopherId, quote.philosopherNameEn)}#quotes`}
                      onClick={() => posthog?.capture('search_result_clicked', { query: trimmedQuery, type: 'quote', id: quote.id })}
                      className="group block py-7"
                    >
                      <blockquote className="font-serif text-xl leading-8 text-foreground">
                        &ldquo;{quote.text}&rdquo;
                      </blockquote>
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">{quote.meaning}</p>
                      <div className="mt-4 flex items-center justify-between gap-4">
                        <p className="text-[10px] font-semibold tracking-[0.16em] text-primary-readable">
                          {quote.philosopherName}{quote.book ? ` · ${quote.book}` : ''}
                        </p>
                        <ArrowRight className="h-4 w-4 shrink-0 text-muted transition-transform group-hover:translate-x-1" strokeWidth={1.5} aria-hidden />
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {results.philosophers.length > 0 && (
              <section aria-labelledby="philosopher-results">
                <div className="mb-2 flex items-center justify-between border-b border-foreground/10 pb-3">
                  <h2 id="philosopher-results" className="text-[10px] font-semibold tracking-[0.22em] text-muted">철학자</h2>
                  <span className="font-mono text-[10px] text-muted">{String(results.philosophers.length).padStart(2, '0')}</span>
                </div>
                <div className="divide-y divide-foreground/10">
                  {results.philosophers.map((philosopher) => (
                    <Link
                      key={philosopher.id}
                      href={getPhilosopherPath(philosopher.id, philosopher.nameEn)}
                      onClick={() => posthog?.capture('search_result_clicked', { query: trimmedQuery, type: 'philosopher', id: philosopher.id })}
                      className="group flex items-center justify-between gap-5 py-6"
                    >
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold tracking-[0.16em] text-primary-readable">
                          {philosopher.region} · {philosopher.era}{philosopher.years ? ` · ${philosopher.years}` : ''}
                        </p>
                        <h3 className="mt-2 font-serif text-2xl text-foreground">{philosopher.name}</h3>
                        <p className="mt-1 truncate text-xs text-muted">{philosopher.nameEn}</p>
                        <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">{philosopher.coreIdea}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-muted transition-transform group-hover:translate-x-1" strokeWidth={1.5} aria-hidden />
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
