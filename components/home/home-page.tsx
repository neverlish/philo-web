// components/home/home-page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import { Header } from "@/components/navigation/header";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { PhilosophersList } from "@/components/home/philosophers-list";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase/client";
import type { DbPhilosopher } from "@/types";
import { ReflectionCard } from "@/components/home/reflection-card";
import { ConcernSheet } from "@/components/home/concern-sheet";
import { OnboardingSlides, useOnboarding } from "@/components/onboarding/onboarding-slides";
import { usePostHog } from 'posthog-js/react';
import Link from 'next/link';
import { getTodayKST, getRecentDaysKST } from "@/lib/date";
import { calculateStreak } from "@/lib/streak";
import { trackExplorer } from "@/lib/posthog/explorer-events";
import { EverydayPhilosophy } from "@/components/home/everyday-philosophy";
import { trackHomePractice } from "@/lib/posthog/home-practice-events";
import { AI_INTERPRETATION_LABEL } from '@/lib/prescription-provenance';

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
  const posthog = usePostHog();
  const { show: showOnboarding, done: doneOnboarding } = useOnboarding();
  const [checking, setChecking] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [reflectionTarget, setReflectionTarget] = useState<ReflectionTarget | null>(null);
  const [todayPrescription, setTodayPrescription] = useState<TodayPrescription | null>(null);
  const [showSheet, setShowSheet] = useState(false);
  const [prescriptionDismissed, setPrescriptionDismissed] = useState(false);
  const [streak, setStreak] = useState(0);
  const [streakDates, setStreakDates] = useState<string[]>([]);
  const philosophersRef = useRef<HTMLDivElement>(null);
  const homeTrackedRef = useRef(false);

  const last7Days = getRecentDaysKST(7);

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
      setTodayPrescription(null);
      setChecking(false);
      return;
    }

    let cancelled = false;
    const userId = user.id;
    setTodayPrescription(null);
    setChecking(true);
    const today = getTodayKST();
    async function loadTodayPrescription() {
      try {
        const { data, error } = await supabase
          .from("ai_prescriptions")
          .select("id, title, philosopher_name, quote_text")
          .eq("user_id", userId)
          .gte("created_at", `${today}T00:00:00+09:00`)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        if (!cancelled && !error) setTodayPrescription(data as TodayPrescription | null);
      } catch {
        // 기록 조회 실패가 홈 탐색을 막지 않도록 한다.
      } finally {
        if (!cancelled) setChecking(false);
      }
    }
    void loadTodayPrescription();
    return () => { cancelled = true; };
  }, [user, loading]);

  useEffect(() => {
    if (checking || homeTrackedRef.current) return
    homeTrackedRef.current = true
    posthog?.capture('home_viewed', {
      is_logged_in: !!user,
      streak,
      has_today_prescription: !!todayPrescription,
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checking])

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

  return (
    <>
    {showOnboarding && <OnboardingSlides onDone={doneOnboarding} />}
    <div
      className="min-h-dvh flex flex-col max-w-md mx-auto bg-background shadow-2xl"
      aria-hidden={showOnboarding || undefined}
    >
      <Header title="지혜의 다리" />

      <main className="flex-1 flex flex-col px-6 pt-2 pb-32 overflow-y-auto">
        <EverydayPhilosophy />
        <div className="px-6 py-3 text-center">
          <Link href="/opening" onClick={() => trackHomePractice('home_checkin_clicked')} className="text-sm text-primary underline underline-offset-4">
            내 마음을 이야기하고 싶다면
          </Link>
          <p className="mt-1 text-xs text-muted">고민 없이 철학을 둘러봐도 괜찮아요.</p>
        </div>
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
        {user && !checking ? (
          <div className="w-full mb-8 mt-2">
            {todayPrescription ? (
              <AnimatePresence mode="wait">
                {!prescriptionDismissed ? (
                  <motion.div
                    key="card"
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="relative"
                  >
                    <a href={`/prescription/ai/${todayPrescription.id}`} className="block group">
                      <span className="inline-block mb-3 text-[10px] font-medium tracking-[0.2em] uppercase text-muted">
                        {AI_INTERPRETATION_LABEL}
                      </span>
                      <h2 className="text-2xl font-serif font-normal leading-tight text-foreground mb-3 break-keep group-hover:text-primary transition-colors pr-6">
                        {todayPrescription.title}
                      </h2>
                      <p className="text-muted text-sm leading-relaxed mb-2 line-clamp-2">
                        {todayPrescription.quote_text}
                      </p>
                      <p className="text-xs text-primary mb-6">참고한 철학자 · {todayPrescription.philosopher_name}</p>
                      <div className="h-px w-full bg-primary/20" />
                    </a>
                    <button
                      onClick={() => setPrescriptionDismissed(true)}
                      aria-label="처방 숨기기"
                      className="absolute top-0 right-0 p-1 text-muted/40 hover:text-muted transition-colors"
                    >
                      <X className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="dismissed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="mb-6"
                  >
                    <a
                      href={`/prescription/ai/${todayPrescription.id}`}
                      className="text-xs text-muted hover:text-foreground transition-colors"
                    >
                      오늘의 처방 보기 →
                    </a>
                    <div className="h-px w-full bg-primary/20 mt-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            ) : (
              <div className="w-full mb-8">
                <span className="inline-block mb-3 text-[10px] font-medium tracking-[0.2em] uppercase text-muted">
                  오늘의 영감
                </span>
                <h2 className="text-3xl font-serif font-normal leading-tight text-foreground mb-4 break-keep">
                  오늘의 일을<br />함께 들여다볼까요
                </h2>
                <p className="text-muted text-sm leading-relaxed mb-6">
                  마음에 걸리는 일을 들려주세요. 철학자의 관점으로 다른 질문을 만나봐요.
                </p>
                <button
                  onClick={() => { posthog?.capture('concern_cta_clicked', { is_logged_in: true }); setShowSheet(true); }}
                  className="w-full py-3.5 rounded-xl bg-foreground text-background text-sm font-medium transition-all active:scale-95 mb-8"
                >
                  오늘 고민 말하기
                </button>
                <div className="h-px w-full bg-primary/20" />
              </div>
            )}
          </div>
        ) : (
          <div className="mb-8 border-b border-[#35463d]/20 pb-7">
            <h2 className="font-serif text-xl">내 이야기로 더 깊이 생각하고 싶다면</h2>
            <p className="mt-3 text-sm leading-7 text-muted">마음에 걸리는 일을 들려주세요. 철학자의 관점을 빌린 AI 대화로 함께 살펴봐요.</p>
            <button
              onClick={() => { posthog?.capture('concern_cta_clicked', { is_logged_in: false }); setShowSheet(true); }}
              className="mt-4 min-h-11 text-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4"
            >내 고민 이야기하기 →</button>
          </div>
        )}

        <Link href="/explore" prefetch={false}
          onClick={() => trackExplorer('explorer_entry_clicked', 'index', { source: 'home' })}
          className="mb-6 block border-y border-primary/20 py-6">
          <span className="text-xs text-muted">글보다 장면이 편한 날 · 로그인 없이</span>
          <p className="mt-2 font-serif text-2xl">그림 속에서 질문 만나기 →</p>
          <p className="mt-2 text-xs leading-6 text-muted">플라톤의 동굴부터 생각의 관계 지도까지</p>
        </Link>

        {/* 철학자 유형 테스트 배너 */}
        <Link
          href="/type"
          prefetch={false}
          onClick={() => posthog?.capture('quiz_banner_clicked')}
          className="mb-6 flex items-center justify-between gap-3 border border-[#35463d]/20 bg-[#eeece3] px-5 py-6 text-[#29372f] focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          <div className="flex items-center gap-3">
            <div>
              <p className="mb-2 text-[10px] tracking-widest text-muted">내 생각의 출발점이 궁금한 날</p>
              <p className="font-serif text-lg leading-snug">나는 어떤 관점에 가까울까요?</p>
              <p className="mt-2 text-xs leading-6 text-muted">7가지 질문으로 만나는 철학자 유형</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
        </Link>

        <Link
          href="/wisdom"
          prefetch={false}
          className="group mb-8 flex items-end justify-between border-y border-primary/15 py-5"
        >
          <div>
            <p className="mb-2 text-[10px] font-medium tracking-[0.2em] text-muted">조용히 읽고 싶은 날 · 고민별 철학 가이드</p>
            <p className="font-serif text-xl leading-snug text-foreground">마음의 문제를<br />철학의 질문으로</p>
          </div>
          <ArrowRight className="mb-1 h-4 w-4 text-muted transition-transform group-hover:translate-x-1" strokeWidth={1.4} />
        </Link>

        {/* Philosophers Section */}
        <div ref={philosophersRef} className="w-full mb-5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-serif text-xl text-[#29372f]">내 질문과 만날 철학자들</h2>
          </div>
          <div className="flex gap-1 overflow-x-auto [&::-webkit-scrollbar]:hidden">
            {categories.map((category, index) => (
              <button
                key={category.label}
                onClick={() => handleCategorySelect(index)}
                className={`flex-none px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors ${
                  selectedCategory === index
                    ? "bg-stone-100 text-foreground font-medium"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
          <div className="h-px w-full bg-primary/10 mt-3" />
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
    </>
  );
}
