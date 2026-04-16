// components/collective/collective-feed.tsx
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Plus, X, Loader2 } from "lucide-react";
import { usePostHog } from "posthog-js/react";

interface Post {
  id: string;
  content: string;
  philosopher_name: string | null;
  author_name: string;
  likes_count: number;
  created_at: string;
  isLiked: boolean;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}분 전`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}시간 전`;
  return `${Math.floor(hours / 24)}일 전`;
}

const PAGE_SIZE = 10;

export function CollectiveFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<"latest" | "popular">("latest");
  const [showCompose, setShowCompose] = useState(false);
  const [composeText, setComposeText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const posthog = usePostHog();

  const fetchPosts = useCallback(async (reset = false, currentSort = sort) => {
    const offset = reset ? 0 : offsetRef.current;
    if (!reset && (loading || !hasMore)) return;
    if (reset) setLoading(true);

    try {
      const res = await fetch(`/api/collective?offset=${offset}&sort=${currentSort}`);
      if (!res.ok) return;
      const data = await res.json();
      const next: Post[] = data.posts ?? [];
      setPosts((prev) => reset ? next : [...prev, ...next]);
      offsetRef.current = reset ? next.length : offsetRef.current + next.length;
      setHasMore(data.hasMore);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [sort, loading, hasMore]);

  useEffect(() => {
    offsetRef.current = 0;
    setHasMore(true);
    fetchPosts(true, sort);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort]);

  useEffect(() => {
    if (!hasMore) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) fetchPosts(); },
      { rootMargin: "200px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [fetchPosts, hasMore]);

  const handleLike = async (post: Post) => {
    const prevLiked = post.isLiked;
    posthog?.capture('collective_post_liked', { post_id: post.id, liked: !prevLiked })
    setPosts((prev) =>
      prev.map((p) =>
        p.id === post.id
          ? { ...p, isLiked: !prevLiked, likes_count: p.likes_count + (prevLiked ? -1 : 1) }
          : p
      )
    );
    try {
      const method = prevLiked ? "DELETE" : "POST";
      const res = await fetch(`/api/collective/${post.id}/like`, { method });
      if (!res.ok) throw new Error();
    } catch {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id
            ? { ...p, isLiked: prevLiked, likes_count: p.likes_count + (prevLiked ? 1 : -1) }
            : p
        )
      );
    }
  };

  const handleSubmit = async () => {
    if (!composeText.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/collective", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: composeText.trim() }),
      });
      if (!res.ok) return;
      posthog?.capture('collective_post_submitted')
      setComposeText("");
      setShowCompose(false);
      setSort("latest");
      offsetRef.current = 0;
      setHasMore(true);
      fetchPosts(true, "latest");
    } catch {
      // ignore
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative">
      {/* 정렬 */}
      <div className="flex gap-4 px-6 pt-4 pb-3 border-b border-border">
        {(["latest", "popular"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setSort(s)}
            className={`text-sm font-medium transition-colors pb-1 border-b-2 ${
              sort === s ? "border-primary text-foreground" : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            {s === "latest" ? "최신" : "인기"}
          </button>
        ))}
      </div>

      {/* 피드 */}
      <div className="px-4 pt-5 pb-6">
        {loading && posts.length === 0 ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 text-muted animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-muted text-sm">아직 나눈 생각이 없어요</p>
            <p className="text-xs text-muted mt-1">첫 번째로 생각을 나눠보세요</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.05, 0.3) }}
                className="bg-card border border-border rounded-2xl p-5"
              >
                {post.philosopher_name && (
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-medium tracking-wider uppercase bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                      {post.philosopher_name}
                    </span>
                    <span className="text-xs text-muted">{timeAgo(post.created_at)}</span>
                  </div>
                )}
                {!post.philosopher_name && (
                  <p className="text-xs text-muted mb-3">{timeAgo(post.created_at)}</p>
                )}

                <p className="text-sm leading-relaxed text-foreground mb-4 break-keep">
                  {post.content}
                </p>

                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-full bg-stone-200 flex items-center justify-center">
                    <span className="text-[10px] font-medium text-stone-600">
                      {post.author_name[0]}
                    </span>
                  </div>
                  <span className="text-xs text-muted">{post.author_name}</span>
                </div>

                <div className="flex items-center pt-3 border-t border-border/50">
                  <button
                    onClick={() => handleLike(post)}
                    className={`flex items-center gap-1.5 transition-colors ${
                      post.isLiked ? "text-primary" : "text-muted hover:text-foreground"
                    }`}
                  >
                    <Heart className="w-4 h-4" fill={post.isLiked ? "currentColor" : "none"} />
                    <span className="text-xs font-medium">{post.likes_count}</span>
                  </button>
                </div>
              </motion.div>
            ))}

            {hasMore && (
              <div ref={sentinelRef} className="flex justify-center py-4">
                {loading && <Loader2 className="w-5 h-5 text-muted animate-spin" />}
              </div>
            )}
          </div>
        )}
      </div>

      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowCompose(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center z-20"
      >
        <Plus className="w-6 h-6" />
      </motion.button>

      {/* Compose Modal */}
      <AnimatePresence>
        {showCompose && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-30"
              onClick={() => setShowCompose(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-background rounded-t-3xl p-6 z-40 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-medium">생각 나누기</h2>
                <button
                  onClick={() => setShowCompose(false)}
                  className="p-1.5 rounded-full hover:bg-stone-100 transition-colors"
                >
                  <X className="w-4 h-4 text-muted" />
                </button>
              </div>

              <textarea
                autoFocus
                value={composeText}
                onChange={(e) => setComposeText(e.target.value)}
                placeholder="오늘의 철학적 사유를 나눠보세요..."
                maxLength={500}
                rows={5}
                className="w-full resize-none bg-stone-50 rounded-2xl p-4 text-sm leading-relaxed text-foreground placeholder:text-muted outline-none border border-border focus:border-primary/40 transition-colors"
              />
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-muted">{composeText.length}/500</span>
                <button
                  onClick={handleSubmit}
                  disabled={!composeText.trim() || submitting}
                  className="flex items-center gap-2 bg-foreground text-background px-5 py-2.5 rounded-xl text-sm font-medium disabled:opacity-40 transition-opacity"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  나누기
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
