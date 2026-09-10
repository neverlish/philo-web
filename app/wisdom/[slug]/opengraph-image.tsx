import { ImageResponse } from 'next/og'
import { WISDOM_TOPICS, WISDOM_TOPIC_LIST } from '@/lib/wisdom-topics'

export const runtime = 'edge'
export const alt = '오늘의철학 고민별 철학 가이드'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const topic = WISDOM_TOPICS[slug] ?? WISDOM_TOPIC_LIST[0]
  const issue = String(WISDOM_TOPIC_LIST.findIndex((item) => item.slug === topic.slug) + 1).padStart(2, '0')

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
        <div style={{ display: 'flex', flexDirection: 'column', width: 790, zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: 18, color: topic.accent, letterSpacing: 4 }}>
            <span>오늘의철학</span>
            <span style={{ width: 80, height: 1, background: topic.accent }} />
            <span>WISDOM · {issue}</span>
          </div>

          <div style={{ marginTop: 62, fontSize: 21, color: topic.accent, letterSpacing: 5 }}>{topic.eyebrow}</div>
          <div style={{ marginTop: 24, maxWidth: 780, fontFamily: 'serif', fontSize: 72, lineHeight: 1.16, letterSpacing: -3 }}>
            {topic.title}
          </div>
          <div style={{ marginTop: 38, maxWidth: 740, fontSize: 23, lineHeight: 1.55, color: '#6F665E' }}>
            {topic.lead.length > 95 ? `${topic.lead.slice(0, 95)}…` : topic.lead}
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            width: 330,
            height: 630,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: topic.accent,
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 24,
              display: 'flex',
              border: '1px solid rgba(244,240,232,0.35)',
            }}
          />
          <span style={{ fontFamily: 'serif', fontSize: 170, lineHeight: 1, color: '#F4F0E8' }}>{issue}</span>
          <span
            style={{
              position: 'absolute',
              bottom: 52,
              fontSize: 18,
              color: 'rgba(244,240,232,0.72)',
              letterSpacing: 5,
            }}
          >
            {topic.shortTitle}
          </span>
        </div>
      </div>
    ),
    size
  )
}
