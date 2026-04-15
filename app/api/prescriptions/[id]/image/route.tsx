import { NextRequest, NextResponse } from 'next/server'
import { ImageResponse } from 'next/og'
import { createClient } from '@/lib/supabase/server-auth'
import fs from 'fs'
import path from 'path'

let fontCache: ArrayBuffer | null = null

function loadFont(): ArrayBuffer {
  if (fontCache) return fontCache
  const fontPath = path.join(process.cwd(), 'public/fonts/NotoSerifKR-Regular.ttf')
  const buffer = fs.readFileSync(fontPath)
  fontCache = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer
  return fontCache
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) return new NextResponse('Unauthorized', { status: 401 })

  const { data, error } = await supabase
    .from('ai_prescriptions')
    .select('quote_text, philosopher_name, philosopher_school, philosopher_era')
    .eq('id', id)
    .eq('user_id', session.user.id)
    .single()

  if (error || !data) return new NextResponse('Not Found', { status: 404 })

  let fontData: ArrayBuffer
  try {
    fontData = loadFont()
  } catch {
    return new NextResponse('Failed to load font', { status: 500 })
  }

  const quoteLength = data.quote_text.length
  const quoteFontSize = quoteLength > 100 ? 30 : quoteLength > 70 ? 36 : quoteLength > 40 ? 42 : 48

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#1C1917',
          padding: '80px',
          fontFamily: 'Noto Serif KR',
          position: 'relative',
        }}
      >
        {/* 배경 장식 따옴표 */}
        <div
          style={{
            position: 'absolute',
            top: '48px',
            right: '60px',
            fontSize: '320px',
            color: '#ffffff',
            opacity: 0.04,
            fontFamily: 'Georgia, serif',
            lineHeight: 1,
            display: 'flex',
          }}
        >
          &ldquo;
        </div>

        {/* 상단 레이블 */}
        <div style={{ display: 'flex', marginBottom: '64px' }}>
          <span
            style={{
              border: '1px solid rgba(236, 91, 19, 0.6)',
              borderRadius: '9999px',
              padding: '8px 24px',
              fontSize: '15px',
              color: '#ec5b13',
              letterSpacing: '0.15em',
            }}
          >
            오늘의 처방
          </span>
        </div>

        {/* 인용구 */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <p
            style={{
              fontSize: quoteFontSize,
              lineHeight: 1.8,
              color: '#F5F0E8',
              margin: 0,
              wordBreak: 'keep-all',
              letterSpacing: '0.02em',
            }}
          >
            {data.quote_text}
          </p>
        </div>

        {/* 철학자 정보 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            marginTop: '56px',
            marginBottom: '44px',
          }}
        >
          <p
            style={{
              fontSize: '22px',
              color: '#F5F0E8',
              margin: 0,
              letterSpacing: '0.06em',
            }}
          >
            — {data.philosopher_name}
          </p>
          <p
            style={{
              fontSize: '14px',
              color: '#78716c',
              margin: 0,
              letterSpacing: '0.1em',
            }}
          >
            {data.philosopher_school} · {data.philosopher_era}
          </p>
        </div>

        {/* 구분선 */}
        <div
          style={{
            height: '1px',
            backgroundColor: '#292524',
            marginBottom: '32px',
          }}
        />

        {/* 앱 브랜딩 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <p
            style={{
              fontSize: '17px',
              color: '#ec5b13',
              margin: 0,
              letterSpacing: '0.05em',
            }}
          >
            오늘의철학
          </p>
          <p
            style={{
              fontSize: '13px',
              color: '#57534e',
              margin: 0,
              letterSpacing: '0.05em',
            }}
          >
            philoapp.kr
          </p>
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1080,
      fonts: [
        {
          name: 'Noto Serif KR',
          data: fontData,
          weight: 400,
          style: 'normal',
        },
      ],
    }
  )
}
