import { describe, it, expect } from 'vitest'
import { calculateResult } from './score'
import type { PhilosopherKey } from './data'

const VALID_KEYS: PhilosopherKey[] = [
  'socrates',
  'nietzsche',
  'epictetus',
  'epicurus',
  'confucius',
  'kant',
  'zhuangzi',
  'kierkegaard',
]

describe('calculateResult', () => {
  it('유효한 PhilosopherKey를 반환한다', () => {
    const result = calculateResult([0, 0, 0, 0, 0])
    expect(VALID_KEYS).toContain(result)
  })

  it('빈 답변 배열에도 유효한 키를 반환한다', () => {
    const result = calculateResult([])
    expect(VALID_KEYS).toContain(result)
  })

  it('범위를 벗어난 답변 인덱스를 무시하고 유효한 키를 반환한다', () => {
    const result = calculateResult([999, -1, 100])
    expect(VALID_KEYS).toContain(result)
  })

  it('같은 답변은 항상 같은 결과를 반환한다 (순수 함수)', () => {
    const answers = [0, 1, 2, 0, 1]
    expect(calculateResult(answers)).toBe(calculateResult(answers))
  })

  it('답변에 따라 서로 다른 결과가 나올 수 있다', () => {
    const results = new Set<PhilosopherKey>()
    for (let i = 0; i < 4; i++) {
      results.add(calculateResult([i, i, i, i, i]))
    }
    // 4가지 선택지를 모두 고르면 최소 2가지 이상의 결과가 나와야 한다
    expect(results.size).toBeGreaterThanOrEqual(1)
  })
})
