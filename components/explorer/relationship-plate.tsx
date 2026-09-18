import { Artwork } from './artwork'

export function RelationshipPlate() {
  return <section aria-labelledby="relationship-plate-title" className="bg-[#e5dac2] px-5 py-16 text-[#322819] sm:px-8">
    <div className="mx-auto max-w-5xl">
      <p className="text-xs tracking-widest text-[#715b3b]">철학자의 그림 수첩 · 관계를 읽는 법</p>
      <h2 id="relationship-plate-title" className="mb-8 mt-4 font-serif text-3xl leading-relaxed">함께 걸었던 사람들,<br />멀리서 만나는 질문들.</h2>
      <figure>
        <Artwork visual="academy" slug="map" alt="올리브나무 아래에서 대화를 나누며 걷는 노년의 플라톤과 젊은 아리스토텔레스를 그린 상상화" />
        <figcaption className="mt-3 text-xs leading-6 text-[#715b3b]">AI 생성 상상화 · 두 사람의 특정 대화나 실제 모습을 복원한 그림이 아닙니다.</figcaption>
      </figure>
      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <article>
          <h3 className="font-serif text-xl">01. 실제로 배운 사이</h3>
          <div className="my-6 flex items-center gap-3" aria-label="플라톤이 가르치고 아리스토텔레스가 배운 관계">
            <span className="font-serif">플라톤</span>
            <span aria-hidden="true" className="flex flex-1 items-center"><span className="h-px flex-1 bg-[#715b3b]" />→</span>
            <span className="font-serif">아리스토텔레스</span>
          </div>
          <p className="text-sm leading-8">실선은 가르친 사람에서 배운 사람으로 향해요. 아리스토텔레스는 플라톤의 아카데미아에서 공부했어요. 배웠다는 것이 모든 사상에 동의했다는 뜻은 아니에요.</p>
        </article>
        <article>
          <h3 className="font-serif text-xl">02. 질문으로 비교하는 사이</h3>
          <div className="my-6 flex items-center gap-3" aria-label="플라톤과 데카르트를 제작진이 입문용으로 비교하는 관계">
            <span className="font-serif">플라톤</span>
            <span aria-hidden="true" className="flex-1 border-t border-dashed border-[#715b3b]" />
            <span className="font-serif">데카르트</span>
          </div>
          <p className="text-sm leading-8">점선은 ‘안다는 것은 무엇일까?’라는 질문으로 묶은 제작진의 비교예요. 직접 만났거나 서로 가르쳤다는 뜻도, 직접적인 영향 관계를 표시한 것도 아니에요.</p>
        </article>
      </div>
      <p className="mt-8 border-t border-[#88704b]/40 pt-4 text-xs leading-6 text-[#715b3b]">이 도식은 세 철학자의 일부 관계만 보여줍니다. 선의 길이나 배치는 연대·거리·중요도를 나타내지 않습니다.</p>
    </div>
  </section>
}
