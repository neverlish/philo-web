const rows = [
  ['출발 장면', '그림자를 보아온 동굴', '확실하다고 여긴 감각과 추론'],
  ['살펴보는 방식', '시선을 돌리고, 밖으로 나아가는 교육의 비유', '의심 가능한 것을 검토하는 방법적 회의'],
  ['이번 체험이 닿는 곳', '교육과 귀환, 공동체의 문제', '생각하는 자신의 존재를 출발점으로 삼기'],
] as const

export function ComparisonSheet() {
  return <section aria-labelledby="comparison-sheet-title" className="bg-[#e7e9e2] px-5 py-14 text-[#29372f] sm:px-8">
    <div className="mx-auto max-w-5xl">
      <p className="text-xs tracking-widest text-[#715b3b]">나란히 펼쳐 읽기</p>
      <h2 id="comparison-sheet-title" className="my-4 font-serif text-3xl leading-relaxed">같은 질문, 서로 다른 길.</h2>
      <p className="mb-8 text-sm leading-7">‘안다는 것은 무엇일까?’로 두 체험을 묶어볼 수 있지만, 같은 방법의 다른 이름은 아니에요.</p>
      <table className="w-full table-fixed border-collapse text-left text-sm leading-7">
        <caption className="sr-only">플라톤의 동굴 비유와 데카르트의 방법적 회의: 이번 체험의 범위 비교</caption>
        <thead><tr className="border-y border-[#88704b]/50">
          <th scope="col" className="w-1/4 py-4 pr-3 font-normal">비교 지점</th>
          <th scope="col" className="px-2 py-4 font-serif text-base font-normal">플라톤</th>
          <th scope="col" className="px-2 py-4 font-serif text-base font-normal">데카르트</th>
        </tr></thead>
        <tbody>{rows.map(([label, plato, descartes]) => <tr key={label} className="border-b border-[#88704b]/30">
          <th scope="row" className="py-5 pr-3 align-top font-normal text-[#715b3b]">{label}</th>
          <td className="px-2 py-5 align-top">{plato}</td><td className="px-2 py-5 align-top">{descartes}</td>
        </tr>)}</tbody>
      </table>
      <p className="mt-4 text-xs leading-6 text-[#715b3b]">입문을 위한 제작진의 요약입니다. 두 사상 전체의 비교나 직접 영향 관계를 뜻하지 않습니다.</p>
    </div>
  </section>
}
