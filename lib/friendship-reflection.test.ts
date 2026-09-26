import { expect, it } from 'vitest'
import { parseReflection } from './friendship-reflection'

const now = Date.now()
const record = { version: 1, savedAt: now, before: '처음', after: '나중', experiment: 0, review: '' }
it('accepts a bounded record and strips unknown fields', () => {
  expect(parseReflection(JSON.stringify({ ...record, extra: 'ignored' }), now)).toEqual(record)
})
it.each([
  'broken', 'null', '{}', JSON.stringify({ ...record, savedAt: now + 1 }),
  JSON.stringify({ ...record, savedAt: now - 31 * 86400000 }),
  JSON.stringify({ ...record, before: 'a'.repeat(601) }),
  JSON.stringify({ ...record, review: null }),
  JSON.stringify({ ...record, experiment: 3 }),
  JSON.stringify({ ...record, experiment: -1 }),
  JSON.stringify({ ...record, version: 2 }),
])('rejects malformed, expired or unsupported records: %s', raw => {
  expect(parseReflection(raw, now)).toBeNull()
})
