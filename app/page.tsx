import { HomePage } from "@/components/home/home-page";
import { supabase } from "@/lib/supabase";
import type { DbPhilosopher } from "@/types";

const PAGE_SIZE = 5;

export default async function Page() {
  const { data } = await supabase
    .from("philosophers")
    .select("*")
    .order("created_at", { ascending: false })
    .range(0, PAGE_SIZE - 1);

  const initialPhilosophers = (data ?? []) as DbPhilosopher[];

  return (
    <HomePage
      initialPhilosophers={initialPhilosophers}
      initialHasMore={initialPhilosophers.length === PAGE_SIZE}
    />
  );
}
