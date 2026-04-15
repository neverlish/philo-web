'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { AuthUser, AuthContextValue } from '@/lib/auth/types'
import posthog from 'posthog-js'

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          user_metadata: session.user.user_metadata,
        })
      }
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          user_metadata: session.user.user_metadata,
        })

        // 로그인 직후 대기 중인 고민이 있으면 실제 처방 생성
        if (event === 'SIGNED_IN') {
          posthog.identify(session.user.id, {
            email: session.user.email,
            provider: session.user.app_metadata?.provider,
          })
          posthog.capture('login_completed', {
            user_id: session.user.id,
            provider: session.user.app_metadata?.provider,
          })

          // 미리보기 처방 저장 대기 중인 경우
          const pendingPreviewSave = sessionStorage.getItem('pendingPreviewSave')
          const previewPrescription = sessionStorage.getItem('previewPrescription')
          if (pendingPreviewSave && previewPrescription) {
            sessionStorage.removeItem('pendingPreviewSave')
            sessionStorage.removeItem('previewPrescription')
            try {
              const prescriptionData = JSON.parse(previewPrescription)
              fetch('/api/prescription/save-preview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(prescriptionData),
              })
                .then((res) => res.ok ? res.json() : null)
                .then((data) => {
                  if (data?.prescriptionId) {
                    window.location.href = `/prescription/ai/${data.prescriptionId}`
                  }
                })
                .catch(() => {})
            } catch {}
            return
          }

          // 일반 고민 처방 생성 대기 중인 경우
          const pendingConcern = localStorage.getItem('pendingConcern')
          if (pendingConcern) {
            localStorage.removeItem('pendingConcern')
            fetch('/api/prescription/generate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ concern: pendingConcern }),
            })
              .then((res) => res.ok ? res.json() : null)
              .then((data) => {
                if (data?.prescriptionId) {
                  window.location.href = `/prescription/ai/${data.prescriptionId}`
                }
              })
              .catch(() => {})
          }
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  const value: AuthContextValue = {
    user,
    loading,
    signInWithGoogle,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
