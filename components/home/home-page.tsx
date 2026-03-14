// components/home/home-page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/navigation/header";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { PhilosophersList } from "@/components/home/philosophers-list";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase/client";

const categories = ["전체 보기", "스토아 철학", "동양 사상", "현대 철학"];

export function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      setChecking(false);
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    supabase
      .from("check_ins")
      .select("id")
      .eq("user_id", user.id)
      .eq("check_in_date", today)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) {
          router.push("/opening");
        } else {
          setChecking(false);
        }
      });
  }, [user, loading, router]);

  if (checking) return null;

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-background shadow-2xl">
      <Header title="지혜의 다리" />

      <main className="flex-1 flex flex-col px-6 pt-2 pb-32 overflow-y-auto">
        {/* Today's Inspiration */}
        <div className="w-full mb-8 mt-2">
          <span className="inline-block mb-3 text-[10px] font-medium tracking-[0.2em] uppercase text-muted">
            오늘의 영감
          </span>
          <h2 className="text-3xl font-serif font-normal leading-tight text-foreground mb-4 break-keep">
            복잡함 속에서<br />
            단순함을 찾다
          </h2>
          <p className="text-muted text-sm leading-relaxed mb-6">
            진정한 지혜는 더하는 것이 아니라 덜어내는 과정에서 발견됩니다.
          </p>
          <div className="h-px w-full bg-primary/20" />
        </div>

        {/* Category Filters */}
        <div className="w-full mb-10">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                className="flex-none px-5 py-2.5 rounded-full border font-serif text-sm whitespace-nowrap transition-colors border-primary/20 bg-transparent text-muted hover:bg-stone-50 hover:text-foreground"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Content Cards */}
        <PhilosophersList />

        <div className="mt-12 mb-4 text-center">
          <button className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors font-medium border-b border-transparent hover:border-foreground pb-0.5">
            <span>더 많은 지혜 탐험하기</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
