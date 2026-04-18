"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { usePostHog } from "posthog-js/react"

export interface Post {
  id: string
  content: string
  philosopher_name: string | null
  author_name: string
  likes_count: number
  created_at: string
  isLiked: boolean
}

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}분 전`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}시간 전`
  return `${Math.floor(hours / 24)}일 전`
}

const PAGE_SIZE = 10

export function useCollectiveFeed() {
  const [posts, setPosts] = useState<Post[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState<"latest" | "popular">("latest")
  const [showCompose, setShowCompose] = useState(false)
  const [composeText, setComposeText] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const offsetRef = useRef(0)
  const posthog = usePostHog()

  const fetchPosts = useCallback(async (reset = false, currentSort = sort) => {
    const offset = reset ? 0 : offsetRef.current
    if (!reset && (loading || !hasMore)) return
    if (reset) setLoading(true)
    try {
      const res = await fetch(`/api/collective?offset=${offset}&sort=${currentSort}&limit=${PAGE_SIZE}`)
      if (!res.ok) return
      const data = await res.json()
      const next: Post[] = data.posts ?? []
      setPosts((prev) => reset ? next : [...prev, ...next])
      offsetRef.current = reset ? next.length : offsetRef.current + next.length
      setHasMore(data.hasMore)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [sort, loading, hasMore])

  useEffect(() => {
    offsetRef.current = 0
    setHasMore(true)
    fetchPosts(true, sort)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort])

  useEffect(() => {
    if (!hasMore) return
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) fetchPosts() },
      { rootMargin: "200px" }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [fetchPosts, hasMore])

  const handleLike = async (post: Post) => {
    const prevLiked = post.isLiked
    posthog?.capture("collective_post_liked", { post_id: post.id, liked: !prevLiked })
    setPosts((prev) =>
      prev.map((p) =>
        p.id === post.id
          ? { ...p, isLiked: !prevLiked, likes_count: p.likes_count + (prevLiked ? -1 : 1) }
          : p
      )
    )
    try {
      const method = prevLiked ? "DELETE" : "POST"
      const res = await fetch(`/api/collective/${post.id}/like`, { method })
      if (!res.ok) throw new Error()
    } catch {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id
            ? { ...p, isLiked: prevLiked, likes_count: p.likes_count + (prevLiked ? 1 : -1) }
            : p
        )
      )
    }
  }

  const handleSubmit = async () => {
    if (!composeText.trim() || submitting) return
    setSubmitting(true)
    try {
      const res = await fetch("/api/collective", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: composeText.trim() }),
      })
      if (!res.ok) return
      posthog?.capture("collective_post_submitted")
      setComposeText("")
      setShowCompose(false)
      setSort("latest")
      offsetRef.current = 0
      setHasMore(true)
      fetchPosts(true, "latest")
    } catch {
      // ignore
    } finally {
      setSubmitting(false)
    }
  }

  return {
    posts, hasMore, loading, sort, setSort,
    showCompose, setShowCompose,
    composeText, setComposeText,
    submitting, sentinelRef,
    handleLike, handleSubmit,
  }
}
