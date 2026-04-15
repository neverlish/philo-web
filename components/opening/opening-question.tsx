// components/opening/opening-question.tsx
"use client";

import { useRouter } from "next/navigation";
import { Leaf, Menu, UserCircle, Mic } from "lucide-react";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase/client";

export function OpeningQuestion() {
  const router = useRouter();
  const { user } = useAuth();

  const skip = async () => {
    if (user) {
      const today = new Date().toISOString().split("T")[0];
      await supabase
        .from("check_ins")
        .upsert(
          { user_id: user.id, check_in_date: today, checked_in_at: new Date().toISOString() },
          { onConflict: "user_id,check_in_date", ignoreDuplicates: true }
        );
    }
    router.push("/");
  };

  useEffect(() => {
    // Auto transition after 3 seconds
    const timer = setTimeout(() => {
      router.push("/opening/input");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-6 relative overflow-hidden bg-background">
      {/* Background gradient */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[140%] h-[140%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      </div>

      {/* Header */}
      <header className="w-full flex justify-between items-center z-10 opacity-60">
        <Menu className="w-5 h-5 text-foreground cursor-pointer" />
        <div className="w-8 h-1 bg-muted rounded-full" />
        <UserCircle className="w-5 h-5 text-foreground cursor-pointer" />
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col justify-center items-center w-full max-w-md px-8 z-10">
        <div className="mb-10 opacity-80">
          <Leaf className="w-16 h-16 text-primary mx-auto" strokeWidth={1} />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold leading-tight text-center text-foreground mb-16 tracking-tight font-serif">
          지금 당신의 마음을<br />
          <span className="text-primary">어지럽히는 것</span>은<br />
          무엇입니까?
        </h1>

        <div
          className="relative flex items-center justify-center mb-10 cursor-pointer animate-pulse"
          onClick={() => router.push("/opening/input")}
        >
          <div className="relative w-24 h-24 bg-gradient-to-br from-stone-100 to-stone-200 dark:from-stone-800 dark:to-stone-900 rounded-full shadow-lg flex items-center justify-center border border-border">
            <Mic className="w-10 h-10 text-primary" strokeWidth={1.5} />
          </div>
        </div>

        <p className="text-sm font-medium text-primary mb-2">눌러서 이야기하기</p>

        <p className="mt-4 text-sm text-muted text-center leading-relaxed max-w-xs mx-auto">
          잠시 멈추어 내면을 들여다보세요.<br />
          정직한 대답이 명료함의 시작입니다.
        </p>
      </main>

      {/* Footer */}
      <footer className="w-full p-8 z-10 flex flex-col items-center gap-4 pb-12">
        <button
          onClick={skip}
          className="text-xs text-muted hover:text-foreground transition-colors underline underline-offset-4"
        >
          오늘은 넘기기
        </button>
        <div className="flex gap-2 mt-4">
          <div className="w-1.5 h-1.5 rounded-full bg-muted" />
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <div className="w-1.5 h-1.5 rounded-full bg-muted" />
        </div>
      </footer>
    </div>
  );
}
