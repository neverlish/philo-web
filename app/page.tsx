import type { Metadata } from "next";
import { HomePage } from "@/components/home/home-page";
import { supabase } from "@/lib/supabase";
import type { DbPhilosopher } from "@/types";

const PAGE_SIZE = 5;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://philo-web.vercel.app";

export const metadata: Metadata = {
  title: { absolute: '오늘의철학 — 내 일상에서 시작하는 철학 연습' },
  description: '친구와의 관계, 내 뜻대로 되지 않는 하루를 철학의 질문으로 살펴보세요. 로그인 없는 생활 철학 연습, 그림으로 만나는 철학자, 고민별 읽을거리를 만나보세요.',
  openGraph: { title: '오늘의철학 — 내 일상에서 시작하는 철학 연습', description: '내 경험에서 시작해 다른 관점을 만나고, 생활로 가져갈 질문 하나를 남겨보세요.', url: '/', images: ['/explorer/aristotle-scene-v2.webp'] },
  twitter: { card: 'summary_large_image', title: '오늘의철학 — 내 일상에서 시작하는 철학 연습', description: '로그인 없이 시작하는 생활 속 철학.', images: ['/explorer/aristotle-scene-v2.webp'] },
  alternates: {
    canonical: "/",
  },
};

export default async function Page() {
  const { data } = await supabase
    .from("philosophers")
    .select("*")
    .order("created_at", { ascending: false })
    .range(0, PAGE_SIZE - 1);

  const initialPhilosophers = (data ?? []) as DbPhilosopher[];

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "오늘의철학",
    alternateName: "오늘의 철학",
    url: siteUrl,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <HomePage
        initialPhilosophers={initialPhilosophers}
        initialHasMore={initialPhilosophers.length === PAGE_SIZE}
      />
    </>
  );
}
