// app/journal/page.tsx
import { BottomNav } from "@/components/navigation/bottom-nav";
import { Header } from "@/components/navigation/header";
import { LoginPrompt } from "@/components/auth/LoginPrompt";
import { createClient } from "@/lib/supabase/server-auth";
import { BookOpen, Clock } from "lucide-react";

export default async function JournalPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return <LoginPrompt message="일기를 작성하려면 로그인이 필요해요" />;
  }
  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-background shadow-2xl">
      <Header title="저널" />

      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-32">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-stone-100 flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-muted" strokeWidth={1.5} />
          </div>

          <h2 className="text-2xl font-serif font-normal text-foreground">
            철학적 저널
          </h2>

          <p className="text-sm text-muted leading-relaxed max-w-xs mx-auto">
            곧 출시 예정인 기능입니다.<br />
            철학적 사유를 기록하고 성장 과정을<br />
            추적할 수 있는 개인 저널을 준비 중입니다.
          </p>

          <div className="pt-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
              <Clock className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium text-primary">
                2026년 2분기 예정
              </span>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
