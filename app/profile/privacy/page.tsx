// app/profile/privacy/page.tsx
import { Header } from "@/components/navigation/header";
import { BottomNav } from "@/components/navigation/bottom-nav";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-background shadow-2xl">
      <Header title="개인정보 처리방침" />

      <main className="flex-1 px-6 pt-4 pb-32 overflow-y-auto">
        <p className="text-xs text-muted mb-6">최종 업데이트: 2026년 3월 15일</p>

        <div className="space-y-8 text-sm leading-relaxed">
          <section>
            <h2 className="font-bold text-foreground mb-2">1. 수집하는 개인정보 항목</h2>
            <p className="text-muted">
              이메일 주소, OAuth 인증 토큰(Google), 앱 사용 기록(체크인 날짜, 고민 내용, AI 처방 기록)
            </p>
          </section>

          <section>
            <h2 className="font-bold text-foreground mb-2">2. 개인정보 이용 목적</h2>
            <p className="text-muted">
              서비스 제공 및 운영, 개인화된 철학 처방 생성, 서비스 개선을 위한 통계 분석
            </p>
          </section>

          <section>
            <h2 className="font-bold text-foreground mb-2">3. 개인정보 보관 기간</h2>
            <p className="text-muted">
              회원 탈퇴 시 즉시 삭제합니다. 단, 관련 법령에 따라 일정 기간 보관이 필요한 정보는 해당 기간 동안 보관됩니다.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-foreground mb-2">4. 제3자 제공</h2>
            <p className="text-muted">
              수집한 개인정보는 원칙적으로 외부에 제공하지 않습니다. 단, AI 처방 생성을 위해 고민 내용이 Anthropic API로 전송됩니다.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-foreground mb-2">5. 문의</h2>
            <p className="text-muted">
              개인정보 관련 문의는 앱 내 문의하기를 통해 연락해 주세요.
            </p>
          </section>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
