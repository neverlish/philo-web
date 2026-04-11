'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthProvider'
import { usePostHog } from 'posthog-js/react'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { signInWithGoogle } = useAuth()
  const posthog = usePostHog()
  const [isSigningIn, setIsSigningIn] = useState(false)

  if (!isOpen) return null

  const handleSignIn = async () => {
    setIsSigningIn(true)
    posthog?.capture('login_attempted')
    try {
      await signInWithGoogle()
    } catch (error) {
      console.error('Error signing in:', error)
      setIsSigningIn(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-background rounded-t-3xl sm:rounded-3xl p-8 w-full max-w-md mx-0 sm:mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 rounded-full bg-border mx-auto mb-6 sm:hidden" />

        <h2 className="text-2xl font-serif font-normal text-foreground mb-2">
          처방을 저장하려면<br />로그인이 필요해요
        </h2>
        <p className="text-sm text-muted mb-8 leading-relaxed">
          매일 새로운 처방, 다짐 기록, 철학자 탐색까지<br />
          모든 기능을 무료로 사용할 수 있어요.
        </p>

        <button
          onClick={handleSignIn}
          disabled={isSigningIn}
          className="w-full flex items-center justify-center gap-3 bg-card border border-border rounded-2xl px-4 py-4 hover:border-primary/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          <span className="font-medium text-foreground">
            {isSigningIn ? '로그인 중...' : '구글로 계속하기'}
          </span>
        </button>

        <button
          onClick={onClose}
          className="w-full mt-3 py-3 text-sm text-muted hover:text-foreground transition-colors"
        >
          나중에 하기
        </button>
      </div>
    </div>
  )
}
