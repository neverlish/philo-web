import { vi } from 'vitest'

// Mock Supabase client
export const createClient = vi.fn(() => ({
  from: vi.fn(() => mockSupabaseQuery),
  auth: {
    getSession: vi.fn(),
    getUser: vi.fn(),
  },
}))

// Mock query builder
interface MockQueryBuilder {
  select: (columns?: string) => MockQueryBuilder
  insert: (data: any) => MockQueryBuilder
  update: (data: any) => MockQueryBuilder
  delete: () => MockQueryBuilder
  eq: (column: string, value: any) => MockQueryBuilder
  neq: (column: string, value: any) => MockQueryBuilder
  gt: (column: string, value: any) => MockQueryBuilder
  gte: (column: string, value: any) => MockQueryBuilder
  lt: (column: string, value: any) => MockQueryBuilder
  lte: (column: string, value: any) => MockQueryBuilder
  like: (column: string, pattern: string) => MockQueryBuilder
  ilike: (column: string, pattern: string) => MockQueryBuilder
  or: (filter: string) => MockQueryBuilder
  and: (filter: string) => MockQueryBuilder
  in: (column: string, values: any[]) => MockQueryBuilder
  contains: (column: string, value: any) => MockQueryBuilder
  order: (column: string, options?: { ascending: boolean }) => MockQueryBuilder
  limit: (count: number) => MockQueryBuilder
  single: () => Promise<any>
  range: (from: number, to: number) => MockQueryBuilder
}

// Mock data store
let mockData: Record<string, any[]> = {
  philosophers: [],
  quotes: [],
  concerns: [],
  users: [],
  user_saved_quotes: [],
  user_saved_philosophers: [],
  user_read_quotes: [],
}

// Reset mock data
export function resetMockData() {
  mockData = {
    philosophers: [],
    quotes: [],
    concerns: [],
    users: [],
    user_saved_quotes: [],
    user_saved_philosophers: [],
    user_read_quotes: [],
  }
}

// Set mock data
export function setMockData(table: string, data: any[]) {
  if (table in mockData) {
    mockData[table] = data
  }
}

// Create mock query builder
function createMockQueryBuilder(table: string): MockQueryBuilder {
  let data: any[] = []
  let filters: Record<string, any> = {}
  let orderBy: { column: string; ascending: boolean } | null = null
  let limitCount: number | null = null
  let selectColumns: string | null = null

  const executeQuery = () => {
    data = [...(mockData[table as keyof typeof mockData] || [])]

    // Apply filters
    Object.entries(filters).forEach(([column, value]) => {
      if (typeof value === 'object' && value.ilike) {
        const pattern = value.ilike.replace(/%/g, '.*')
        const regex = new RegExp(pattern, 'i')
        data = data.filter((row) => regex.test(row[column]))
      } else if (column === 'or') {
        // Handle OR filters
        const conditions = value.split(', ')
        data = data.filter((row) => {
          return conditions.some((condition: string) => {
            const match = condition.match(/(\w+)\.ilike\.(.+)/)
            if (match) {
              const [, col, pattern] = match
              const regex = new RegExp(pattern.replace(/%/g, '.*'), 'i')
              return regex.test(row[col])
            }
            return false
          })
        })
      } else {
        data = data.filter((row) => row[column] === value)
      }
    })

    // Apply sorting
    if (orderBy) {
      const order = orderBy
      data.sort((a, b) => {
        const aVal = a[order.column]
        const bVal = b[order.column]
        if (aVal < bVal) return order.ascending ? -1 : 1
        if (aVal > bVal) return order.ascending ? 1 : -1
        return 0
      })
    }

    // Apply limit
    if (limitCount) {
      data = data.slice(0, limitCount)
    }

    // Handle joins with select
    if (selectColumns && selectColumns.includes('*')) {
      // Simulate join if philosophers is requested
      data = data.map((row) => {
        if (row.philosopher_id && table === 'quotes') {
          const philosopher = mockData.philosophers.find((p: any) => p.id === row.philosopher_id)
          return { ...row, philosophers: philosopher }
        }
        return row
      })
    }

    return data
  }

  return {
    select: (columns?: string) => {
      selectColumns = columns || null
      return createMockQueryBuilder(table)
    },
    insert: (newData: any) => {
      const item = Array.isArray(newData) ? newData : [newData]
      ;(mockData[table] ??= []).push(...item)
      return createMockQueryBuilder(table)
    },
    update: (updates: any) => {
      data = data.map((row) => ({ ...row, ...updates }))
      return createMockQueryBuilder(table)
    },
    delete: () => createMockQueryBuilder(table),
    eq: (column: string, value: any) => {
      filters[column] = value
      return createMockQueryBuilder(table)
    },
    neq: (column: string, value: any) => createMockQueryBuilder(table),
    gt: (column: string, value: any) => createMockQueryBuilder(table),
    gte: (column: string, value: any) => createMockQueryBuilder(table),
    lt: (column: string, value: any) => createMockQueryBuilder(table),
    lte: (column: string, value: any) => createMockQueryBuilder(table),
    like: (column: string, pattern: string) => createMockQueryBuilder(table),
    ilike: (column: string, pattern: string) => createMockQueryBuilder(table),
    or: (filter: string) => {
      filters['or'] = filter
      return createMockQueryBuilder(table)
    },
    and: (filter: string) => createMockQueryBuilder(table),
    in: (column: string, values: any[]) => createMockQueryBuilder(table),
    contains: (column: string, value: any) => createMockQueryBuilder(table),
    order: (column: string, options?: { ascending: boolean }) => {
      orderBy = { column, ascending: options?.ascending ?? true }
      return createMockQueryBuilder(table)
    },
    limit: (count: number) => {
      limitCount = count
      return createMockQueryBuilder(table)
    },
    single: async () => {
      const results = executeQuery()
      return { data: results[0] || null, error: null }
    },
    range: (from: number, to: number) => createMockQueryBuilder(table),
    then: async (resolve: any) => {
      const results = executeQuery()
      resolve({ data: results, error: null })
    },
  } as any
}

const mockSupabaseQuery = createMockQueryBuilder('')

export { mockData }
