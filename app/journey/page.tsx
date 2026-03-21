import { JourneyPage } from '@/components/journey/journey-page'
import { LoginPrompt } from '@/components/auth/LoginPrompt'
import { createClient } from '@/lib/supabase/server-auth'

export interface JourneyItem {
  id: string
  title: string
  philosopherName: string
  philosopherSchool: string
  userIntention: string
  createdAt: string
}

export default async function Page() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return <LoginPrompt message="여정을 보려면 로그인이 필요해요" />
  }

  const { data } = await supabase
    .from('ai_prescriptions')
    .select('id, title, philosopher_name, philosopher_school, user_intention, created_at')
    .eq('user_id', session.user.id)
    .not('user_intention', 'is', null)
    .order('created_at', { ascending: false })

  const items: JourneyItem[] = (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    philosopherName: row.philosopher_name,
    philosopherSchool: row.philosopher_school,
    userIntention: row.user_intention!,
    createdAt: row.created_at ?? '',
  }))

  return <JourneyPage items={items} />
}
