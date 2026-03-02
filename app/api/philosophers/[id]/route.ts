import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import type { DbPhilosopher, DbQuote } from '@/types'

export const dynamic = 'force-dynamic'

// GET /api/philosophers/[id] - 철학자 상세 조회
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { data: philosopher, error: philosopherError } = await supabase
      .from('philosophers')
      .select('*')
      .eq('id', params.id)
      .single()

    if (philosopherError) throw philosopherError

    // 관련 명언도 함께 조회
    const { data: quotes, error: quotesError } = await supabase
      .from('quotes')
      .select('*')
      .eq('philosopher_id', params.id)
      .order('created_at', { ascending: false })

    if (quotesError) throw quotesError

    return NextResponse.json({
      philosopher: philosopher as DbPhilosopher,
      quotes: quotes as DbQuote[]
    })
  } catch (error) {
    console.error('Error fetching philosopher:', error)
    return NextResponse.json(
      { error: 'Failed to fetch philosopher' },
      { status: 500 }
    )
  }
}
