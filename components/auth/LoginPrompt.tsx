'use client'

import { useState } from 'react'
import { LoginModal } from './LoginModal'
import { Lock } from 'lucide-react'

interface LoginPromptProps {
  message?: string
}

export function LoginPrompt({ message = '이 기능을 사용하려면 로그인이 필요합니다' }: LoginPromptProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Lock className="w-8 h-8 text-gray-400" />
        </div>

        <h2 className="text-2xl font-bold mb-2">로그인이 필요합니다</h2>

        <p className="text-gray-600 mb-6 max-w-md">
          {message}
        </p>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          로그인하기
        </button>

        <p className="text-sm text-gray-500 mt-4">
          무료로 시작할 수 있어요
        </p>
      </div>

      <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
