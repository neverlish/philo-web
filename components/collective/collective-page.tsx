// components/collective/collective-page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ParticleCanvas } from "@/components/animations/particle-canvas";
import { Heart, MessageCircle, Share2 } from "lucide-react";

interface CollectiveThought {
  id: string;
  content: string;
  author: string;
  likes: number;
  comments: number;
  timeAgo: string;
  philosopher: string;
}

const mockThoughts: CollectiveThought[] = [
  {
    id: "1",
    content: "오늘 마르쿠스 아우렐리우스의 글을 읽고 내면의 평화를 찾았어요. 통제할 수 없는 것에 대해 걱정하지 않기로 했니다.",
    author: "지혜찾는사람",
    likes: 42,
    comments: 8,
    timeAgo: "2시간 전",
    philosopher: "마르쿠스 아우렐리우스",
  },
  {
    id: "2",
    content: "장자의 물 이야기가 오늘의 고민을 해결해주었어요. 유연함이 강함보다 중요하다는 것을 깨달았습니다.",
    author: "물처럼살기",
    likes: 38,
    comments: 12,
    timeAgo: "5시간 전",
    philosopher: "장자",
  },
  {
    id: "3",
    content: "세네카의 '시간은 우리가 가진 것이 아니라 우리가 되는 것'이라는 말이 오늘 특히 와닿네요. 시간을 낭비하지 않기로 했어요.",
    author: "시간의주인",
    likes: 56,
    comments: 15,
    timeAgo: "8시간 전",
    philosopher: "세네카",
  },
  {
    id: "4",
    content: "에피쿠로스의 쾌락론을 다시 읽어보았어요. 진정한 행복은 단순한 것에서 온다는 걸 자꾸 잊게 되네요.",
    author: "단순한행복",
    likes: 31,
    comments: 6,
    timeAgo: "1일 전",
    philosopher: "에피쿠로스",
  },
  {
    id: "5",
    content: "노자의 도덕경 8장을 묵상했어요. 물처럼 낮은 곳으로 흐르는 것이 역설적으로 가장 강한 힘이라는 것을 체득하고 있어요.",
    author: "도를찾아서",
    likes: 67,
    comments: 21,
    timeAgo: "1일 전",
    philosopher: "노자",
  },
];

export function CollectivePage() {
  const [thoughts, setThoughts] = useState<CollectiveThought[]>(mockThoughts);
  const [likedThoughts, setLikedThoughts] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<"latest" | "popular">("latest");

  const handleLike = (id: string) => {
    setLikedThoughts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
        setThoughts((prev) =>
          prev.map((t) => (t.id === id ? { ...t, likes: t.likes - 1 } : t))
        );
      } else {
        newSet.add(id);
        setThoughts((prev) =>
          prev.map((t) => (t.id === id ? { ...t, likes: t.likes + 1 } : t))
        );
      }
      return newSet;
    });
  };

  const sortedThoughts = [...thoughts].sort((a, b) => {
    if (filter === "popular") {
      return b.likes - a.likes;
    }
    return 0; // In a real app, would sort by timestamp
  });

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-background shadow-2xl relative overflow-hidden">
      {/* Particle Canvas Background */}
      <div className="absolute inset-0 pointer-events-none">
        <ParticleCanvas />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-border bg-background/80 backdrop-blur-sm px-6 py-5">
        <h1 className="text-2xl font-serif font-normal text-center">
          함께 나누기
        </h1>
        <p className="text-xs text-muted text-center mt-2">
          모두의 철학적 사유와 공감하기
        </p>

        {/* Filter Tabs */}
        <div className="flex gap-4 mt-5 justify-center">
          <button
            onClick={() => setFilter("latest")}
            className={`text-sm font-medium transition-colors pb-1 border-b-2 ${
              filter === "latest"
                ? "border-primary text-foreground"
                : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            최신
          </button>
          <button
            onClick={() => setFilter("popular")}
            className={`text-sm font-medium transition-colors pb-1 border-b-2 ${
              filter === "popular"
                ? "border-primary text-foreground"
                : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            인기
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 flex-1 overflow-y-auto px-4 pt-6 pb-32">
        <div className="space-y-4">
          {sortedThoughts.map((thought, index) => (
            <motion.div
              key={thought.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-5 hover:bg-card/70 transition-colors"
            >
              {/* Philosopher Tag */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-medium tracking-wider uppercase bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                  {thought.philosopher}
                </span>
                <span className="text-xs text-muted">{thought.timeAgo}</span>
              </div>

              {/* Content */}
              <p className="text-sm leading-relaxed text-foreground mb-4 break-keep">
                {thought.content}
              </p>

              {/* Author */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-stone-200 flex items-center justify-center">
                  <span className="text-[10px] font-medium text-stone-600">
                    {thought.author[0]}
                  </span>
                </div>
                <span className="text-xs text-muted">{thought.author}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-6 pt-3 border-t border-border/50">
                <button
                  onClick={() => handleLike(thought.id)}
                  className={`flex items-center gap-1.5 transition-colors ${
                    likedThoughts.has(thought.id)
                      ? "text-primary"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  <Heart
                    className="w-4 h-4"
                    fill={likedThoughts.has(thought.id) ? "currentColor" : "none"}
                  />
                  <span className="text-xs font-medium">{thought.likes}</span>
                </button>

                <button className="flex items-center gap-1.5 text-muted hover:text-foreground transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-xs font-medium">{thought.comments}</span>
                </button>

                <button className="flex items-center gap-1.5 text-muted hover:text-foreground transition-colors ml-auto">
                  <Share2 className="w-4 h-4" />
                  <span className="text-xs font-medium">공유</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Share FAB */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center z-20"
      >
        <span className="material-symbols-outlined">add</span>
      </motion.button>
    </div>
  );
}
