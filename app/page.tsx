import type { Metadata } from "next";
import { HomePage } from "@/components/home/home-page";
import { supabase } from "@/lib/supabase";
import type { DbPhilosopher } from "@/types";

const PAGE_SIZE = 5;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://philo-web.vercel.app";

export const metadata: Metadata = {
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
