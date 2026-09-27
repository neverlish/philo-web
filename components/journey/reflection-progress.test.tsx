import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, expect, it } from 'vitest'
import { ReflectionProgress } from './reflection-progress'

afterEach(cleanup)
it.each([[0, 0, '—'], [3, 0, '0%'], [3, 1, '33%'], [3, 3, '100%']] as const)(
  'represents %i commitments and %i reflections as %s', (total, reflected, expected) => {
    render(<ReflectionProgress total={total} reflected={reflected} />)
    expect(screen.getByText(expected)).toBeVisible()
    expect(screen.getByText('회고 작성률')).toBeVisible()
    expect(screen.queryByText('성장률')).not.toBeInTheDocument()
  },
)
