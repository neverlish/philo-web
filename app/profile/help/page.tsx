// app/profile/help/page.tsx
import { Header } from "@/components/navigation/header";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { Mic, Sparkles, Bookmark, MessageCircle } from "lucide-react";

const steps = [
  {
    icon: MessageCircle,
    title: "매일 체크인",
    description: "앱을 열면 오늘의 감정 상태를 확인합니다. 하루를 시작하는 짧은 의식입니다.",
  },
  {
    icon: Mic,
    title: "고민 말하기",
    description: "마이크 버튼을 눌러 오늘의 고민을 자유롭게 말하세요. 짧아도 괜찮습니다.",
  },
  {
    icon: Sparkles,
    title: "처방 받기",
    description: "AI가 당신의 고민에 맞는 철학자의 지혜를 처방해 드립니다.",
  },
  {
    icon: Bookmark,
    title: "저장하고 돌아보기",
    description: "마음에 드는 처방을 저장하고, 언제든 다시 꺼내볼 수 있습니다.",
  },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-background shadow-2xl">
      <Header title="도움말" showBack showSearch={false} />

      <main className="flex-1 px-6 pt-4 pb-32 overflow-y-auto">
        <p className="text-sm text-muted leading-relaxed mb-8">
          지혜의 다리는 매일 철학적 지혜로 하루를 시작하도록 돕는 앱입니다.
        </p>

        <div className="space-y-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-muted">{index + 1}단계</span>
                    <h3 className="text-sm font-bold text-foreground">{step.title}</h3>
                  </div>
                  <p className="text-sm text-muted leading-relaxed">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
