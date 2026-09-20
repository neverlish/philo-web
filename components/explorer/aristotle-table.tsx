'use client'

import Image from 'next/image'
import { useId, useRef, useState } from 'react'
import { visualPath } from '@/lib/explorer/visual-assets'
import { trackExplorer } from '@/lib/posthog/explorer-events'

const situations = [
  { label: '처음 늦은 날', note: '친구는 처음 늦었고, 미리 연락했어요.', question: '이미 사정을 들었다면, 이 말에는 무엇을 더 담고 싶나요?', detail: '기다린 마음을 전하는 것과 친구의 사정을 고려하는 일을 함께 생각해보세요.' },
  { label: '다시 늦은 날', note: '시간을 지켜달라고 부탁했지만, 같은 일이 반복됐어요.', question: '같은 부탁을 되풀이할 때, 무엇을 더 분명히 해야 할까요?', detail: '이번 한 번의 사정뿐 아니라 반복되는 기다림과 약속의 의미도 살펴볼 수 있어요.' },
  { label: '시간을 다르게 알았던 날', note: '나는 2시, 친구는 2시 반이 약속인 줄 알았어요.', question: '부탁하기 전에, 서로 무엇을 약속했는지 확인해야 할까요?', detail: '책임을 묻는 말에 앞서 두 사람이 알고 있던 사실을 맞춰볼 수 있어요.' },
] as const

export function AristotleTable() {
  const id = useId()
  const [current, setCurrent] = useState(0)
  const seen = useRef(new Set([0]))
  const compared = useRef(false)
  const situation = situations[current]
  function change(index: number) {
    if (index === current) return
    setCurrent(index)
    seen.current.add(index)
    trackExplorer('explorer_table_context_changed', 'aristotle', { scene_index: index })
    if (seen.current.size === situations.length && !compared.current) {
      compared.current = true
      trackExplorer('explorer_table_contexts_explored', 'aristotle')
    }
  }
  return <div className="ph-no-capture">
    <p className="mb-4 text-sm leading-7">말은 그대로 둘게요. 아래에서 그날의 사정을 바꿔보세요.</p>
    <div className="relative overflow-hidden border border-[#35463d]/20 bg-[#171c18]">
      <Image src={visualPath('aristotle')} alt="탁자 위에서 마주한 두 사람의 손. 아직 대답을 기다리는 순간" width={1536} height={1024} sizes="(max-width: 1064px) 100vw, 1024px" className="h-auto w-full" />
      <div className="border-t border-white/10 px-5 py-6 text-[#f2f0e9] sm:px-8">
        <p className="text-xs tracking-widest text-[#c3c9bd]">바뀌지 않는 한마디 · 제작진의 예시</p>
        <p className="mt-3 font-serif text-2xl leading-relaxed sm:text-3xl">“다음엔 시간을 지켜줘.”</p>
      </div>
    </div>
    <fieldset className="mt-6">
      <legend className="mb-3 text-xs tracking-widest">어떤 사정이 있었을까요?</legend>
      <div className="flex flex-wrap gap-2">
        {situations.map((item, index) => <button key={item.label} type="button" aria-pressed={current === index} aria-controls={`${id}-context`}
          onClick={() => change(index)}
          className={`min-h-11 border px-4 py-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#35463d] ${current === index ? 'border-[#35463d] bg-[#35463d] text-[#f2f0e9]' : 'border-[#35463d]/30 text-[#35463d]'}`}>
          {item.label}
        </button>)}
      </div>
    </fieldset>
    <div id={`${id}-context`} role="status" aria-live="polite" aria-atomic="true" className="mt-6 min-h-52 border-l-2 border-[#9b9377] pl-5">
      <p className="text-sm leading-7">{situation.note}</p>
      <p className="mt-4 font-serif text-xl leading-8">{situation.question}</p>
      <p className="mt-3 text-sm leading-7 text-[#535d53]">{situation.detail}</p>
    </div>
    <p className="mt-4 text-xs leading-6 text-[#535d53]">그림과 말은 그대로여도 살펴볼 이유는 달라져요. 세 상황은 중용을 생각하기 위한 예시이며, 정답이나 사람의 성향을 판정하지 않습니다.</p>
    <a href={visualPath('aristotle')} target="_blank" rel="noopener noreferrer" onClick={() => trackExplorer('explorer_artwork_opened', 'aristotle', { visual_id: 'aristotle' })}
      className="inline-flex min-h-11 items-center text-xs text-[#535d53] underline underline-offset-4">그림 전체 보기 · 새 탭 ↗</a>
  </div>
}
