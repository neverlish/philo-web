import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import { Artwork } from './artwork'

const { capture } = vi.hoisted(() => ({ capture: vi.fn() }))
vi.mock('@/lib/posthog/explorer-events', () => ({ trackExplorer: capture }))
afterEach(() => { cleanup(); vi.clearAllMocks() })
it('opens the static image and records only the public image ID and current page', () => {
  render(<Artwork visual="academy" slug="map" alt="배움의 장면" />)
  const link = screen.getByRole('link')
  expect(link).toHaveAttribute('href', '/explorer/academy-scene-v1.webp')
  expect(link).toHaveAttribute('target', '_blank')
  link.addEventListener('click', event => event.preventDefault())
  fireEvent.click(link)
  expect(capture).toHaveBeenCalledExactlyOnceWith('explorer_artwork_opened', 'map', { visual_id: 'academy' })
})
