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
import { DailyQuestionCard } from "@/components/home/daily-question-card";
import { EmotionPicker } from "@/components/home/emotion-picker";

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

function calculateStreak(dates: string[]): number {
  if (dates.length === 0) return 0;
  const sorted = [...dates].sort().reverse();
  const today = new Date().toISOString().split("T")[0];
  if (sorted[0] !== today) return 0;
  let count = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diff = Math.round((prev.getTime() - curr.getTime()) / 86400000);
    if (diff === 1) count++;
    else break;
  }
  return count;
}

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
  const [sheetInitialText, setSheetInitialText] = useState("");
  const [streak, setStreak] = useState(0);
  const [streakDates, setStreakDates] = useState<string[]>([]);
  const philosophersRef = useRef<HTMLDivElement>(null);

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });

  const handleEmotionSelect = (concern: string) => {
    setSheetInitialText(concern);
    setShowSheet(true);
  };

  const handleCategorySelect = (index: number) => {
    setSelectedCategory(index);
    setTimeout(() => {
      philosophersRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  useEffect(() => {
    if (loading || !user) return;
    supabase
      .from("check_ins")
      .select("check_in_date")
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (!data) return;
        const dates = data.map((d) => d.check_in_date);
        setStreakDates(dates);
        setStreak(calculateStreak(dates));
      });
  }, [user, loading]);

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
        // 처방 fetch 완료 후 checking 해제 — 그 전에 렌더하면 빈 버튼이 순간 표시됨
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
            setChecking(false);
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
        {/* Streak mini widget — D */}
        {user && streak > 0 && (
          <div className="flex items-center gap-2.5 py-3 mb-1">
            <div className="flex gap-1">
              {last7Days.map((date) => (
                <div
                  key={date}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    streakDates.includes(date) ? "bg-primary" : "bg-border"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted">
              {streak > 1 ? `${streak}일 연속` : "오늘 시작"}
            </span>
          </div>
        )}

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
                className="relative w-full py-4 rounded-xl text-sm font-serif tracking-wide transition-all active:scale-[0.98] mb-8 overflow-hidden group"
                style={{
                  background: "linear-gradient(135deg, #6b3a1f 0%, #c9872a 50%, #7c4f1a 100%)",
                  boxShadow: "0 4px 24px rgba(180, 100, 20, 0.4)",
                  color: "white",
                }}
              >
                <span className="relative z-10">✦ 지금 고민 말하기</span>
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
              </button>
              <div className="h-px w-full bg-primary/20 mb-8" />
            </div>
          </>
        )}

        {/* Daily Question Card — A: 처방이 없거나 비로그인일 때만 표시 */}
        {(!user || !todayPrescription) && (
          <DailyQuestionCard onWriteThought={() => { setSheetInitialText(""); setShowSheet(true); }} />
        )}

        {/* Emotion Picker — B */}
        <EmotionPicker onSelectEmotion={handleEmotionSelect} />

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
        onClose={() => { setShowSheet(false); setSheetInitialText(""); }}
        isLoggedIn={!!user}
        initialText={sheetInitialText}
      />
    </div>
  );
}
