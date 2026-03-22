// tests/helpers/request.ts

/**
 * Next.js Route Handler용 Request 생성 유틸
 *
 * Usage:
 *   makeRequest('POST', '/api/foo', { body: JSON.stringify({ key: 'val' }) })
 */
export function makeRequest(
  method: string,
  url: string,
  options?: { body?: string; headers?: Record<string, string> }
): Request {
  return new Request(`http://localhost${url}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: options?.body,
  })
}
