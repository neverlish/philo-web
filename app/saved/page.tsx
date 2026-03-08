import { SavedPrescriptionsPage } from "@/components/saved/saved-prescriptions-page";
import { LoginPrompt } from "@/components/auth/LoginPrompt";
import { createClient } from "@/lib/supabase/server-auth";

export default async function Page() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return <LoginPrompt message="저장된 처방을 보려면 로그인이 필요해요" />;
  }

  return <SavedPrescriptionsPage />;
}
