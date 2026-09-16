import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { PhilosopherExperienceLink } from './philosopher-experience-link'

const { track } = vi.hoisted(() => ({ track: vi.fn() }))
vi.mock('@/lib/posthog/explorer-events', () => ({ trackExplorer: track }))
afterEach(() => { cleanup(); vi.clearAllMocks() })

describe('philosopher experience invitation', () => {
  it.each(['plato', 'aristotle', 'descartes'])('links %s to its own experience and captures only the public source', slug => {
    render(<PhilosopherExperienceLink slug={slug} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', `/explore/${slug}`)
    // Keep the test local while preserving the actual click handler.
    link.addEventListener('click', event => event.preventDefault())
    fireEvent.click(link)
    expect(track).toHaveBeenCalledExactlyOnceWith('explorer_entry_clicked', slug, { source: 'philosopher', philosopher: slug })
    expect(renderToStaticMarkup(<PhilosopherExperienceLink slug={slug} />)).toContain(`href="/explore/${slug}"`)
  })
  it.each(['kant', 'map', '__proto__', 'constructor'])('does not invent an experience for %s', slug => {
    const { container } = render(<PhilosopherExperienceLink slug={slug} />)
    expect(container).toBeEmptyDOMElement()
    expect(track).not.toHaveBeenCalled()
  })
})
