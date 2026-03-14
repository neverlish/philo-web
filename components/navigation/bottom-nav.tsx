// components/navigation/bottom-nav.tsx
"use client";

import { Home, Book, Group, User, Bookmark } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "홈", icon: Home, filled: true },
  { href: "/journal", label: "저널", icon: Book, filled: false },
  { href: "/collective", label: "모두의 생각", icon: Group, filled: false },
  { href: "/saved", label: "저장", icon: Bookmark, filled: false },
  { href: "/profile", label: "프로필", icon: User, filled: false },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="border-t border-border bg-background/95 backdrop-blur-lg px-6 py-3 sticky bottom-0">
      <div className="flex justify-between items-center max-w-md mx-auto">
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
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  isActive ? "bg-primary/10" : ""
                }`}
              >
                <Icon
                  className="w-5 h-5"
                  strokeWidth={isActive ? 2.5 : 1.5}
                  fill={isActive && item.filled ? "currentColor" : "none"}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
