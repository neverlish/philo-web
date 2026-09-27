// Provenance follows the generating route, never a model's claim of authenticity.
export const AI_INTERPRETATION_LABEL = 'AI 해설 · 실제 인용 미확인'
export const AI_INTERPRETATION_NOTICE = 'AI가 구성한 해설입니다. 철학자의 실제 발언이나 정확한 사상 해석으로 검증되지 않았습니다.'
export const AI_INTERPRETATION_INSTRUCTION = 'quote.text는 철학자의 사상을 참고하여 AI가 새로 구성한 짧은 해설로 작성하세요. 실제 발언이나 직접 인용처럼 쓰지 말고, 따옴표·저자 서명·검증하지 않은 책명이나 쪽수를 붙이지 마세요. meaning과 application도 AI의 해석과 제안이며 철학자가 사용자에게 직접 한 말로 표현하지 마세요.'

export function formatPrescriptionShare({ quote, philosopherName, philosopherSchool, url, isGenerated = false, concern }: {
  quote: string; philosopherName: string; philosopherSchool: string; url: string;
  isGenerated?: boolean; concern?: string | null;
}) {
  const introduction = concern ? `"${concern}"\n\n` : ''
  const body = isGenerated
    ? `${AI_INTERPRETATION_LABEL}\n${quote}\n참고한 철학자: ${philosopherName} (${philosopherSchool})\n${AI_INTERPRETATION_NOTICE}`
    : `"${quote}"\n— ${philosopherName} (${philosopherSchool})`
  return `${introduction}${body}\n\n${url}`
}
