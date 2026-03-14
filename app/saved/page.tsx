import { SavedPrescriptionsPage } from "@/components/saved/saved-prescriptions-page";
import { LoginPrompt } from "@/components/auth/LoginPrompt";
import { createClient } from "@/lib/supabase/server-auth";

export default async function Page() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return <LoginPrompt message="저장된 처방을 보려면 로그인이 필요해요" />;
  }

  const { data } = await (supabase as any)
    .from('user_saved_prescriptions')
    .select(`
      id,
      saved_at,
      prescription_id,
      ai_prescriptions (
        title,
        philosopher_name,
        philosopher_school,
        quote_text
      )
    `)
    .eq('user_id', session.user.id)
    .order('saved_at', { ascending: false })

  const savedPrescriptions = ((data as any[]) ?? []).map((row) => {
    const ap = row.ai_prescriptions as any
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
    }
  })

  return <SavedPrescriptionsPage savedPrescriptions={savedPrescriptions} />;
}
