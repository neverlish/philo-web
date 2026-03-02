import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import type { DbConcern } from '@/types'

export const dynamic = 'force-dynamic'

// GET /api/concerns - 고민/상황 목록 조회
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    let query = supabase
      .from('concerns')
      .select('*')
      .order('display_order', { ascending: true })

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ concerns: data as DbConcern[] })
  } catch (error) {
    console.error('Error fetching concerns:', error)
    return NextResponse.json(
      { error: 'Failed to fetch concerns' },
      { status: 500 }
    )
  }
}

// POST /api/concerns - 커스텀 고민 생성
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { text, category } = body

    if (!text || !category) {
      return NextResponse.json(
        { error: 'text and category are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('concerns')
      .insert({
        text,
        category,
        is_custom: true
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ concern: data as DbConcern }, { status: 201 })
  } catch (error) {
    console.error('Error creating concern:', error)
    return NextResponse.json(
      { error: 'Failed to create concern' },
      { status: 500 }
    )
  }
}
