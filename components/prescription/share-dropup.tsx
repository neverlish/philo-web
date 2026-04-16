"use client";

import { useState } from "react";
import { Share2, Link2, ChevronUp, ImageDown } from "lucide-react";
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
  const [downloadingImage, setDownloadingImage] = useState(false);
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

  const handleDownloadImage = async () => {
    if (!prescriptionId || downloadingImage) return;
    setDownloadingImage(true);

    try {
      const res = await fetch(`/api/prescriptions/${prescriptionId}/image`);
      if (!res.ok) throw new Error('Image generation failed');

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      // 모바일에서 네이티브 공유가 파일을 지원하면 사용
      if (navigator.share && navigator.canShare) {
        const file = new File([blob], `오늘의처방_${philosopherName}.png`, { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title: `${philosopherName}의 처방` });
          posthog?.capture('prescription_image_shared', {
            share_method: 'native',
            prescription_id: prescriptionId,
          });
          URL.revokeObjectURL(url);
          return;
        }
      }

      // 폴백: 다운로드
      const a = document.createElement('a');
      a.href = url;
      a.download = `오늘의처방_${philosopherName}.png`;
      a.click();
      URL.revokeObjectURL(url);
      posthog?.capture('prescription_image_shared', {
        share_method: 'download',
        prescription_id: prescriptionId,
      });
    } catch {
      // ignore
    } finally {
      setDownloadingImage(false);
    }
  };

  const handleShare = async () => {
    if (sharing) return;
    setSharing(true);

    const shareUrl = prescriptionId
      ? `${window.location.origin}/share/${prescriptionId}?utm_source=share&utm_medium=prescription&utm_campaign=wom`
      : window.location.origin;
    const concernLine = concern ? `"${concern}"\n\n` : "";
    const text = `${concernLine}"${quote}"\n— ${philosopherName} (${philosopherSchool})\n\n${shareUrl}`;
    const shareData = { title: `철학자가 처방하는 내 고민`, text, url: shareUrl };

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
              onClick={() => { handleDownloadImage(); setShowShareMenu(false); }}
              disabled={!prescriptionId || downloadingImage}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-sm font-medium hover:bg-stone-50 transition-colors disabled:opacity-50"
            >
              <ImageDown className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
              {downloadingImage ? "이미지 생성 중..." : "이미지 카드 저장"}
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
        className="flex w-full items-center justify-center gap-2 bg-card border border-border py-3 rounded-xl font-medium text-sm transition-all active:scale-95 hover:bg-stone-50"
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
