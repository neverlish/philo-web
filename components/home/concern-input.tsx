// components/home/concern-input.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const CATEGORIES = [
  {
    index: 1,
    label: "불안·두려움",
    keywords: ["불안", "걱정", "두려워", "두렵", "무서워", "무섭", "통제", "긴장", "초조", "스트레스"],
  },
  {
    index: 2,
    label: "인간관계",
    keywords: ["친구", "가족", "연인", "갈등", "사람", "관계", "부모", "형제", "직장", "외로", "혼자", "상처"],
  },
  {
    index: 3,
    label: "자유·선택",
    keywords: ["선택", "결정", "자유", "방향", "모르겠", "고민", "어떻게", "무엇", "진로", "미래"],
  },
  {
    index: 4,
    label: "삶의 의미",
    keywords: ["의미", "목적", "행복", "살아가", "허무", "공허", "이유", "왜", "살아야", "가치"],
  },
];

function detectCategory(text: string): number | null {
  const lower = text.toLowerCase();
  let bestIndex: number | null = null;
  let bestScore = 0;

  for (const cat of CATEGORIES) {
    const score = cat.keywords.filter((kw) => lower.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      bestIndex = cat.index;
    }
  }
  return bestScore > 0 ? bestIndex : null;
}

interface ConcernInputProps {
  onCategorySelect: (index: number) => void;
  selectedCategory: number;
}

export function ConcernInput({ onCategorySelect, selectedCategory }: ConcernInputProps) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [suggested, setSuggested] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (val: string) => {
    setText(val);
    setSuggested(detectCategory(val));
    setError(null);
  };

  const handleGetPrescription = async () => {
    if (!text.trim() || loading) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/prescription/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ concern: text.trim() }),
      });

      if (!res.ok) throw new Error("처방 생성에 실패했어요");

      const data = await res.json();
      sessionStorage.setItem("previewPrescription", JSON.stringify({
        concern: text.trim(),
        ...data.prescription,
      }));
      router.push("/preview/prescription");
    } catch {
      setError("잠시 후 다시 시도해주세요");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mb-8 mt-2">
      <span className="inline-block mb-3 text-[10px] font-medium tracking-[0.2em] uppercase text-muted">
        오늘의 고민
      </span>
      <h2 className="text-2xl font-serif font-normal leading-tight text-foreground mb-4 break-keep">
        지금 어떤 고민이<br />있으신가요?
      </h2>

      <textarea
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="고민을 자유롭게 적어보세요..."
        rows={3}
        disabled={loading}
        className="w-full resize-none rounded-xl border border-primary/20 bg-stone-50 px-4 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-primary/40 leading-relaxed mb-4 disabled:opacity-60"
      />

      <div className="flex flex-wrap gap-2 mb-5">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.index}
            onClick={() => onCategorySelect(cat.index)}
            disabled={loading}
            className={`px-4 py-2 rounded-full border text-sm font-serif whitespace-nowrap transition-colors disabled:opacity-60 ${
              selectedCategory === cat.index || suggested === cat.index
                ? "border-primary/40 bg-stone-100 text-foreground"
                : "border-primary/20 bg-transparent text-muted hover:bg-stone-50 hover:text-foreground"
            }`}
          >
            {suggested === cat.index && selectedCategory !== cat.index && (
              <span className="mr-1 text-primary">✦</span>
            )}
            {cat.label}
          </button>
        ))}
      </div>

      {error && (
        <p className="text-xs text-destructive mb-3">{error}</p>
      )}

      {text.trim().length > 0 && (
        <button
          onClick={handleGetPrescription}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-foreground text-background text-sm font-medium transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              처방 만드는 중...
            </>
          ) : (
            "철학적 처방 받기"
          )}
        </button>
      )}

      <div className="h-px w-full bg-primary/20 mt-6" />
    </div>
  );
}
