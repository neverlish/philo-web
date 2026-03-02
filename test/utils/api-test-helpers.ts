import { NextRequest } from 'next/server'

/**
 * Create a mock NextRequest with search params
 */
export function createMockRequest(url: string, init?: RequestInit): NextRequest {
  const urlObj = new URL(url, 'http://localhost:3000')
  return new NextRequest(urlObj, init)
}

/**
 * Create a mock URL with search params
 */
export function createMockUrl(
  baseUrl: string,
  params?: Record<string, string | string[] | undefined>
): string {
  const url = new URL(baseUrl, 'http://localhost:3000')
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach((v) => url.searchParams.append(key, v))
        } else {
          url.searchParams.set(key, value)
        }
      }
    })
  }
  return url.toString()
}

/**
 * Extract response data
 */
export async function getResponseData<T>(response: Response): Promise<T> {
  const data = await response.json()
  return data as T
}
