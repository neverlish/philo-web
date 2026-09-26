import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, expect, it, vi } from 'vitest'
import { EverydayPhilosophy } from './everyday-philosophy'

const capture = vi.hoisted(() => vi.fn())
vi.mock('@/lib/posthog/home-practice-events', () => ({ trackHomePractice: capture }))
afterEach(() => { cleanup(); capture.mockClear() })

it('tracks actual scene changes once and distinguishes navigation from resume', () => {
  render(<EverydayPhilosophy />)
  fireEvent.click(screen.getByRole('button', { name: '친구에게 마음이 걸려요' }))
  expect(capture).not.toHaveBeenCalled()
  fireEvent.click(screen.getByRole('button', { name: '내 뜻대로 되지 않아요' }))
  fireEvent.click(screen.getByRole('button', { name: '내 뜻대로 되지 않아요' }))
  expect(capture).toHaveBeenCalledExactlyOnceWith('home_practice_scene_changed')
  fireEvent.click(screen.getByRole('link', { name: /이 장면에서 시작하기/ }))
  expect(capture).toHaveBeenLastCalledWith('home_practice_opened', 'control')
  fireEvent.click(screen.getByRole('link', { name: /생각 이어보기/ }))
  expect(capture).toHaveBeenLastCalledWith('home_reflection_resume_clicked')
})

it('switches the scene, question, image and destination together and can switch back', () => {
  render(<EverydayPhilosophy />)
  const firstImage = screen.getByRole('img').getAttribute('src')
  const control = screen.getByRole('button', { name: '내 뜻대로 되지 않아요' })
  fireEvent.click(control)
  expect(control).toHaveAttribute('aria-pressed', 'true')
  expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('내 뜻대로 되지 않는 날')
  expect(screen.getByRole('img').getAttribute('src')).not.toBe(firstImage)
  expect(screen.getByRole('link', { name: /이 장면에서 시작하기/ })).toHaveAttribute('href', '/practice/control')
  expect(screen.getByText(/작성 내용은 저장되지 않아요/)).toBeVisible()
  expect(screen.getByRole('link', { name: /생각 이어보기/ })).toHaveAttribute('href', '/practice/friendship')
  fireEvent.click(screen.getByRole('button', { name: '친구에게 마음이 걸려요' }))
  expect(control).toHaveAttribute('aria-pressed', 'false')
  expect(screen.getByRole('link', { name: /이 장면에서 시작하기/ })).toHaveAttribute('href', '/practice/friendship')
})

it('opens with an everyday question and links directly to the public exercise', () => {
  render(<EverydayPhilosophy />)
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('오늘 마음에남은 일이 있나요?')
  expect(screen.getByRole('link', { name: /이 장면에서 시작하기/ })).toHaveAttribute('href', '/practice/friendship')
  expect(screen.getByRole('link', { name: /내 뜻대로 되지 않는 날/ })).toHaveAttribute('href', '/practice/control')
})

it('makes continuation conditional without reading private browser records', () => {
  render(<EverydayPhilosophy />)
  expect(screen.getByRole('link', { name: /생각 이어보기/ })).toHaveAttribute('href', '/practice/friendship')
  expect(screen.getByText(/저장한 기록이 있을 때만/)).toBeVisible()
  expect(screen.getByText(/AI 생성 그림/)).toBeVisible()
})

it('renders its question, image and crawlable links on the server', () => {
  const html = renderToStaticMarkup(<EverydayPhilosophy />)
  expect(html).toContain('href="/practice/friendship"')
  expect(html).toContain('aristotle-scene-v2')
  expect(html).toContain('width="1536"')
  expect(html).toContain('height="1024"')
})
