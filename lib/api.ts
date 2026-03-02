// API client functions
export async function fetchPhilosophers() {
  const response = await fetch('/api/philosophers')
  if (!response.ok) {
    throw new Error('Failed to fetch philosophers')
  }
  const data = await response.json()
  return data.philosophers
}

export async function fetchQuotes(params?: {
  category?: string
  concern?: string
  philosopher_id?: string
  today?: boolean
}) {
  const url = new URL('/api/quotes', window.location.origin)
  if (params?.category) url.searchParams.set('category', params.category)
  if (params?.concern) url.searchParams.set('concern', params.concern)
  if (params?.philosopher_id) url.searchParams.set('philosopher_id', params.phosopher_id)
  if (params?.today) url.searchParams.set('today', 'true')

  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new Error('Failed to fetch quotes')
  }
  const data = await response.json()
  return data.quotes
}

export async function fetchConcerns(params?: { category?: string }) {
  const url = new URL('/api/concerns', window.location.origin)
  if (params?.category) url.searchParams.set('category', params.category)

  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new Error('Failed to fetch concerns')
  }
  const data = await response.json()
  return data.concerns
}

export async function createConcern(text: string, category: string) {
  const response = await fetch('/api/concerns', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text, category }),
  })

  if (!response.ok) {
    throw new Error('Failed to create concern')
  }

  const data = await response.json()
  return data.concern
}
