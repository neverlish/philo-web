import { ImageResponse } from 'next/og'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

export const runtime = 'nodejs'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

async function loadKoreanFont(text: string): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400&text=${encodeURIComponent(text)}`
  const css = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
  }).then((r) => r.text())
  const fontUrl = css.match(/src: url\(([^)]+)\) format\('woff2'\)/)?.[1]
  if (!fontUrl) throw new Error('Font URL not found')
  return fetch(fontUrl).then((r) => r.arrayBuffer())
}

export default async function ShareOgImage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data } = await supabase
    .from('ai_prescriptions')
    .select('quote_text, philosopher_name, philosopher_school, philosopher_era, title')
    .eq('id', id)
    .single()

  // 데이터 없으면 기본 OG 이미지
  if (!data) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1C1917',
          }}
        >
          <p style={{ color: '#ec5b13', fontSize: 48, fontFamily: 'serif' }}>오늘의철학</p>
        </div>
      ),
      { width: 1200, height: 630 }
    )
  }

  let fontData: ArrayBuffer
  try {
    fontData = await loadKoreanFont(
      `오늘의처방${data.quote_text}${data.philosopher_name}${data.philosopher_school}${data.philosopher_era}`
    )
  } catch {
    fontData = new ArrayBuffer(0)
  }

  const quoteLength = data.quote_text.length
  const quoteFontSize = quoteLength > 120 ? 28 : quoteLength > 80 ? 32 : quoteLength > 50 ? 38 : 44

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'row',
          backgroundColor: '#1C1917',
          fontFamily: 'Noto Serif KR',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 배경 장식 따옴표 */}
        <div
          style={{
            position: 'absolute',
            top: '-20px',
            right: '40px',
            fontSize: '400px',
            color: '#ffffff',
            opacity: 0.04,
            fontFamily: 'Georgia, serif',
            lineHeight: 1,
            display: 'flex',
          }}
        >
          &ldquo;
        </div>

        {/* 좌측 세로 액센트 라인 */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '6px',
            height: '100%',
            background: 'linear-gradient(180deg, #ec5b13 0%, #c9872a 100%)',
            display: 'flex',
          }}
        />

        {/* 메인 콘텐츠 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '64px 80px 64px 86px',
            width: '100%',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* 상단: 레이블 */}
          <div style={{ display: 'flex' }}>
            <span
              style={{
                border: '1px solid rgba(236, 91, 19, 0.6)',
                borderRadius: '9999px',
                padding: '6px 20px',
                fontSize: '13px',
                color: '#ec5b13',
                letterSpacing: '0.15em',
              }}
            >
              오늘의 처방
            </span>
          </div>

          {/* 중앙: 인용구 */}
          <div style={{ display: 'flex', flex: 1, alignItems: 'center', padding: '32px 0' }}>
            <p
              style={{
                fontSize: quoteFontSize,
                lineHeight: 1.8,
                color: '#F5F0E8',
                margin: 0,
                wordBreak: 'keep-all',
                letterSpacing: '0.02em',
                maxWidth: '860px',
              }}
            >
              {data.quote_text}
            </p>
          </div>

          {/* 하단: 철학자 + 앱 브랜딩 */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <p style={{ fontSize: '20px', color: '#F5F0E8', margin: 0, letterSpacing: '0.06em' }}>
                — {data.philosopher_name}
              </p>
              <p style={{ fontSize: '13px', color: '#78716c', margin: 0, letterSpacing: '0.1em' }}>
                {data.philosopher_school} · {data.philosopher_era}
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
              <p style={{ fontSize: '16px', color: '#ec5b13', margin: 0, letterSpacing: '0.05em' }}>
                오늘의철학
              </p>
              <p style={{ fontSize: '12px', color: '#57534e', margin: 0, letterSpacing: '0.05em' }}>
                philoapp.kr
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: fontData.byteLength > 0
        ? [{ name: 'Noto Serif KR', data: fontData, weight: 400, style: 'normal' }]
        : [],
    }
  )
}
