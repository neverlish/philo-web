// app/profile/settings/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/navigation/header";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { supabase } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";
import { PushToggle } from "@/components/notification/push-toggle";
import { IosInstallGuide } from "@/components/notification/ios-install-guide";
import { AndroidInstallButton } from "@/components/notification/android-install-button";
import { FeedbackSection } from "@/components/settings/feedback-section";

export default function SettingsPage() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-background shadow-2xl">
      <Header title="설정" showBack showSearch={false} />

      <main className="flex-1 px-6 pt-4 pb-32 overflow-y-auto">
        <IosInstallGuide />
        <AndroidInstallButton />

        <section className="mb-8">
          <h2 className="text-xs font-medium tracking-widest text-muted uppercase mb-3">알림</h2>
          <PushToggle />
        </section>

        <FeedbackSection />

        <section className="mb-8">
          <h2 className="text-xs font-medium tracking-widest text-muted uppercase mb-3">계정</h2>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-red-200 transition-colors disabled:opacity-50"
          >
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
              <LogOut className="w-5 h-5 text-red-500" strokeWidth={1.5} />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-red-500">
                {loggingOut ? "로그아웃 중..." : "로그아웃"}
              </p>
            </div>
          </button>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
