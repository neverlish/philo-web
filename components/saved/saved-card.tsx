// components/saved/saved-card.tsx
"use client";

import { motion } from "framer-motion";
import { Bookmark, ChevronRight } from "lucide-react";
import Link from "next/link";

export interface SavedPrescription {
  id: string;
  philosopher: string;
  philosopherId: string;
  title: string;
  excerpt: string;
  savedAt: string;
  category: string;
}

interface SavedCardProps {
  prescription: SavedPrescription;
  index: number;
  onDelete?: (id: string) => void;
}

export function SavedCard({ prescription, index, onDelete }: SavedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        href={`/prescription/${prescription.philosopherId}`}
        className="block group"
      >
        <div className="bg-card border border-border rounded-2xl p-5 hover:border-primary/30 transition-all hover:shadow-lg">
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
          <p className="text-sm text-muted leading-relaxed mb-4 line-clamp-2 break-keep">
            {prescription.excerpt}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-border/50">
            <span className="text-[11px] text-muted">
              {prescription.savedAt}에 저장
            </span>

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
