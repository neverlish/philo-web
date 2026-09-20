'use client'

import Image from 'next/image'
import { useId, useRef, useState } from 'react'
import { visualPath } from '@/lib/explorer/visual-assets'
import { trackExplorer } from '@/lib/posthog/explorer-events'

export function PlatoLooking() {
  const id = useId()
  const [position, setPosition] = useState(0)
  const milestones = useRef(new Set<string>())
  const revealed = position >= 75
  function move(value: number) {
    const next = Math.max(0, Math.min(100, value))
    if (next === position) return
    setPosition(next)
    for (const event of ['explorer_looking_started', ...(next >= 75 ? ['explorer_looking_revealed'] : [])] as const) {
      if (!milestones.current.has(event)) {
        milestones.current.add(event)
        trackExplorer(event as 'explorer_looking_started' | 'explorer_looking_revealed', 'plato')
      }
    }
  }
  const buttonClass = 'min-h-11 border-b border-[#697366]/50 px-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-4 disabled:opacity-40'
  return <div className="ph-no-capture">
    <p id={`${id}-help`} className="mb-4 text-sm leading-7">아래 손잡이를 오른쪽으로 옮겨보세요. 그림의 보이지 않던 쪽을 살펴볼 수 있어요.</p>
    <div className="relative aspect-[9/8] overflow-hidden border border-[#35463d]/20 bg-[#171c18] sm:aspect-[4/3]">
      <Image src={visualPath('plato')} alt="시선을 옮겨 살펴보는 돌벽의 그림자와 오른쪽의 토기" width={1536} height={1024}
        sizes="(max-width: 1064px) 170vw, 1741px"
        className="absolute bottom-0 left-0 max-w-none"
        style={{ width: '170%', height: 'auto', transform: `translateX(-${position * 70 / 170}%)` }} />
      <span className="absolute left-4 top-4 bg-[#171c18]/80 px-3 py-2 text-xs tracking-widest text-[#f2f0e9]">{revealed ? '물체가 보이는 쪽' : '그림자가 보이는 쪽'}</span>
    </div>
    <div className="border-x border-b border-[#35463d]/20 bg-[#e7e4dc] p-5 sm:p-7">
      <label htmlFor={id} className="text-xs tracking-widest">시선 옮기기</label>
      <input id={id} type="range" min="0" max="100" step="1" value={position}
        aria-describedby={`${id}-help`} aria-valuetext={revealed ? '물체가 보이는 쪽' : '그림자에서 물체 쪽으로 살펴보는 중'}
        onChange={event => move(Number(event.target.value))}
        className="my-2 block h-11 w-full cursor-ew-resize accent-[#35463d] focus-visible:outline-2 focus-visible:outline-offset-4" />
      <div className="flex justify-between gap-3">
        <button type="button" className={buttonClass} disabled={position === 0} onClick={() => move(position - 25)}>← 그림자 쪽</button>
        <button type="button" className={buttonClass} disabled={position === 100} onClick={() => move(position + 25)}>물체 쪽 →</button>
      </div>
      <div className="mt-6 min-h-28" role="status" aria-live="polite" aria-atomic="true">
        <p className="font-serif text-xl leading-8">{revealed ? '그림자만 보고, 무엇을 알 수 있었을까요?' : '아직 보이지 않는 쪽에도, 무언가 있을까요?'}</p>
        <p className="mt-2 text-sm leading-7">{revealed ? '벽의 윤곽과 작은 토기를 함께 보게 되었어요. 처음의 인상과 지금의 인상은 어떻게 다른가요?' : '새로운 물체를 만들어내는 것이 아니라, 같은 그림의 다른 부분으로 시선을 옮기는 중이에요.'}</p>
      </div>
      <button type="button" className={`${buttonClass} mt-3`} disabled={position === 0} onClick={() => {
        setPosition(0)
        trackExplorer('explorer_looking_reset', 'plato')
      }}>처음 시선으로 돌아가기</button>
    </div>
    <p className="mt-4 text-xs leading-6 text-[#535d53]">그림의 일부를 확대해 살펴보는 입문용 장치입니다. 동굴의 공간이나 빛의 경로를 재현한 시뮬레이션은 아니에요.</p>
    <a href={visualPath('plato')} target="_blank" rel="noopener noreferrer" onClick={() => trackExplorer('explorer_artwork_opened', 'plato', { visual_id: 'plato' })}
      className="inline-flex min-h-11 items-center text-xs text-[#535d53] underline underline-offset-4">그림 전체 보기 · 새 탭 ↗</a>
  </div>
}
