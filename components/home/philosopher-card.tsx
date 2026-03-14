// components/home/philosopher-card.tsx
import { Philosopher } from "@/types";
import { Mountain, Droplet, Book } from "lucide-react";
import Link from "next/link";

interface PhilosopherCardProps {
  philosopher: Philosopher;
  description: string;
}

export function PhilosopherCard({ philosopher, description }: PhilosopherCardProps) {
  const getIcon = (id: string) => {
    switch (id) {
      case "marcus-aurelius":
        return Mountain;
      case "laozi":
        return Droplet;
      default:
        return Book;
    }
  };

  const Icon = getIcon(philosopher.id);

  return (
    <Link
      href={`/philosopher/${philosopher.id}`}
      className="group relative flex flex-col gap-3 transition-all duration-300"
    >
      <div className="w-full aspect-[4/3] bg-stone-100 dark:bg-stone-800 rounded-lg overflow-hidden relative">
        <div className="absolute inset-0 bg-foreground/5 flex items-center justify-center">
          <Icon className="w-16 h-16 text-primary/40" strokeWidth={1} />
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-1">
        <span className="text-[10px] uppercase tracking-[0.15em] text-primary font-bold">
          {philosopher.name}
        </span>
        <h3 className="text-xl font-serif font-medium text-foreground leading-snug">
          {description}
        </h3>
        <p className="text-sm text-muted line-clamp-2 leading-relaxed">
          {philosopher.description}
        </p>
      </div>
    </Link>
  );
}
