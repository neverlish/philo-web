import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = '오늘의철학 고민별 철학 가이드'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#F4F0E8',
          color: '#29231F',
          padding: '62px 70px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', width: 760 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: 18, color: '#9A5B38', letterSpacing: 4 }}>
            <span>오늘의철학</span>
            <span style={{ width: 80, height: 1, background: '#9A5B38' }} />
            <span>WISDOM INDEX</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: 72, fontFamily: 'serif', fontSize: 76, lineHeight: 1.16, letterSpacing: -3 }}>
            <span>마음의 문제를</span>
            <span>철학의 질문으로</span>
          </div>
          <div style={{ marginTop: 42, maxWidth: 650, fontSize: 24, lineHeight: 1.55, color: '#6F665E' }}>
            불안, 인간관계, 삶의 의미를 오래된 철학의 언어로 다시 바라봅니다.
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            right: 70,
            top: 62,
            bottom: 62,
            width: 270,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderLeft: '1px solid rgba(41,35,31,0.2)',
            paddingLeft: 40,
          }}
        >
          <span style={{ fontFamily: 'monospace', fontSize: 18, color: '#958A80' }}>01—03</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontFamily: 'serif', fontSize: 30 }}>
            <span>불안과 두려움</span>
            <span>인간관계</span>
            <span>삶의 의미</span>
          </div>
          <span style={{ fontFamily: 'serif', fontSize: 96, lineHeight: 1, color: 'rgba(154,91,56,0.2)' }}>03</span>
        </div>
      </div>
    ),
    size
  )
}
