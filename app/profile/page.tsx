// app/profile/page.tsx
"use client";

import { BottomNav } from "@/components/navigation/bottom-nav";
import { Header } from "@/components/navigation/header";
import { Settings, Bell, HelpCircle, Shield } from "lucide-react";

export default function ProfilePage() {
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
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl text-primary">
                person
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-medium text-foreground mb-1">
                철학하는 사람
              </h2>
              <p className="text-sm text-muted">
                2024년 3월 1일 가입
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="w-full mb-8">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <p className="text-2xl font-serif font-normal text-primary mb-1">12</p>
              <p className="text-xs text-muted">저장한 처방</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <p className="text-2xl font-serif font-normal text-primary mb-1">5</p>
              <p className="text-xs text-muted">공유한 생각</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <p className="text-2xl font-serif font-normal text-primary mb-1">28</p>
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
                  <p className="text-sm font-medium text-foreground mb-0.5">
                    {item.label}
                  </p>
                  <p className="text-xs text-muted">{item.description}</p>
                </div>
                <span className="material-symbols-outlined text-muted">
                  chevron_right
                </span>
              </button>
            );
          })}
        </div>

        {/* Version Info */}
        <div className="w-full mt-8 text-center">
          <p className="text-xs text-muted">
            오늘의철학 v1.0.0
          </p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
