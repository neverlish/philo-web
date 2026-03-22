// app/opening/input/page.tsx
import type { Metadata } from 'next'
import { STTInput } from "@/components/opening/stt-input";

export const metadata: Metadata = { robots: { index: false, follow: false } }

export default function STTInputPage() {
  return <STTInput />;
}
