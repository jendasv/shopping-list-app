const API_URL = import.meta.env.VITE_API_URL

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  // pokud je 204 No Content, vrátíme undefined
  if (response.status === 204) {
    return undefined as unknown as T
  }

  return await response.json() as Promise<T>
}
