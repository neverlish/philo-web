import type { Metadata } from 'next'
import { CollectivePage } from "@/components/collective/collective-page";

export const metadata: Metadata = { robots: { index: false, follow: false } }

export default function Page() {
  return <CollectivePage />;
}
