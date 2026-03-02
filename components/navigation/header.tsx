// components/navigation/header.tsx
"use client";

import { Menu, Search } from "lucide-react";

interface HeaderProps {
  title?: string;
  showSearch?: boolean;
}

export function Header({ title, showSearch = true }: HeaderProps) {
  return (
    <header className="flex items-center justify-between p-6 sticky top-0 z-20 bg-background/95 backdrop-blur-sm">
      <button className="flex size-10 items-center justify-center rounded-full hover:bg-black/5 transition-colors">
        <Menu className="w-6 h-6" strokeWidth={1.5} />
      </button>
      {title && (
        <h1 className="text-lg font-serif font-medium tracking-wide text-center flex-1">
          {title}
        </h1>
      )}
      {showSearch && (
        <button className="flex size-10 items-center justify-center rounded-full hover:bg-black/5 transition-colors">
          <Search className="w-6 h-6" strokeWidth={1.5} />
        </button>
      )}
    </header>
  );
}
