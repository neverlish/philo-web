"use client";

import { Mic, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export function MicFab() {
  const [todayHref, setTodayHref] = useState<string>("/opening/input");
  const [hasTodayRecord, setHasTodayRecord] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from("ai_prescriptions")
        .select("id")
        .eq("user_id", user.id)
        .gte("created_at", today + "T00:00:00")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()
        .then(({ data }) => {
          if (data?.id) {
            setTodayHref(`/prescription/ai/${data.id}`);
            setHasTodayRecord(true);
          }
        });
    });
  }, []);

  return (
    <div className="fixed bottom-20 inset-x-0 pointer-events-none z-40">
      <div className="max-w-md mx-auto relative h-0">
        <Link
          href={todayHref}
          aria-label="오늘 말하기"
          className="absolute right-6 -top-14 pointer-events-auto"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
            {hasTodayRecord
              ? <Sparkles className="w-5 h-5" strokeWidth={1.5} />
              : <Mic className="w-5 h-5" strokeWidth={1.5} />
            }
          </div>
        </Link>
      </div>
    </div>
  );
}
