// components/navigation/bottom-nav.tsx
"use client";

import { Home, Book, Group, Person, Bookmark } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "홈", icon: Home, filled: true },
  { href: "/journal", label: "저널", icon: Book, filled: false },
  { href: "/collective", label: "모두의 생각", icon: Group, filled: false },
  { href: "/saved", label: "저장", icon: Bookmark, filled: false },
  { href: "/profile", label: "프로필", icon: Person, filled: false },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="border-t border-border bg-background/95 backdrop-blur-lg px-6 py-4 sticky bottom-0">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1.5 transition-colors ${
                isActive ? "text-primary" : "text-muted hover:text-foreground"
              }`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  isActive && item.filled ? "bg-primary/10" : ""
                }`}
              >
                <Icon
                  className="w-6 h-6"
                  strokeWidth={isActive && item.filled ? 2.5 : 1.5}
                  fill={isActive && item.filled ? "currentColor" : "none"}
                />
              </div>
              <span
                className={`text-[10px] tracking-wider uppercase font-medium ${
                  isActive ? "font-bold" : ""
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
