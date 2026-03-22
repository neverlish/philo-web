import { ImageResponse } from 'next/og'
import { supabase } from '@/lib/supabase'

export const runtime = 'edge'
export const alt = '철학자 소개'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({
  params,
}: {
  params: { id: string }
}) {
  const { data } = await supabase
    .from('philosophers')
    .select('name, name_en, era, region, core_idea')
    .eq('id', params.id)
    .single()

  const name = data?.name ?? '철학자'
  const nameEn = data?.name_en ?? ''
  const era = data?.era ?? ''
  const coreIdea = data?.core_idea
    ? data.core_idea.slice(0, 60) + (data.core_idea.length > 60 ? '...' : '')
    : ''

  return new ImageResponse(
    (
      <div
        style={{
          background: '#1a1a1a',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px',
          gap: 20,
        }}
      >
        <div style={{ fontSize: 20, color: '#a89f8c', letterSpacing: '3px' }}>
          {era}
        </div>
        <div style={{ fontSize: 80, fontWeight: 700, color: '#f5f0e8', lineHeight: 1.1 }}>
          {name}
        </div>
        <div style={{ fontSize: 28, color: '#8a8078' }}>
          {nameEn}
        </div>
        {coreIdea && (
          <div
            style={{
              fontSize: 22,
              color: '#c8b99a',
              marginTop: 16,
              maxWidth: 900,
              lineHeight: 1.6,
            }}
          >
            {coreIdea}
          </div>
        )}
        <div
          style={{
            position: 'absolute',
            bottom: 60,
            right: 80,
            fontSize: 18,
            color: '#666',
          }}
        >
          오늘의철학
        </div>
      </div>
    ),
    { ...size }
  )
}
