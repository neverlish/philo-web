// components/home/home-page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/navigation/header";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { PhilosophersList } from "@/components/home/philosophers-list";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase/client";
import type { DbPhilosopher } from "@/types";
import { ReflectionCard } from "@/components/home/reflection-card";

type ReflectionTarget = {
  id: string
  title: string
  philosopher_name: string
  user_intention: string | null
  created_at: string
}

const categories = [
  { label: "전체 보기", params: {} },
  { label: "스토아 철학", params: { keyword: "스토아" } },
  { label: "동양 사상", params: { region: "동양" } },
  { label: "현대 철학", params: { era: "현대" } },
];

export type CategoryFilter = { keyword?: string; region?: string; era?: string };

interface HomePageProps {
  initialPhilosophers: DbPhilosopher[];
  initialHasMore: boolean;
}

export function HomePage({ initialPhilosophers, initialHasMore }: HomePageProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [reflectionTarget, setReflectionTarget] = useState<ReflectionTarget | null>(null);

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
      .then(({ data: checkIn }) => {
        if (!checkIn) {
          router.push("/opening");
          return;
        }
        setChecking(false);
      });
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return

    const now = new Date()
    const sevenDaysAgo = new Date(now)
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const threeDaysAgo = new Date(now)
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)

    supabase
      .from('ai_prescriptions')
      .select('id, title, philosopher_name, user_intention, created_at')
      .eq('user_id', user.id)
      .gte('created_at', sevenDaysAgo.toISOString())
      .lte('created_at', threeDaysAgo.toISOString())
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle()
      .then(async ({ data: prescription }) => {
        if (!prescription) return
        // Check if already reflected
        const { data: existing } = await supabase
          .from('prescription_reflections')
          .select('id')
          .eq('prescription_id', prescription.id)
          .eq('user_id', user.id)
          .maybeSingle()
        if (!existing) setReflectionTarget(prescription as ReflectionTarget)
      })
  }, [user])

  if (checking) return null;

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-background shadow-2xl">
      <Header title="지혜의 다리" />

      <main className="flex-1 flex flex-col px-6 pt-2 pb-32 overflow-y-auto">
        {reflectionTarget && (
          <ReflectionCard
            prescriptionId={reflectionTarget.id}
            prescriptionTitle={reflectionTarget.title}
            philosopherName={reflectionTarget.philosopher_name}
            userIntention={reflectionTarget.user_intention}
            daysAgo={Math.floor((Date.now() - new Date(reflectionTarget.created_at).getTime()) / 86400000)}
          />
        )}

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
            {categories.map((category, index) => (
              <button
                key={category.label}
                onClick={() => setSelectedCategory(index)}
                className={`flex-none px-5 py-2.5 rounded-full border font-serif text-sm whitespace-nowrap transition-colors ${
                  selectedCategory === index
                    ? "border-primary/30 bg-stone-100 text-foreground"
                    : "border-primary/20 bg-transparent text-muted hover:bg-stone-50 hover:text-foreground"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Cards */}
        <PhilosophersList
          initialPhilosophers={selectedCategory === 0 ? initialPhilosophers : []}
          initialHasMore={selectedCategory === 0 ? initialHasMore : true}
          filter={categories[selectedCategory].params}
        />

      </main>


      <BottomNav />
    </div>
  );
}
