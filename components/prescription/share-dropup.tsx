"use client";

import { useState } from "react";
import { Share2, Link2, ChevronUp } from "lucide-react";
import { usePostHog } from "posthog-js/react";

interface ShareDropupProps {
  prescriptionId?: string;
  concern?: string | null;
  quote: string;
  philosopherName: string;
  philosopherSchool: string;
}

export function ShareDropup({
  prescriptionId,
  concern,
  quote,
  philosopherName,
  philosopherSchool,
}: ShareDropupProps) {
  const [sharing, setSharing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const posthog = usePostHog();

  const handleCopyUrl = async () => {
    if (!prescriptionId) return;
    const url = `${window.location.origin}/share/${prescriptionId}`;
    try {
      await navigator.clipboard.writeText(url);
      posthog?.capture("prescription_url_copied", { prescription_id: prescriptionId });
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  const handleShare = async () => {
    if (sharing) return;
    setSharing(true);

    const shareUrl = prescriptionId
      ? `${window.location.origin}/share/${prescriptionId}?utm_source=share&utm_medium=prescription&utm_campaign=wom`
      : window.location.origin;
    const concernLine = concern ? `고민: ${concern}\n\n` : "";
    const text = `${concernLine}"${quote}"\n— ${philosopherName} (${philosopherSchool})\n\n${shareUrl}`;
    const shareData = { title: `${philosopherName}의 처방`, text, url: shareUrl };

    try {
      let shareMethod: "native" | "clipboard";
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
        shareMethod = "native";
      } else {
        await navigator.clipboard.writeText(text);
        shareMethod = "clipboard";
      }
      posthog?.capture("prescription_shared", {
        share_method: shareMethod,
        prescription_id: prescriptionId,
      });
    } catch {
      // 사용자가 취소한 경우 무시
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className="relative">
      {showShareMenu && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setShowShareMenu(false)} />
          <div className="absolute bottom-full mb-2 left-0 right-0 z-20 bg-card border border-border rounded-xl overflow-hidden shadow-lg">
            <button
              onClick={() => { handleShare(); setShowShareMenu(false); }}
              disabled={sharing}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-sm font-medium hover:bg-stone-50 transition-colors disabled:opacity-50"
            >
              <Share2 className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
              앱으로 공유
            </button>
            <div className="border-t border-border" />
            <button
              onClick={() => { handleCopyUrl(); setShowShareMenu(false); }}
              disabled={!prescriptionId}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-sm font-medium hover:bg-stone-50 transition-colors disabled:opacity-50"
            >
              <Link2 className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
              {copied ? "복사됨" : "링크 복사"}
            </button>
          </div>
        </>
      )}
      <button
        onClick={() => setShowShareMenu((v) => !v)}
        className="flex w-full items-center justify-center gap-2 bg-card border border-border py-4 rounded-xl font-medium text-sm transition-all active:scale-95 hover:bg-stone-50"
      >
        <Share2 className="w-4 h-4" strokeWidth={1.5} />
        공유하기
        <ChevronUp
          className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${showShareMenu ? "" : "rotate-180"}`}
          strokeWidth={1.5}
        />
      </button>
    </div>
  );
}
