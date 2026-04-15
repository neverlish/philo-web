// app/opening/page.tsx
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { OpeningQuestion } from "@/components/opening/opening-question";

export const metadata: Metadata = { robots: { index: false, follow: false } }

export default function OpeningPage() {
  return (
    <Suspense>
      <OpeningQuestion />
    </Suspense>
  );
}
