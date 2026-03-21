// app/profile/page.tsx
import { BottomNav } from "@/components/navigation/bottom-nav";
import { Header } from "@/components/navigation/header";
import { LoginPrompt } from "@/components/auth/LoginPrompt";
import { createClient } from "@/lib/supabase/server-auth";
import { Settings, HelpCircle, Shield, ChevronRight, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

function calculateStreak(dates: string[]): number {
  if (dates.length === 0) return 0;

  const sorted = [...dates].sort().reverse();
  const today = new Date().toISOString().split("T")[0];

  if (sorted[0] !== today) return 0;

  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diffDays = Math.round((prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return <LoginPrompt message="프로필을 보려면 로그인이 필요해요" />;
  }

  const user = session.user;

  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const [
    { count: savedCount },
    { count: prescriptionCount },
    { data: checkIns },
    { data: monthlyPrescriptions },
  ] = await Promise.all([
    supabase
      .from("user_saved_prescriptions")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("ai_prescriptions")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("check_ins")
      .select("check_in_date")
      .eq("user_id", user.id),
    supabase
      .from("ai_prescriptions")
      .select("id, philosopher_name, title, created_at")
      .eq("user_id", user.id)
      .gte("created_at", firstDayOfMonth)
      .order("created_at", { ascending: true }),
  ]);

  const streak = calculateStreak((checkIns ?? []).map((c) => c.check_in_date));

  const monthName = `${now.getMonth() + 1}월`;
  const monthlyCount = monthlyPrescriptions?.length ?? 0;

  const philosopherCounts: Record<string, number> = {};
  for (const p of (monthlyPrescriptions ?? [])) {
    philosopherCounts[p.philosopher_name] = (philosopherCounts[p.philosopher_name] ?? 0) + 1;
  }
  const topPhilosopher = Object.entries(philosopherCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  const { data: featuredSaved } = await supabase
    .from("user_saved_prescriptions")
    .select("prescription_id")
    .eq("user_id", user.id)
    .gte("created_at", firstDayOfMonth)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  type MenuItem = {
    icon: LucideIcon;
    label: string;
    description: string;
    href: string;
  };

  const menuItems: MenuItem[] = [
    { icon: HelpCircle, label: "도움말", description: "앱 사용 가이드", href: "/profile/help" },
    { icon: Shield, label: "개인정보 처리방침", description: "데이터 처리 정책", href: "/profile/privacy" },
    { icon: Settings, label: "설정", description: "앱 설정", href: "/profile/settings" },
  ];

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-background shadow-2xl">
      <Header title="프로필" />

      <main className="flex-1 px-6 pt-2 pb-32 overflow-y-auto">
        {/* Profile Section */}
        <div className="w-full py-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center overflow-hidden">
              {user.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-primary" strokeWidth={1.5} />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-medium text-foreground mb-1">
                {user.user_metadata?.full_name || user.user_metadata?.name || "철학하는 사람"}
              </h2>
              <p className="text-sm text-muted">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="w-full mb-8">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <p className="text-2xl font-serif font-normal text-primary mb-1">{savedCount ?? 0}</p>
              <p className="text-xs text-muted">저장한 처방</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <p className="text-2xl font-serif font-normal text-primary mb-1">{prescriptionCount ?? 0}</p>
              <p className="text-xs text-muted">받은 처방</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <p className="text-2xl font-serif font-normal text-primary mb-1">{streak}</p>
              <p className="text-xs text-muted">연속 일수</p>
            </div>
          </div>
        </div>

        {/* Monthly Report */}
        {monthlyCount > 0 && (
          <div className="w-full mb-8">
            <div className="bg-card border border-border rounded-xl p-5">
              <p className="text-xs font-medium tracking-widest text-muted mb-4">{monthName}의 나</p>
              <div className="flex items-center gap-4 mb-4 text-sm text-foreground">
                <span>고민 <strong>{monthlyCount}회</strong></span>
                <span className="text-muted">·</span>
                <span>저장 <strong>{savedCount ?? 0}개</strong></span>
                <span className="text-muted">·</span>
                <span>연속 <strong>{streak}일</strong></span>
              </div>
              {topPhilosopher && (
                <p className="text-sm text-foreground mb-2">
                  가장 많이 만난 철학자: <strong>{topPhilosopher}</strong>
                </p>
              )}
              {featuredSaved?.prescription_id && (
                <Link
                  href={`/prescription/ai/${featuredSaved.prescription_id}`}
                  className="inline-flex items-center gap-1 text-sm text-primary mt-2 hover:underline"
                >
                  대표 처방 보기 →
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Menu Items */}
        <div className="w-full space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="w-full flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-foreground" strokeWidth={1.5} />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-foreground mb-0.5">{item.label}</p>
                  <p className="text-xs text-muted">{item.description}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted" />
              </Link>
            );
          })}
        </div>

        {/* Version Info */}
        <div className="w-full mt-8 text-center">
          <p className="text-xs text-muted">오늘의철학 v1.0.0</p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
