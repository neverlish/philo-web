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
  themeTags: string[]
}

export interface PhilosopherItem {
  id: string
  name: string
  era: string
  region: string
  years: string | null
  keywords: string[] | null
}

export default async function Page() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return <LoginPrompt message="여정을 보려면 로그인이 필요해요" />
  }

  const [
    { data: prescriptions },
    { data: reflections },
    { data: philosophersData },
  ] = await Promise.all([
    supabase
      .from('ai_prescriptions')
      .select('id, title, philosopher_name, philosopher_school, user_intention, created_at, theme_tags')
      .eq('user_id', session.user.id)
      .not('user_intention', 'is', null)
      .order('created_at', { ascending: false }),
    supabase
      .from('prescription_reflections')
      .select('prescription_id, reflection_text')
      .eq('user_id', session.user.id),
    supabase
      .from('philosophers')
      .select('id, name, era, region, years, keywords')
      .order('era')
      .order('name'),
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
    themeTags: (row.theme_tags as string[]) ?? [],
  }))

  const philosophers: PhilosopherItem[] = (philosophersData ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    era: p.era,
    region: p.region,
    years: p.years,
    keywords: p.keywords as string[] | null,
  }))

  const encounteredNames = [...new Set((prescriptions ?? []).map((p) => p.philosopher_name))]

  return <JourneyPage items={items} philosophers={philosophers} encounteredNames={encounteredNames} />
}
