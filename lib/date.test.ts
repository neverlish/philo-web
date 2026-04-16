import { describe, it, expect, vi, afterEach } from 'vitest'
import { getTodayKST, getRecentDaysKST } from './date'

describe('getTodayKST', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('YYYY-MM-DD 형식 문자열을 반환한다', () => {
    const result = getTodayKST()
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('UTC 00:00은 KST 09:00이므로 같은 날짜를 반환한다', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T00:00:00.000Z'))
    expect(getTodayKST()).toBe('2024-01-15')
  })

  it('UTC 14:59은 KST 23:59이므로 같은 날짜를 반환한다', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T14:59:59.000Z'))
    expect(getTodayKST()).toBe('2024-01-15')
  })

  it('UTC 15:00은 KST 다음날 00:00이므로 다음 날짜를 반환한다', () => {
    // UTC 2024-01-15 15:00 = KST 2024-01-16 00:00
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T15:00:00.000Z'))
    expect(getTodayKST()).toBe('2024-01-16')
  })
})

describe('getRecentDaysKST', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('n개의 날짜 배열을 반환한다', () => {
    const result = getRecentDaysKST(7)
    expect(result).toHaveLength(7)
  })

  it('모든 날짜가 YYYY-MM-DD 형식이다', () => {
    const result = getRecentDaysKST(3)
    result.forEach((date) => {
      expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    })
  })

  it('오래된 날짜부터 오름차순(오름차순)으로 반환한다', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T00:00:00.000Z'))
    const result = getRecentDaysKST(3)
    expect(result[0]).toBe('2024-01-13')
    expect(result[1]).toBe('2024-01-14')
    expect(result[2]).toBe('2024-01-15')
  })

  it('n=1이면 오늘 날짜 하나를 반환한다', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-03-10T00:00:00.000Z'))
    const result = getRecentDaysKST(1)
    expect(result).toHaveLength(1)
    expect(result[0]).toBe('2024-03-10')
  })

  it('마지막 날짜는 getTodayKST()와 일치한다', () => {
    const today = getTodayKST()
    const result = getRecentDaysKST(5)
    expect(result[result.length - 1]).toBe(today)
  })
})
