// components/home/philosophers-list.tsx
"use client";

import { useEffect, useState } from "react";
import { PhilosopherCard } from "./philosopher-card";
import { AlertCircle } from "lucide-react";

// Simple skeleton component
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-md bg-primary/10 ${className || ''}`}
      {...props}
    />
  );
}

interface DbPhilosopher {
  id: string;
  name: string;
  name_en: string;
  era: string;
  region: string;
  years?: string;
  core_idea: string;
  description?: string;
  application?: string;
  keywords: string[];
  image_url?: string;
}

export function PhilosophersList() {
  const [philosophers, setPhilosophers] = useState<DbPhilosopher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch('/api/philosophers');
        if (!response.ok) {
          throw new Error('Failed to fetch philosophers');
        }
        const data = await response.json();
        setPhilosophers(data.philosophers || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Error fetching philosophers:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="w-full space-y-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-full space-y-4">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-16 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
        <p className="text-muted mb-2">데이터를 불러오는데 실패했습니다</p>
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (philosophers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted">철학자 데이터가 없습니다</p>
      </div>
    );
  }

  const descriptions = [
    "내면의 요새를 지키는 법",
    "물처럼 부드럽게 흐르는 삶",
    "시간의 짧음에 대하여",
    "무위자연의 지혜",
  ];

  return (
    <div className="w-full space-y-8">
      {philosophers.map((philosopher, index) => (
        <PhilosopherCard
          key={philosopher.id}
          philosopher={{
            id: philosopher.id,
            name: philosopher.name,
            nameEn: philosopher.name_en,
            era: philosopher.era,
            school: "", // API에는 없지만 호환을 위해 빈 문자열
            description: philosopher.description || "",
          }}
          description={descriptions[index % descriptions.length]}
        />
      ))}
    </div>
  );
}
