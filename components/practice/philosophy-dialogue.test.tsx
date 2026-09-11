import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { PhilosophyDialogue } from './philosophy-dialogue'

afterEach(() => { cleanup(); vi.unstubAllGlobals() })

function start() {
  render(<PhilosophyDialogue concern="최초 고민" context="이전 해설" />)
  fireEvent.click(screen.getByRole('button', { name: 'AI와 이어서 생각하기' }))
}

describe('PhilosophyDialogue', () => {
  it('offers a goal and optional experiment without sending or overwriting a draft', () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    render(<PhilosophyDialogue concern="인정받고 싶어요" context="" entry />)
    fireEvent.click(screen.getByRole('radio', { name: '다른 관점을 만나고 싶어요' }))
    fireEvent.click(screen.getByRole('button', { name: '이 방향으로 이야기하기' }))
    expect(screen.getByLabelText('대화 내용')).toHaveTextContent('다른 각도로')
    fireEvent.click(screen.getByRole('button', { name: '짧은 사고실험을 해볼까요?' }))
    fireEvent.click(screen.getByRole('button', { name: '아직 모르겠어요' }))
    expect((screen.getByLabelText('내 생각 이어서 적기') as HTMLTextAreaElement).value).toContain('아직 모르겠어요')
    expect(fetchMock).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: '그래도 원해요' })).toBeDisabled()
    expect(screen.getByRole('button', { name: '조금 달라요' })).toBeDisabled()
  })

  it('lets the user rewrite and compare their own words without AI', () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    start()
    fireEvent.click(screen.getByText('내 문장을 다르게 써보기'))
    fireEvent.change(screen.getByLabelText('지금의 나는 이렇게 표현하고 싶어요'), { target: { value: '나만의 시간을 원해요' } })
    fireEvent.click(screen.getByRole('button', { name: '고친 문장을 입력창에 담기' }))
    expect(screen.getByLabelText('내 생각 이어서 적기').getAttribute('maxlength')).toBe('1000')
    expect(fetchMock).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: '여기서 마치고 내 문장 남기기' }))
    fireEvent.change(screen.getByLabelText('오늘 내가 발견한 것은…'), { target: { value: '안정이 필요해요' } })
    fireEvent.click(screen.getByRole('button', { name: '처음 생각과 나란히 보기' }))
    expect(screen.getByLabelText('내 생각의 두 문장')).toHaveTextContent('최초 고민')
    expect(screen.getByLabelText('내 생각의 두 문장')).toHaveTextContent('안정이 필요해요')
    fireEvent.change(screen.getByLabelText('오늘 내가 발견한 것은…'), { target: { value: '수정한 생각' } })
    expect(screen.queryByLabelText('내 생각의 두 문장')).not.toBeInTheDocument()
  })
  it('waits for input, carries prior messages, and leaves the reflection local', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({ reply: '안정감은 어떤 모습인가요?' }) })
    vi.stubGlobal('fetch', fetchMock)
    start()
    expect(fetchMock).not.toHaveBeenCalled()
    fireEvent.change(screen.getByLabelText('내 생각 이어서 적기'), { target: { value: '경쟁보다 안정이 필요해요' } })
    fireEvent.click(screen.getByRole('button', { name: '보내기' }))
    await waitFor(() => expect(screen.getByLabelText('대화 내용')).toHaveTextContent('안정감은 어떤 모습인가요?'))
    fireEvent.change(screen.getByLabelText('내 생각 이어서 적기'), { target: { value: '내 시간을 지키는 것' } })
    fireEvent.click(screen.getByRole('button', { name: '보내기' }))
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2))
    const payload = JSON.parse(fetchMock.mock.calls[1][1].body)
    expect(payload.messages).toHaveLength(4)
    expect(payload.messages[1].content).toBe('경쟁보다 안정이 필요해요')
    await waitFor(() => expect(screen.getByRole('button', { name: '보내기' })).toBeDisabled())
    fireEvent.click(screen.getByRole('button', { name: '여기서 마치고 내 문장 남기기' }))
    fireEvent.change(screen.getByLabelText('오늘 내가 발견한 것은…'), { target: { value: '나만의 메모' } })
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('keeps the draft on rate limit and retries without duplicating history', async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce({ ok: false, status: 429 }).mockResolvedValueOnce({ ok: true, json: async () => ({ reply: '다시 생각해볼까요?' }) })
    vi.stubGlobal('fetch', fetchMock)
    start()
    fireEvent.change(screen.getByLabelText('내 생각 이어서 적기'), { target: { value: '내 상황은 달라요' } })
    fireEvent.click(screen.getByRole('button', { name: '보내기' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('10분')
    expect(screen.getByLabelText('내 생각 이어서 적기')).toHaveValue('내 상황은 달라요')
    fireEvent.click(screen.getByRole('button', { name: '보내기' }))
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2))
    expect(JSON.parse(fetchMock.mock.calls[1][1].body).messages).toHaveLength(2)
  })

  it('summarizes on request and leaves the reader scroll position alone', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ reply: '내일 우선순위를 한 가지 정해보세요.' }) })
    vi.stubGlobal('fetch', fetchMock)
    start()
    const region = screen.getByLabelText('대화 내용')
    Object.defineProperties(region, { scrollHeight: { value: 1200 }, clientHeight: { value: 200 } })
    region.scrollTop = 0
    fireEvent.scroll(region)
    fireEvent.change(screen.getByLabelText('내 생각 이어서 적기'), { target: { value: '우선순위를 정하고 싶어요' } })
    fireEvent.click(screen.getByRole('button', { name: '보내기' }))
    await waitFor(() => expect(screen.getByRole('button', { name: '오늘 할 일로 정리해줘' })).toBeEnabled())
    expect(region.scrollTop).toBe(0)
    fireEvent.click(screen.getByRole('button', { name: '오늘 할 일로 정리해줘' }))
    await screen.findByLabelText('오늘 내가 발견한 것은…')
    expect(JSON.parse(fetchMock.mock.calls[1][1].body).intent).toBe('summarize')
    expect(screen.queryByLabelText('내 생각 이어서 적기')).not.toBeInTheDocument()
  })

  it('aborts on finish and ignores a late response', async () => {
    let resolve!: (value: unknown) => void
    const fetchMock = vi.fn(() => new Promise(r => { resolve = r }))
    vi.stubGlobal('fetch', fetchMock)
    start()
    fireEvent.change(screen.getByLabelText('내 생각 이어서 적기'), { target: { value: '나의 생각' } })
    fireEvent.click(screen.getByRole('button', { name: '보내기' }))
    fireEvent.click(screen.getByRole('button', { name: '응답 중단하고 내 문장으로 마치기' }))
    expect((fetchMock.mock.calls as unknown[][])[0][1]).toMatchObject({ signal: expect.objectContaining({ aborted: true }) })
    resolve({ ok: true, json: async () => ({ reply: '늦은 답변' }) })
    await waitFor(() => expect(screen.getByLabelText('오늘 내가 발견한 것은…')).toBeInTheDocument())
    expect(screen.queryByText('늦은 답변')).not.toBeInTheDocument()
  })
})
