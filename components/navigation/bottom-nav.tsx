// components/navigation/bottom-nav.tsx
"use client";

import { Home, User, Bookmark, Compass } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MicFab } from "@/components/navigation/mic-fab";

const navItems = [
  { href: "/", label: "홈", icon: Home, filled: true },
  { href: "/saved", label: "저장", icon: Bookmark, filled: false },
  { href: "/journey", label: "여정", icon: Compass, filled: false },
  { href: "/profile", label: "프로필", icon: User, filled: false },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <>
      <MicFab />
      <nav className="border-t border-border bg-background/95 backdrop-blur-lg px-6 py-3 sticky bottom-0">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {navItems.map((item) => {
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
    </>
  );
}
