import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = '오늘의철학 - 매일 1분, 철학과 친구되기'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#1a1a1a',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: '#f5f0e8',
            letterSpacing: '-2px',
          }}
        >
          오늘의철학
        </div>
        <div
          style={{
            fontSize: 28,
            color: '#a89f8c',
            letterSpacing: '2px',
          }}
        >
          매일 1분, 철학과 친구되기
        </div>
      </div>
    ),
    { ...size }
  )
}
