// app/profile/page.tsx
import { BottomNav } from "@/components/navigation/bottom-nav";
import { Header } from "@/components/navigation/header";
import { LoginPrompt } from "@/components/auth/LoginPrompt";
import { createClient } from "@/lib/supabase/server-auth";
import { Settings, Bell, HelpCircle, Shield, ChevronRight, User } from "lucide-react";

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

  const [
    { count: savedCount },
    { count: prescriptionCount },
    { data: checkIns },
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
  ]);

  const streak = calculateStreak((checkIns ?? []).map((c) => c.check_in_date));

  const menuItems = [
    { icon: Bell, label: "알림 설정", description: "푸시 알림 관리" },
    { icon: HelpCircle, label: "도움말", description: "앱 사용 가이드" },
    { icon: Shield, label: "개인정보 처리방침", description: "데이터 처리 정책" },
    { icon: Settings, label: "설정", description: "앱 설정" },
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

        {/* Menu Items */}
        <div className="w-full space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
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
              </button>
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
