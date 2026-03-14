import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server-auth'

type Params = { params: Promise<{ id: string }> }

export async function POST(_request: Request, { params }: Params) {
  try {
    const { id: prescriptionId } = await params
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { error } = await supabase.from('user_saved_prescriptions').insert({
      user_id: session.user.id,
      prescription_id: prescriptionId,
    })

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Already saved' }, { status: 409 })
      }
      console.error('Save error:', error)
      return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
    }

    return NextResponse.json({ saved: true })
  } catch (error) {
    console.error('Save prescription error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const { id: prescriptionId } = await params
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { error } = await supabase
      .from('user_saved_prescriptions')
      .delete()
      .eq('user_id', session.user.id)
      .eq('prescription_id', prescriptionId)

    if (error) {
      console.error('Delete save error:', error)
      return NextResponse.json({ error: 'Failed to unsave' }, { status: 500 })
    }

    return NextResponse.json({ saved: false })
  } catch (error) {
    console.error('Unsave prescription error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
