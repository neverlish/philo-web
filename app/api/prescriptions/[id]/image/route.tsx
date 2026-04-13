import { NextRequest, NextResponse } from 'next/server'
import { ImageResponse } from 'next/og'
import { createClient } from '@/lib/supabase/server-auth'

async function loadFont(text: string): Promise<ArrayBuffer> {
  const params = new URLSearchParams({ family: 'Noto Serif KR', text })
  const css = await fetch(
    `https://fonts.googleapis.com/css2?${params}`,
    {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    }
  ).then((r) => r.text())

  const match = css.match(/src: url\((.+?)\) format/)
  if (!match) throw new Error('Font URL not found in Google Fonts response')
  return fetch(match[1]).then((r) => r.arrayBuffer())
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

  const allText = `오늘의 처방${data.quote_text}${data.philosopher_name}${data.philosopher_school}${data.philosopher_era}오늘의철학philoapp.kr`

  let fontData: ArrayBuffer
  try {
    fontData = await loadFont(allText)
  } catch {
    return new NextResponse('Failed to load font', { status: 500 })
  }

  const quoteLength = data.quote_text.length
  const quoteFontSize = quoteLength > 80 ? 32 : quoteLength > 50 ? 38 : 44

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#F9F7F2',
          padding: '80px',
          fontFamily: 'Noto Serif KR',
        }}
      >
        {/* 상단 레이블 */}
        <div style={{ display: 'flex', marginBottom: '48px' }}>
          <span
            style={{
              border: '1.5px solid #2C2420',
              borderRadius: '9999px',
              padding: '8px 24px',
              fontSize: '16px',
              color: '#2C2420',
              letterSpacing: '0.12em',
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
              lineHeight: 1.75,
              color: '#2C2420',
              margin: 0,
              wordBreak: 'keep-all',
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
            gap: '6px',
            marginTop: '48px',
            marginBottom: '40px',
          }}
        >
          <p
            style={{
              fontSize: '24px',
              fontWeight: 700,
              color: '#2C2420',
              margin: 0,
            }}
          >
            {data.philosopher_name}
          </p>
          <p
            style={{
              fontSize: '14px',
              color: '#6B5F56',
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
            backgroundColor: '#e7e5e4',
            marginBottom: '28px',
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
              fontSize: '18px',
              fontWeight: 700,
              color: '#ec5b13',
              margin: 0,
            }}
          >
            오늘의철학
          </p>
          <p
            style={{
              fontSize: '14px',
              color: '#6B5F56',
              margin: 0,
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
