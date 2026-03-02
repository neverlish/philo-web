// Server-side Supabase utilities
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabaseServer = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Server-side data fetching functions
export async function getPhilosophers() {
  const { data, error } = await supabaseServer
    .from('philosophers')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getQuotes(params?: {
  category?: string
  concern?: string
  philosopher_id?: string
  today?: boolean
}) {
  let query = supabaseServer
    .from('quotes')
    .select('*, philosophers(*)')
    .order('created_at', { ascending: false })

  if (params?.category) query = query.eq('category', params.category)
  if (params?.philosopher_id) query = query.eq('philosopher_id', params.phosopher_id)
  if (params?.today) {
    const todayDate = new Date().toISOString().split('T')[0]
    query = query.eq('date_scheduled', todayDate).limit(1)
  }
  if (params?.concern) {
    query = query.contains('concerns', [params.concern])
  }

  const { data, error } = await query

  if (error) throw error
  return data
}

export async function getConcerns(params?: { category?: string }) {
  let query = supabaseServer
    .from('concerns')
    .select('*')
    .order('display_order', { ascending: true })

  if (params?.category) query = query.eq('category', params.category)

  const { data, error } = await query

  if (error) throw error
  return data
}

export async function getPhilosopherById(id: string) {
  const { data, error } = await supabaseServer
    .from('philosophers')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function getQuoteById(id: string) {
  const { data, error } = await supabaseServer
    .from('quotes')
    .select('*, philosophers(*)')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}
