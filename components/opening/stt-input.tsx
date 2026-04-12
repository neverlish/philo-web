// components/opening/stt-input.tsx
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Mic } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase/client";
import { usePostHog } from 'posthog-js/react'

type Status = "idle" | "listening" | "done" | "generating" | "noInput" | "error";

export function STTInput() {
  const [status, setStatus] = useState<Status>("idle");
  const [transcript, setTranscript] = useState("");
  const transcriptRef = useRef("");
  const router = useRouter();
  const { user } = useAuth();
  const posthog = usePostHog()

  const saveCheckIn = async (): Promise<null> => {
    if (!user) return null;
    const today = new Date().toISOString().split("T")[0];
    await supabase.from("check_ins").upsert(
      { user_id: user.id, check_in_date: today, checked_in_at: new Date().toISOString() },
      { onConflict: "user_id,check_in_date", ignoreDuplicates: true }
    );
    return null;
  };

  const skip = () => {
    saveCheckIn().finally(() => {
      router.push("/");
    });
  };

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) return;

    transcriptRef.current = "";
    setTranscript("");

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = "ko-KR";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => setStatus("listening");

    recognition.onresult = (event: any) => {
      const result = event.results[0][0].transcript;
      transcriptRef.current = result;
      setTranscript(result);
    };

    recognition.onend = () => {
      if (!transcriptRef.current) {
        setStatus("noInput");
        return;
      }
      setStatus("done");
      saveCheckIn().then(async (conversationId) => {
        posthog?.capture('concern_submitted', {
          concern_length: transcriptRef.current.length,
        })
        setStatus("generating");
        try {
          const res = await fetch('/api/prescription/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              concern: transcriptRef.current,
              conversationId,
            }),
          });
          if (res.ok) {
            const { prescriptionId } = await res.json();
            router.push(`/prescription/ai/${prescriptionId}`);
          } else {
            setStatus('error');
          }
        } catch {
          setStatus('error');
        }
      });
    };

    recognition.start();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-10 text-center bg-background">
      {/* Visual Symbol */}
      <div className="mb-12">
        <div className="w-8 h-8 opacity-40 text-primary">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
      </div>

      {/* Text Container */}
      <div className="relative mb-20 min-h-[80px] flex items-center justify-center">
        {transcript ? (
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-3xl md:text-4xl text-foreground leading-relaxed"
          >
            {transcript}
          </motion.h1>
        ) : status === "noInput" ? (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-lg text-muted leading-relaxed"
          >
            목소리가 들리지 않았어요.<br />다시 한번 말씀해주세요.
          </motion.p>
        ) : (
          <motion.h1
            initial={{ opacity: 1 }}
            animate={{ opacity: 0.5 }}
            transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
            className="font-serif text-3xl md:text-4xl text-foreground leading-relaxed"
          >
            인간관계가 너무 힘들어요
          </motion.h1>
        )}
      </div>

      {/* STT Button */}
      <div className="relative flex items-center justify-center mb-10">
        <motion.div
          className={`absolute w-32 h-32 bg-primary/10 rounded-full ${status === "listening" ? "animate-ping" : ""}`}
        />
        <motion.div
          className={`absolute w-28 h-28 bg-primary/20 rounded-full ${status === "listening" ? "animate-pulse" : ""}`}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={startListening}
          disabled={status === "listening" || status === "done" || status === "generating"}
          className="relative w-24 h-24 bg-gradient-to-br from-stone-100 to-stone-200 rounded-full shadow-lg flex items-center justify-center border border-border disabled:opacity-50"
        >
          <Mic className="w-10 h-10 text-primary" strokeWidth={2} />
        </motion.button>
      </div>

      <p className="text-sm font-medium text-primary mb-2">
        {status === "listening" ? "듣고 있어요..." : status === "done" || status === "generating" ? "잘 들었어요" : "눌러서 이야기하기"}
      </p>

      {/* Error feedback */}
      {status === "error" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-12 flex flex-col items-center gap-4"
        >
          <p className="text-sm text-destructive">처방 생성에 실패했어요.<br />잠시 후 다시 시도해주세요.</p>
          <button
            onClick={() => setStatus("idle")}
            className="text-xs text-muted hover:text-foreground transition-colors underline underline-offset-4"
          >
            다시 시도하기
          </button>
        </motion.div>
      )}

      {/* Generating feedback */}
      {status === "generating" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-12 flex flex-col items-center gap-4"
        >
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-primary"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
          <p className="text-sm text-muted">철학적 처방을 준비하고 있어요...</p>
        </motion.div>
      )}

      {/* Skip button */}
      {status !== "done" && status !== "generating" && status !== "error" && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          onClick={skip}
          className="mt-8 text-xs text-muted hover:text-foreground transition-colors underline underline-offset-4"
        >
          오늘은 넘기기
        </motion.button>
      )}

      {/* Page Indicator */}
      <div className="fixed bottom-10 w-full flex justify-center space-x-2">
        <div className="w-1.5 h-1.5 rounded-full bg-muted" />
        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
        <div className="w-1.5 h-1.5 rounded-full bg-muted" />
      </div>
    </div>
  );
}
