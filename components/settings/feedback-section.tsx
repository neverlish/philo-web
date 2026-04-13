"use client";

import { useState } from "react";
import { MessageSquare, Send, Check } from "lucide-react";

export function FeedbackSection() {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!feedbackText.trim() || sending) return;
    setSending(true);
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: feedbackText.trim() }),
      });
      setSent(true);
      setFeedbackText("");
      setTimeout(() => {
        setSent(false);
        setShowFeedback(false);
      }, 2000);
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="mb-8">
      <h2 className="text-xs font-medium tracking-widest text-muted uppercase mb-3">문의</h2>
      <div className="space-y-2">
        <button
          onClick={() => setShowFeedback(!showFeedback)}
          className="w-full flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/30 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <MessageSquare className="w-5 h-5 text-primary" strokeWidth={1.5} />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-foreground">만든 사람에게 한마디</p>
            <p className="text-xs text-muted mt-0.5">불편함, 제안, 칭찬 모두 환영해요</p>
          </div>
        </button>

        {showFeedback && (
          <div className="px-1 pb-1">
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="자유롭게 남겨주세요..."
              rows={4}
              disabled={sending || sent}
              autoFocus
              className="w-full resize-none rounded-xl border border-primary/20 bg-stone-50 px-4 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-primary/40 leading-relaxed disabled:opacity-60 mb-2"
            />
            <button
              onClick={handleSubmit}
              disabled={!feedbackText.trim() || sending || sent}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all active:scale-95 disabled:opacity-40"
              style={
                sent
                  ? { background: "#16a34a", color: "white" }
                  : feedbackText.trim() && !sending
                  ? {
                      background: "linear-gradient(135deg, #6b3a1f 0%, #c9872a 50%, #7c4f1a 100%)",
                      boxShadow: "0 4px 16px rgba(180, 100, 20, 0.35)",
                      color: "white",
                    }
                  : { background: "var(--foreground)", color: "var(--background)" }
              }
            >
              {sent ? (
                <><Check className="w-4 h-4" /> 전달됐어요</>
              ) : sending ? (
                "보내는 중..."
              ) : (
                <><Send className="w-3.5 h-3.5" /> 전달하기</>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
