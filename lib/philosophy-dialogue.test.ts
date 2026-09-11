import { describe, expect, it } from 'vitest'
import { buildDialogueSystem, parseDialogue } from './philosophy-dialogue'

const base = { concern: '고민', context: '', goal: 'clarify', intent: 'explore', messages: [
  { role: 'assistant', content: '무엇이 중요한가요?' }, { role: 'user', content: '잘 모르겠어요' },
  { role: 'assistant', content: '지금은 어떠세요?' }, { role: 'user', content: '아직 모르겠어요' },
] }
describe('Turn-specific dialogue guidance', () => {
  it('pauses questions after two assistant questions, not user punctuation', () => {
    expect(buildDialogueSystem(parseDialogue(base)!)).toContain('이번 응답에서는 질문하지 마세요')
    const messages = [...base.messages]
    messages[2] = { role: 'assistant', content: '아직 정리되지 않아도 괜찮아요.' }
    messages[3] = { role: 'user', content: '그런가요?' }
    expect(buildDialogueSystem(parseDialogue({ ...base, messages })!)).toContain('필요한 경우에만 질문 하나')
  })
  it('gives ending priority over the normal conversation cadence', () => {
    expect(buildDialogueSystem(parseDialogue({ ...base, intent: 'summarize' })!)).toContain('이번 응답은 질문 없이 짧게 마칩니다')
  })
})
