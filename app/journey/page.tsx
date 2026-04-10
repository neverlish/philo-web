import type { Metadata } from 'next'
import { JourneyPage } from '@/components/journey/journey-page'

export const metadata: Metadata = { robots: { index: false, follow: false } }
import { LoginPrompt } from '@/components/auth/LoginPrompt'
import { createClient } from '@/lib/supabase/server-auth'

export interface JourneyItem {
  id: string
  title: string
  philosopherName: string
  philosopherSchool: string
  userIntention: string
  reflection: string | null
  createdAt: string
}

export interface JournalEntry {
  id: string
  content: string
  prescription_id: string | null
  created_at: string
  ai_prescriptions: { title: string; philosopher_name: string } | null
}

export interface TodayPrescription {
  id: string
  title: string
  philosopher_name: string
}

export default async function Page() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return <LoginPrompt message="여정을 보려면 로그인이 필요해요" />
  }

  const today = new Date().toISOString().split('T')[0]

  const [
    { data: prescriptions },
    { data: reflections },
    { data: journalEntries },
    { data: todayPrescriptionData },
  ] = await Promise.all([
    supabase
      .from('ai_prescriptions')
      .select('id, title, philosopher_name, philosopher_school, user_intention, created_at')
      .eq('user_id', session.user.id)
      .not('user_intention', 'is', null)
      .order('created_at', { ascending: false }),
    supabase
      .from('prescription_reflections')
      .select('prescription_id, reflection_text')
      .eq('user_id', session.user.id),
    supabase
      .from('journal_entries')
      .select('id, content, prescription_id, created_at, ai_prescriptions(title, philosopher_name)')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('ai_prescriptions')
      .select('id, title, philosopher_name')
      .eq('user_id', session.user.id)
      .gte('created_at', `${today}T00:00:00`)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])

  const reflectionMap = new Map(
    (reflections ?? []).map((r) => [r.prescription_id, r.reflection_text])
  )

  const items: JourneyItem[] = (prescriptions ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    philosopherName: row.philosopher_name,
    philosopherSchool: row.philosopher_school,
    userIntention: row.user_intention!,
    reflection: reflectionMap.get(row.id) ?? null,
    createdAt: row.created_at ?? '',
  }))

  return (
    <JourneyPage
      items={items}
      journalEntries={(journalEntries ?? []) as JournalEntry[]}
      todayPrescription={todayPrescriptionData as TodayPrescription | null}
    />
  )
}
