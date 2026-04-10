import { PrescriptionDetail } from '@/components/prescription/prescription-detail'
import { createClient } from '@/lib/supabase/server-auth'
import { redirect } from 'next/navigation'
import type { Prescription } from '@/types'
import type { Database } from '@/types/supabase'
import type { Metadata } from 'next'

export const metadata: Metadata = { robots: { index: false, follow: false } }

type AiPrescriptionRow = Database['public']['Tables']['ai_prescriptions']['Row']

export default async function AiPrescriptionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/')

  const [{ data, error }, { data: savedData }] = await Promise.all([
    supabase
      .from('ai_prescriptions')
      .select('*')
      .eq('id', id)
      .eq('user_id', session.user.id)
      .single(),
    supabase
      .from('user_saved_prescriptions')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('prescription_id', id)
      .maybeSingle(),
  ])

  if (error || !data) redirect('/')

  const row = data as AiPrescriptionRow

  const { data: matchedPhilosopher } = await supabase
    .from('philosophers')
    .select('id')
    .eq('name', row.philosopher_name)
    .maybeSingle()

  const prescription: Prescription = {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    philosopher: {
      id: matchedPhilosopher?.id ?? 'ai-generated',
      name: row.philosopher_name,
      nameEn: '',
      era: row.philosopher_era,
      school: row.philosopher_school,
      description: '',
    },
    quote: {
      id: 'ai-generated',
      philosopherId: matchedPhilosopher?.id ?? 'ai-generated',
      text: row.quote_text,
      meaning: row.quote_meaning,
      application: row.quote_application,
      category: '',
    },
  }

  return (
    <PrescriptionDetail
      prescription={prescription}
      isSaved={!!savedData}
      prescriptionId={id}
      userIntention={row.user_intention ?? null}
      concern={row.concern ?? null}
    />
  )
}
