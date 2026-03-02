import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import type { DbQuote } from '@/types'

export const dynamic = 'force-dynamic'

// GET /api/quotes - 명언 목록 조회
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const concern = searchParams.get('concern')
    const philosopherId = searchParams.get('philosopher_id')
    const today = searchParams.get('today') // 오늘의 명언

    let query = supabase
      .from('quotes')
      .select('*, philosophers!inner(*)')
      .order('created_at', { ascending: false })

    if (category) {
      query = query.eq('category', category)
    }
    if (philosopherId) {
      query = query.eq('philosopher_id', philosopherId)
    }
    if (today === 'true') {
      // 오늘의 명언 (date_scheduled가 오늘인 것)
      const todayDate = new Date().toISOString().split('T')[0]
      query = query.eq('date_scheduled', todayDate).limit(1)
    }
    if (concern) {
      // concerns 배열에 포함된 것
      query = query.contains('concerns', [concern])
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ quotes: data as DbQuote[] })
  } catch (error) {
    console.error('Error fetching quotes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quotes' },
      { status: 500 }
    )
  }
}
