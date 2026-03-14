// components/navigation/bottom-nav.tsx
"use client";

import { Home, Group, User, Bookmark, Mic, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

const navItems = [
  { href: "/", label: "홈", icon: Home, filled: true },
  { href: "/collective", label: "모두의 생각", icon: Group, filled: false },
  { href: "/saved", label: "저장", icon: Bookmark, filled: false },
  { href: "/profile", label: "프로필", icon: User, filled: false },
];

export function BottomNav() {
  const pathname = usePathname();
  const [todayHref, setTodayHref] = useState<string>("/opening/input");
  const [hasTodayRecord, setHasTodayRecord] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from("ai_prescriptions")
        .select("id")
        .eq("user_id", user.id)
        .gte("created_at", today + "T00:00:00")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()
        .then(({ data }) => {
          if (data?.id) {
            setTodayHref(`/prescription/ai/${data.id}`);
            setHasTodayRecord(true);
          }
        });
    });
  }, []);

  const [left, right] = [navItems.slice(0, 2), navItems.slice(2)];

  return (
    <nav className="border-t border-border bg-background/95 backdrop-blur-lg px-6 py-3 sticky bottom-0">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {/* Left items */}
        {left.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              className={`flex items-center justify-center transition-colors ${
                isActive ? "text-primary" : "text-muted hover:text-foreground"
              }`}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isActive ? "bg-primary/10" : ""}`}>
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 1.5} fill={isActive && item.filled ? "currentColor" : "none"} />
              </div>
            </Link>
          );
        })}

        {/* Center: 오늘 버튼 */}
        <Link
          href={todayHref}
          aria-label="오늘"
          className="flex items-center justify-center"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
            {hasTodayRecord
              ? <Sparkles className="w-5 h-5" strokeWidth={1.5} />
              : <Mic className="w-5 h-5" strokeWidth={1.5} />
            }
          </div>
        </Link>

        {/* Right items */}
        {right.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              className={`flex items-center justify-center transition-colors ${
                isActive ? "text-primary" : "text-muted hover:text-foreground"
              }`}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isActive ? "bg-primary/10" : ""}`}>
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 1.5} fill={isActive && item.filled ? "currentColor" : "none"} />
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
