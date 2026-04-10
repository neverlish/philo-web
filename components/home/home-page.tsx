// components/home/home-page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/navigation/header";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { PhilosophersList } from "@/components/home/philosophers-list";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase/client";
import type { DbPhilosopher } from "@/types";
import { ReflectionCard } from "@/components/home/reflection-card";
import { ConcernSheet } from "@/components/home/concern-sheet";

type ReflectionTarget = {
  id: string
  title: string
  philosopher_name: string
  user_intention: string | null
  created_at: string
}

type TodayPrescription = {
  id: string
  title: string
  philosopher_name: string
  quote_text: string
}

const categories = [
  { label: "전체", params: {} },
  { label: "불안·두려움", params: { concerns: "통제,수용,의지,자기수양,고통" } },
  { label: "인간관계", params: { concerns: "관계,사랑,인(仁),예(禮),자비" } },
  { label: "자유·선택", params: { concerns: "자유,선택,책임,주체성" } },
  { label: "삶의 의미", params: { concerns: "행복,삶의 가치,존재,부조리,에우다이모니아" } },
];

export type CategoryFilter = { keyword?: string; region?: string; era?: string; concerns?: string };

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
  const [todayPrescription, setTodayPrescription] = useState<TodayPrescription | null>(null);
  const [showSheet, setShowSheet] = useState(false);
  const philosophersRef = useRef<HTMLDivElement>(null);

  const handleCategorySelect = (index: number) => {
    setSelectedCategory(index);
    setTimeout(() => {
      philosophersRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

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
        // 오늘 받은 처방 fetch
        supabase
          .from("ai_prescriptions")
          .select("id, title, philosopher_name, quote_text")
          .eq("user_id", user.id)
          .gte("created_at", `${today}T00:00:00`)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle()
          .then(({ data }) => {
            if (data) setTodayPrescription(data as TodayPrescription);
          });
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

        {/* Today's Prescription / CTA */}
        {user ? (
          <div className="w-full mb-8 mt-2">
            {todayPrescription ? (
              <a href={`/prescription/ai/${todayPrescription.id}`} className="block group">
                <span className="inline-block mb-3 text-[10px] font-medium tracking-[0.2em] uppercase text-muted">
                  오늘의 처방
                </span>
                <h2 className="text-2xl font-serif font-normal leading-tight text-foreground mb-3 break-keep group-hover:text-primary transition-colors">
                  {todayPrescription.title}
                </h2>
                <p className="text-muted text-sm leading-relaxed mb-2 line-clamp-2">
                  &ldquo;{todayPrescription.quote_text}&rdquo;
                </p>
                <p className="text-xs text-primary mb-6">— {todayPrescription.philosopher_name}</p>
                <div className="h-px w-full bg-primary/20" />
              </a>
            ) : (
              <div className="w-full mb-8">
                <span className="inline-block mb-3 text-[10px] font-medium tracking-[0.2em] uppercase text-muted">
                  오늘의 영감
                </span>
                <h2 className="text-3xl font-serif font-normal leading-tight text-foreground mb-4 break-keep">
                  오늘 고민을<br />이야기해보세요
                </h2>
                <p className="text-muted text-sm leading-relaxed mb-6">
                  마음을 어지럽히는 것을 말하면 철학자의 지혜로 처방해드려요.
                </p>
                <button
                  onClick={() => setShowSheet(true)}
                  className="w-full py-3.5 rounded-xl bg-foreground text-background text-sm font-medium transition-all active:scale-95 mb-8"
                >
                  오늘 고민 말하기
                </button>
                <div className="h-px w-full bg-primary/20" />
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Hero for non-logged-in users */}
            <div className="w-full mb-8 mt-4">
              <span className="inline-block mb-3 text-[10px] font-medium tracking-[0.2em] uppercase text-muted">
                오늘의철학
              </span>
              <h2 className="text-3xl font-serif font-normal leading-tight text-foreground mb-4 break-keep">
                고민을 말하면<br />
                철학자가 처방합니다
              </h2>
              <p className="text-muted text-sm leading-relaxed mb-6">
                소크라테스, 노자, 니체가 오늘 당신의 고민을 듣습니다.<br />
                2천 년의 지혜가 지금 이 순간을 위해 준비돼 있어요.
              </p>
              <div className="flex gap-4 mb-8">
                {[
                  { step: "01", label: "고민 입력" },
                  { step: "02", label: "처방 생성" },
                  { step: "03", label: "실천하기" },
                ].map(({ step, label }) => (
                  <div key={step} className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-primary">{step}</span>
                    <span className="text-xs text-muted">{label}</span>
                    {step !== "03" && <span className="text-muted/40 text-xs">→</span>}
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowSheet(true)}
                className="w-full py-3.5 rounded-xl bg-foreground text-background text-sm font-medium transition-all active:scale-95 mb-8"
              >
                지금 고민 말하기
              </button>
              <div className="h-px w-full bg-primary/20 mb-8" />
            </div>
          </>
        )}

        {/* Category Filters */}
        <div ref={philosophersRef} className="w-full mb-10">
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

      <ConcernSheet
        isOpen={showSheet}
        onClose={() => setShowSheet(false)}
        isLoggedIn={!!user}
      />
    </div>
  );
}
