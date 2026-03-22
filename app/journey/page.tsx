import { JourneyPage } from '@/components/journey/journey-page'
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

export default async function Page() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return <LoginPrompt message="여정을 보려면 로그인이 필요해요" />
  }

  type PrescriptionRow = {
    id: string
    title: string
    philosopher_name: string
    philosopher_school: string
    user_intention: string | null
    created_at: string | null
    prescription_reflections: { reflection_text: string }[]
  }

  const { data } = await supabase
    .from('ai_prescriptions')
    .select('id, title, philosopher_name, philosopher_school, user_intention, created_at, prescription_reflections(reflection_text)')
    .eq('user_id', session.user.id)
    .not('user_intention', 'is', null)
    .order('created_at', { ascending: false })

  const rows = (data ?? []) as PrescriptionRow[]
  const items: JourneyItem[] = rows.map((row) => ({
    id: row.id,
    title: row.title,
    philosopherName: row.philosopher_name,
    philosopherSchool: row.philosopher_school,
    userIntention: row.user_intention!,
    reflection: row.prescription_reflections.length > 0
      ? row.prescription_reflections[0].reflection_text
      : null,
    createdAt: row.created_at ?? '',
  }))

  return <JourneyPage items={items} />
}
