// components/opening/stt-input.tsx
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Mic } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase/client";

type Status = "idle" | "listening" | "done" | "noInput";

export function STTInput() {
  const [status, setStatus] = useState<Status>("idle");
  const [transcript, setTranscript] = useState("");
  const transcriptRef = useRef("");
  const router = useRouter();
  const { user } = useAuth();

  const saveCheckIn = async (text: string) => {
    if (!user) return;
    const today = new Date().toISOString().split("T")[0];
    await supabase.from("check_ins").upsert(
      { user_id: user.id, check_in_date: today, checked_in_at: new Date().toISOString() },
      { onConflict: "user_id,check_in_date" }
    );
    if (text) {
      await supabase.from("chat_conversations").insert({
        user_id: user.id,
        initial_concern: text,
        messages: [],
      });
    }
  };

  const skip = () => {
    saveCheckIn("").finally(() => {
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
      saveCheckIn(transcriptRef.current).finally(() => {
        setTimeout(() => router.push("/"), 2000);
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
          disabled={status === "listening" || status === "done"}
          className="relative w-24 h-24 bg-gradient-to-br from-stone-100 to-stone-200 rounded-full shadow-lg flex items-center justify-center border border-border disabled:opacity-50"
        >
          <Mic className="w-10 h-10 text-primary" strokeWidth={2} />
        </motion.button>
      </div>

      <p className="text-sm font-medium text-primary mb-2">
        {status === "listening" ? "듣고 있어요..." : status === "done" ? "잘 들었어요" : "눌러서 이야기하기"}
      </p>

      {/* Done feedback */}
      {status === "done" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          className="mt-20"
        >
          <p className="text-sm tracking-widest text-muted">생각이 흩어지고 있습니다...</p>
        </motion.div>
      )}

      {/* Skip button */}
      {status !== "done" && (
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
