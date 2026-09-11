import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ControlPractice } from './control-practice'

afterEach(() => { cleanup(); vi.restoreAllMocks() })

describe('ControlPractice', () => {
  it('requires nonblank answers and shows the chosen action without network or storage writes', () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    const localSpy = vi.spyOn(Storage.prototype, 'setItem')
    render(<ControlPractice />)
    const submit = screen.getByRole('button', { name: '오늘의 한 걸음 정하기' })
    expect(submit).toBeDisabled()
    screen.getAllByRole('textbox').forEach((input, index) => fireEvent.change(input, { target: { value: index === 3 ? '질문 연습하기' : '메모' } }))
    fireEvent.click(submit)
    expect(screen.getByRole('status')).toHaveTextContent('질문 연습하기')
    expect(fetchSpy).not.toHaveBeenCalled()
    expect(localSpy).not.toHaveBeenCalled()
    fireEvent.change(screen.getByLabelText('오늘 할 작은 행동 하나'), { target: { value: '   ' } })
    expect(submit).toBeDisabled()
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
  })

  it('confirms deletion and starts empty on a new visit', () => {
    const { unmount } = render(<ControlPractice />)
    fireEvent.change(screen.getByLabelText('지금 마음에 걸리는 일'), { target: { value: '개인 메모' } })
    fireEvent.click(screen.getByRole('button', { name: '모두 지우기' }))
    fireEvent.click(screen.getByRole('button', { name: '취소' }))
    expect(screen.getByLabelText('지금 마음에 걸리는 일')).toHaveValue('개인 메모')
    fireEvent.click(screen.getByRole('button', { name: '모두 지우기' }))
    fireEvent.click(screen.getByRole('button', { name: '네, 지울게요' }))
    expect(screen.getByLabelText('지금 마음에 걸리는 일')).toHaveValue('')
    fireEvent.change(screen.getByLabelText('지금 마음에 걸리는 일'), { target: { value: '새 메모' } })
    unmount()
    render(<ControlPractice />)
    expect(screen.getByLabelText('지금 마음에 걸리는 일')).toHaveValue('')
    expect(screen.getByRole('region', { name: '나의 통제 구분 연습' })).toHaveClass('ph-no-capture')
  })
})
