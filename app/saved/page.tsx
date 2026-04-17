import type { Metadata } from 'next'
import { SavedPrescriptionsPage } from "@/components/saved/saved-prescriptions-page";

export const metadata: Metadata = { robots: { index: false, follow: false } }
import { LoginPrompt } from "@/components/auth/LoginPrompt";
import { createClient } from "@/lib/supabase/server-auth";

export default async function Page() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return <LoginPrompt message="처방함을 보려면 로그인이 필요해요" />;
  }

  const [{ data: intentionData }, { data: historyData }, { data: reflectionData }] = await Promise.all([
    supabase
      .from('ai_prescriptions')
      .select('id, title, philosopher_name, philosopher_school, quote_text, user_intention, created_at')
      .eq('user_id', session.user.id)
      .not('user_intention', 'is', null)
      .order('created_at', { ascending: false }),
    supabase
      .from('ai_prescriptions')
      .select('id, title, philosopher_name, philosopher_school, quote_text, user_intention, created_at')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('prescription_reflections')
      .select('prescription_id')
      .eq('user_id', session.user.id),
  ])

  const reflectedIds = new Set((reflectionData ?? []).map((r) => r.prescription_id))

  const intentions = (intentionData ?? []).map((row) => ({
    id: row.id,
    prescriptionId: row.id,
    philosopher: row.philosopher_name,
    philosopherId: '',
    title: row.title,
    excerpt: row.quote_text,
    savedAt: row.created_at
      ? new Date(row.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
      : '',
    category: row.philosopher_school,
    userIntention: row.user_intention ?? null,
    hasReflection: reflectedIds.has(row.id),
  }))

  const history = (historyData ?? []).map((row) => ({
    id: row.id,
    prescriptionId: row.id,
    philosopher: row.philosopher_name,
    philosopherId: '',
    title: row.title,
    excerpt: row.quote_text,
    savedAt: row.created_at
      ? new Date(row.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
      : '',
    category: row.philosopher_school,
    userIntention: row.user_intention ?? null,
    hasReflection: reflectedIds.has(row.id),
  }))

  return <SavedPrescriptionsPage intentions={intentions} history={history} />;
}
