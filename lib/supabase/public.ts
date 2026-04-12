import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

// Cookie-free Supabase client for cacheable public data (philosophers, etc.)
// Do NOT use for user-specific queries — those need server-auth.ts
export function createPublicClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
