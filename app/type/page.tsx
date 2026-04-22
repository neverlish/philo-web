import type { Metadata } from 'next'
import { Clock, UserX } from 'lucide-react'
import { TypeIntroClient } from '@/components/type/type-intro-client'

export const metadata: Metadata = {
  title: '나의 철학자 유형 찾기',
  description: '7가지 질문으로 찾는 나만의 철학자 유형. 소크라테스, 니체, 에피쿠로스 등 8인의 철학자 중 나와 가장 닮은 사람은?',
}

export default function TypeIntroPage() {
  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto">
      {/* Hero */}
      <div
        className="flex-1 flex flex-col justify-end px-6 pt-20 pb-10 relative overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #2C2420 0%, #3d2e28 40%, #5a3820 70%, #ec5b13 100%)',
          minHeight: '65vh',
        }}
      >
        {/* 배경 텍스처 */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 30% 70%, #fff 1px, transparent 1px),
              radial-gradient(circle at 70% 30%, #fff 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative z-10">
          <p className="text-white/50 text-xs tracking-widest uppercase mb-6 font-sans">
            오늘의철학 · 철학자 유형 테스트
          </p>
          <h1 className="font-serif text-white text-[2.2rem] font-bold leading-tight mb-4">
            지금 나에게<br />필요한<br />철학자는?
          </h1>
          <p className="text-white/70 text-sm leading-relaxed">
            소크라테스, 니체, 에피쿠로스 등<br />
            8인의 철학자 중 나와 가장 닮은 사람
          </p>
        </div>
      </div>

      {/* Bottom Card */}
      <div className="bg-background px-6 pt-8 pb-10">
        <div className="flex items-center gap-5 mb-8">
          <div className="flex items-center gap-2 text-muted text-sm">
            <Clock className="w-4 h-4" strokeWidth={1.5} />
            <span>약 2분 소요</span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2 text-muted text-sm">
            <UserX className="w-4 h-4" strokeWidth={1.5} />
            <span>로그인 불필요</span>
          </div>
        </div>

        <p className="text-muted text-sm leading-relaxed mb-8">
          7가지 질문으로 알아보는 나만의 철학자 유형.
          나를 가장 잘 이해하는 철학자의 처방을 미리 확인해보세요.
        </p>

        <TypeIntroClient />
      </div>
    </div>
  )
}
