import type { Metadata } from 'next'
import { QuizClient } from '@/components/type/quiz-client'

export const metadata: Metadata = {
  title: '철학자 유형 테스트',
  robots: { index: false, follow: false },
}

export default function QuizPage() {
  return <QuizClient />
}
