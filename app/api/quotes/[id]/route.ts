import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import type { DbQuote } from '@/types'

export const dynamic = 'force-dynamic'

// GET /api/quotes/[id] - 명언 상세 조회
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from('quotes')
      .select('*, philosophers!inner(*)')
      .eq('id', params.id)
      .single()

    if (error) throw error

    return NextResponse.json({ quote: data as DbQuote })
  } catch (error) {
    console.error('Error fetching quote:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quote' },
      { status: 500 }
    )
  }
}
