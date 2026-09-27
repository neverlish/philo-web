import { expect, it } from 'vitest'
import { AI_INTERPRETATION_LABEL, AI_INTERPRETATION_NOTICE, AI_INTERPRETATION_INSTRUCTION, formatPrescriptionShare } from './prescription-provenance'
import { SYSTEM_PROMPT } from '@/app/api/prescription/generate/prompt'

const input = { quote: '생각을 잠시 살펴보세요.', philosopherName: '철학자', philosopherSchool: '학파', url: 'https://example.com/share/test' }
it('makes AI provenance explicit in independently copied text', () => {
  const text = formatPrescriptionShare({ ...input, isGenerated: true })
  expect(text).toContain(AI_INTERPRETATION_LABEL)
  expect(text).toContain(AI_INTERPRETATION_NOTICE)
  expect(text).toContain('참고한 철학자: 철학자')
  expect(text).not.toContain('— 철학자')
  expect(text).not.toContain(`"${input.quote}"`)
  expect(text).toContain(input.url)
})
it('preserves the existing non-AI format without asserting verification', () => {
  expect(formatPrescriptionShare(input)).toBe(`"${input.quote}"\n— 철학자 (학파)\n\n${input.url}`)
})
it('preserves the notice even when sharing includes a concern', () => {
  expect(formatPrescriptionShare({ ...input, isGenerated: true, concern: '테스트 입력' })).toContain(AI_INTERPRETATION_NOTICE)
})
it('requires generated interpretation rather than fabricated quotations in the generation prompt', () => {
  expect(SYSTEM_PROMPT).toContain(AI_INTERPRETATION_INSTRUCTION)
  expect(SYSTEM_PROMPT).not.toContain('실제 저작에서 나온 문장을 우선')
})
