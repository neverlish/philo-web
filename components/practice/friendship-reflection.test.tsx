import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { FriendshipReflection } from './friendship-reflection'
import { REFLECTION_KEY } from '@/lib/friendship-reflection'

const { capture } = vi.hoisted(() => ({ capture: vi.fn() }))
vi.mock('@/lib/posthog/explorer-events', () => ({ trackExplorer: capture }))
const click = (name: string) => fireEvent.click(screen.getByRole('button', { name }))
function complete(write = false) {
  click('내 생각 살펴보기')
  if (write) fireEvent.change(screen.getByLabelText('첫 생각 · 선택 입력'), { target: { value: 'PRIVATE FIRST' } })
  click('다른 사정 살펴보기'); click('내 첫 생각과 비교하기')
  if (write) fireEvent.change(screen.getByLabelText('지금의 생각 · 선택 입력'), { target: { value: 'PRIVATE AFTER' } })
  click('생활로 가져가기')
}
beforeEach(() => {
  const data = new Map<string, string>()
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => { data.set(key, value) },
    removeItem: (key: string) => { data.delete(key) },
  })
})
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); capture.mockClear() })

it('works without input or persistent storage and counts milestones only once', () => {
  const write = vi.spyOn(localStorage, 'setItem')
  render(<FriendshipReflection />); complete()
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('오늘은 작은 실험 하나만')
  expect(write).not.toHaveBeenCalled()
  click('이전으로'); click('이전으로'); click('내 첫 생각과 비교하기')
  expect(capture.mock.calls.filter(([event]) => event === 'explorer_reflection_compared')).toHaveLength(1)
})

it('saves explicitly, resumes after remount, reviews and deletes only its own record', () => {
  const { unmount } = render(<FriendshipReflection />); complete(true)
  expect(screen.getByText('PRIVATE FIRST').closest('.ph-no-capture.ph-mask')).not.toBeNull()
  expect(localStorage.getItem(REFLECTION_KEY)).toBeNull()
  click('이 기기에 저장하기'); unmount(); render(<FriendshipReflection />)
  expect(screen.queryByText('PRIVATE FIRST')).not.toBeInTheDocument()
  click('기록 이어보기')
  expect(screen.getByText('PRIVATE FIRST')).toBeVisible()
  expect(screen.getByText('PRIVATE AFTER')).toBeVisible()
  click('아직 못 했어요')
  fireEvent.change(screen.getByLabelText('돌아본 메모 · 선택 입력'), { target: { value: 'PRIVATE REVIEW' } })
  expect(JSON.parse(localStorage.getItem(REFLECTION_KEY)!).review).toBe('')
  click('이 기기에 저장하기')
  expect(JSON.parse(localStorage.getItem(REFLECTION_KEY)!).review).toBe('PRIVATE REVIEW')
  expect(JSON.stringify(capture.mock.calls)).not.toContain('PRIVATE')
  expect(capture).toHaveBeenCalledWith('explorer_reflection_resumed', 'aristotle')
  localStorage.setItem('unrelated-test', 'keep')
  click('이 기기의 저장 기록 삭제'); click('삭제 확인')
  expect(localStorage.getItem(REFLECTION_KEY)).toBeNull()
  expect(localStorage.getItem('unrelated-test')).toBe('keep')
  expect(screen.getByText('PRIVATE FIRST')).toBeVisible()
})

it('handles absent and invalid records without deleting them', () => {
  render(<FriendshipReflection />); click('기록 이어보기')
  expect(screen.getByRole('status')).toHaveTextContent('저장한 기록이 없어요')
  localStorage.setItem(REFLECTION_KEY, 'invalid'); click('기록 이어보기')
  expect(screen.getByRole('alert')).toHaveTextContent('읽을 수 없어요')
  expect(localStorage.getItem(REFLECTION_KEY)).toBe('invalid')
})

it('keeps writing available when storage reading or saving fails', () => {
  vi.spyOn(localStorage, 'getItem').mockImplementation(() => { throw new Error('blocked') })
  render(<FriendshipReflection />); click('기록 이어보기')
  expect(screen.getByRole('alert')).toHaveTextContent('읽을 수 없어요')
  complete(true)
  vi.spyOn(localStorage, 'setItem').mockImplementation(() => { throw new Error('full') })
  click('이 기기에 저장하기')
  expect(screen.getByRole('alert')).toHaveTextContent('저장하지 못했어요')
  expect(screen.getByText('PRIVATE FIRST')).toBeVisible()
  expect(capture).not.toHaveBeenCalledWith('explorer_reflection_saved', 'aristotle')
})

it('reports deletion failure without claiming success', () => {
  render(<FriendshipReflection />)
  vi.spyOn(localStorage, 'removeItem').mockImplementation(() => { throw new Error('blocked') })
  click('이 기기의 저장 기록 삭제'); click('삭제 확인')
  expect(screen.getByRole('alert')).toHaveTextContent('삭제하지 못했어요')
  expect(capture).not.toHaveBeenCalledWith('explorer_reflection_deleted', 'aristotle')
})
