// components/collective/collective-page.tsx
"use client";

import { ParticleCanvas } from "@/components/animations/particle-canvas";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { CollectiveFeed } from "@/components/collective/collective-feed";

export function CollectivePage() {
  return (
    <div className="min-h-dvh flex flex-col max-w-md mx-auto bg-background shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <ParticleCanvas />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-border bg-background/80 backdrop-blur-sm px-6 py-5">
        <h1 className="text-2xl font-serif font-normal text-center">함께 나누기</h1>
        <p className="text-xs text-muted text-center mt-2">모두의 철학적 사유와 공감하기</p>
      </header>

      <main className="relative z-10 flex-1 overflow-y-auto pb-32">
        <CollectiveFeed />
      </main>

      <BottomNav />
    </div>
  );
}
