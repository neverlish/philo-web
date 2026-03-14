// app/api/collective/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server-auth'

const PAGE_SIZE = 10

export async function GET(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const offset = Math.max(Number(searchParams.get('offset') ?? 0), 0)
  const sort = searchParams.get('sort') === 'popular' ? 'likes_count' : 'created_at'

  const { data: { session } } = await supabase.auth.getSession()

  const { data: posts, error } = await supabase
    .from('collective_posts')
    .select('id, content, philosopher_name, author_name, likes_count, created_at')
    .order(sort, { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1)

  if (error) return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })

  // 현재 유저의 좋아요 여부
  let likedPostIds: Set<string> = new Set()
  if (session) {
    const postIds = (posts ?? []).map((p) => p.id)
    if (postIds.length > 0) {
      const { data: likes } = await supabase
        .from('collective_post_likes')
        .select('post_id')
        .eq('user_id', session.user.id)
        .in('post_id', postIds)
      likedPostIds = new Set((likes ?? []).map((l) => l.post_id))
    }
  }

  const result = (posts ?? []).map((p) => ({
    ...p,
    isLiked: likedPostIds.has(p.id),
  }))

  return NextResponse.json({ posts: result, hasMore: result.length === PAGE_SIZE })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: { content?: string; philosopher_name?: string; prescription_id?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { content, philosopher_name, prescription_id } = body
  if (!content?.trim()) return NextResponse.json({ error: 'content is required' }, { status: 400 })
  if (content.length > 500) return NextResponse.json({ error: 'content too long' }, { status: 400 })

  const user = session.user
  const authorName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split('@')[0] ||
    '익명의 철학자'

  const { data, error } = await supabase
    .from('collective_posts')
    .insert({
      user_id: user.id,
      content: content.trim(),
      philosopher_name: philosopher_name || null,
      prescription_id: prescription_id || null,
      author_name: authorName,
    })
    .select('id')
    .single()

  if (error) return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  return NextResponse.json({ postId: data.id }, { status: 201 })
}
