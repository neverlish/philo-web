// components/home/philosopher-card.tsx
"use client";

import { Philosopher } from "@/types";
import Link from "next/link";
import { motion } from "framer-motion";

interface PhilosopherCardProps {
  philosopher: Philosopher;
  description: string;
  index?: number;
}

export function PhilosopherCard({ philosopher, description, index = 0 }: PhilosopherCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.08, 0.4), ease: "easeOut" }}
    >
      <Link
        href={`/philosopher/${philosopher.id}`}
        className="group flex flex-col gap-3 border-b border-primary/10 pb-8 transition-all duration-300"
      >
        <span className="text-[10px] uppercase tracking-[0.15em] text-primary font-bold">
          {philosopher.era} · {philosopher.nameEn}
        </span>
        <h3 className="text-2xl font-serif font-normal text-foreground leading-snug break-keep group-hover:text-primary/80 transition-colors">
          {description}
        </h3>
        <p className="text-sm text-muted line-clamp-2 leading-relaxed">
          {philosopher.description}
        </p>
        <span className="text-xs text-foreground/40 font-medium">{philosopher.name} →</span>
      </Link>
    </motion.div>
  );
}
