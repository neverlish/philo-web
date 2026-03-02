import { expect, beforeEach, vi } from 'vitest'
import * as matchers from '@testing-library/jest-dom/matchers'

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers)

// Mock Next.js headers
vi.mock('next/headers', () => ({
  headers: () => ({
    get: (name: string) => null,
  }),
  cookies: () => ({
    get: (name: string) => undefined,
    set: (name: string, value: any) => {},
  }),
}))
