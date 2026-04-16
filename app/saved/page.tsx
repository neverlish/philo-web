import type { Metadata } from 'next'
import { SavedPrescriptionsPage } from "@/components/saved/saved-prescriptions-page";

export const metadata: Metadata = { robots: { index: false, follow: false } }
import { LoginPrompt } from "@/components/auth/LoginPrompt";
import { createClient } from "@/lib/supabase/server-auth";

interface SavedRow {
  id: string
  saved_at: string
  prescription_id: string
  ai_prescriptions: {
    title: string
    philosopher_name: string
    philosopher_school: string
    quote_text: string
    user_intention: string | null
  } | null
}

export default async function Page() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return <LoginPrompt message="저장된 처방을 보려면 로그인이 필요해요" />;
  }

  const [{ data }, { data: historyData }, { data: reflectionData }] = await Promise.all([
    supabase
      .from('user_saved_prescriptions')
      .select(`
        id,
        saved_at,
        prescription_id,
        ai_prescriptions (
          title,
          philosopher_name,
          philosopher_school,
          quote_text,
          user_intention
        )
      `)
      .eq('user_id', session.user.id)
      .order('saved_at', { ascending: false }),
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

  const rows = (data ?? []) as SavedRow[]
  const reflectedIds = new Set((reflectionData ?? []).map((r) => r.prescription_id))

  const savedPrescriptions = rows.map((row) => {
    const ap = row.ai_prescriptions
    return {
      id: row.id,
      prescriptionId: row.prescription_id,
      philosopher: ap?.philosopher_name ?? '',
      philosopherId: ap?.philosopher_name?.toLowerCase().replace(/\s/g, '-') ?? '',
      title: ap?.title ?? '',
      excerpt: ap?.quote_text ?? '',
      savedAt: new Date(row.saved_at).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      category: ap?.philosopher_school ?? '',
      userIntention: ap?.user_intention ?? null,
      hasReflection: reflectedIds.has(row.prescription_id),
    }
  })

  const savedIds = new Set(rows.map((r) => r.prescription_id))
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
    isSaved: savedIds.has(row.id),
  }))

  return <SavedPrescriptionsPage savedPrescriptions={savedPrescriptions} history={history} />;
}
