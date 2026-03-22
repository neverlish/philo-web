import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import type { DbPhilosopher } from '@/types'

export const dynamic = 'force-dynamic'

// GET /api/philosophers - 철학자 목록 조회
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const era = searchParams.get('era')
    const region = searchParams.get('region')
    const keyword = searchParams.get('keyword')
    const concerns = searchParams.get('concerns')

    const limit = Math.min(Number(searchParams.get('limit') ?? 10), 50)
    const offset = Math.max(Number(searchParams.get('offset') ?? 0), 0)

    let query = supabase
      .from('philosophers')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (era) {
      query = query.eq('era', era)
    }
    if (region) {
      query = query.eq('region', region)
    }
    if (keyword) {
      query = query.or(`name.ilike.%${keyword}%,name_en.ilike.%${keyword}%,core_idea.ilike.%${keyword}%`)
    }
    if (concerns) {
      query = query.overlaps('keywords', concerns.split(','))
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ philosophers: data as DbPhilosopher[] })
  } catch (error) {
    console.error('Error fetching philosophers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch philosophers' },
      { status: 500 }
    )
  }
}
