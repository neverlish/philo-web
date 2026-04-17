import { ImageResponse } from 'next/og'
import { createClient } from '@/lib/supabase/server-auth'
import { NextRequest } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export const runtime = 'nodejs'

function loadKoreanFont(): ArrayBuffer {
  const fontPath = join(process.cwd(), 'public', 'fonts', 'NotoSerifKR-Regular.ttf')
  return readFileSync(fontPath).buffer as ArrayBuffer
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) return new Response('Unauthorized', { status: 401 })

  const { data, error } = await supabase
    .from('ai_prescriptions')
    .select('quote_text, philosopher_name, philosopher_school, philosopher_era')
    .eq('id', id)
    .eq('user_id', session.user.id)
    .single()

  if (error || !data) return new Response('Not found', { status: 404 })

  let fontData: ArrayBuffer
  try {
    fontData = loadKoreanFont()
  } catch {
    fontData = new ArrayBuffer(0)
  }

  const quoteLen = data.quote_text.length
  const quoteFontSize = quoteLen > 100 ? 36 : quoteLen > 60 ? 44 : 52

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#F9F7F2',
          fontFamily: 'Noto Serif KR',
          padding: '88px',
          position: 'relative',
        }}
      >
        {/* 상단 앱 레이블 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '4px',
              height: '22px',
              backgroundColor: '#ec5b13',
              display: 'flex',
            }}
          />
          <span style={{ fontSize: '22px', color: '#ec5b13', letterSpacing: '0.08em' }}>
            오늘의처방
          </span>
        </div>

        {/* 인용구 영역 */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            paddingTop: '16px',
          }}
        >
          <div
            style={{
              fontSize: '100px',
              color: '#ec5b13',
              lineHeight: 0.9,
              display: 'flex',
              opacity: 0.25,
              marginBottom: '8px',
            }}
          >
            "
          </div>
          <p
            style={{
              fontSize: `${quoteFontSize}px`,
              lineHeight: 1.75,
              color: '#2C2420',
              margin: 0,
              wordBreak: 'keep-all',
              letterSpacing: '0.02em',
            }}
          >
            {data.quote_text}
          </p>
        </div>

        {/* 하단 철학자 정보 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div
            style={{
              width: '36px',
              height: '2px',
              backgroundColor: '#2C2420',
              display: 'flex',
              opacity: 0.25,
              marginBottom: '4px',
            }}
          />
          <p style={{ fontSize: '28px', fontWeight: 700, color: '#2C2420', margin: 0 }}>
            {data.philosopher_name}
          </p>
          <p style={{ fontSize: '20px', color: '#6B5F56', margin: 0, letterSpacing: '0.04em' }}>
            {data.philosopher_school} · {data.philosopher_era}
          </p>
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1080,
      fonts:
        fontData.byteLength > 0
          ? [{ name: 'Noto Serif KR', data: fontData, weight: 400, style: 'normal' }]
          : [],
    }
  )
}
