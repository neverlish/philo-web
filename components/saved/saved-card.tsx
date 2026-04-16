// components/saved/saved-card.tsx
"use client";

import { motion } from "framer-motion";
import { Bookmark, ChevronRight, CheckCircle2, PenLine } from "lucide-react";
import Link from "next/link";
import { getPhilosopherSymbol } from "@/lib/philosopher-symbols";

export interface SavedPrescription {
  id: string;
  prescriptionId: string;
  philosopher: string;
  philosopherId: string;
  title: string;
  excerpt: string;
  savedAt: string;
  category: string;
  userIntention?: string | null;
  hasReflection?: boolean;
}

interface SavedCardProps {
  prescription: SavedPrescription;
  index: number;
  onDelete?: (id: string) => Promise<void>;
}

export function SavedCard({ prescription, index, onDelete }: SavedCardProps) {
  const symbol = getPhilosopherSymbol(prescription.philosopher);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        href={`/prescription/ai/${prescription.prescriptionId}`}
        className="block group"
      >
        <div className="bg-card border border-border rounded-2xl p-5 hover:border-primary/30 transition-all hover:shadow-lg relative overflow-hidden">
          {/* 철학자 심볼 워터마크 */}
          <span
            className="absolute -right-2 -bottom-3 text-[72px] font-light text-foreground pointer-events-none select-none leading-none"
            style={{ opacity: 0.05 }}
            aria-hidden
          >
            {symbol}
          </span>
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-medium tracking-wider uppercase bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                  {prescription.category}
                </span>
              </div>
              <h3 className="text-lg font-serif font-normal text-foreground mb-1">
                {prescription.title}
              </h3>
              <p className="text-xs text-muted">{prescription.philosopher}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
          </div>

          {/* Excerpt */}
          <p className={`text-sm text-muted leading-relaxed line-clamp-2 break-keep ${prescription.userIntention ? 'mb-2' : 'mb-4'}`}>
            {prescription.excerpt}
          </p>

          {/* Intention */}
          {prescription.userIntention && (
            <p className="text-xs text-primary mb-4">다짐: &ldquo;{prescription.userIntention}&rdquo;</p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-border/50">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-muted">{prescription.savedAt}에 저장</span>
              {prescription.hasReflection ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" />
                  성찰 완료
                </span>
              ) : prescription.userIntention ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
                  <PenLine className="w-3 h-3" />
                  다짐 있음
                </span>
              ) : null}
            </div>

            {onDelete && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete(prescription.id);
                }}
                className="flex items-center gap-1 text-xs text-muted hover:text-destructive transition-colors"
              >
                <Bookmark className="w-3.5 h-3.5" fill="currentColor" />
                <span>삭제</span>
              </button>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
