import echo from '@/plugins/echo'

const API_URL = '/api'

// The backend doesn't return one consistent shape: default Laravel validation
// (auth endpoints) sends { message, errors }, while FormRequest-based
// endpoints (lists/items/products) send { error, details } instead — both
// with the same { field: string[] } validation-message structure underneath.
// Normalized here so every caller of apiFetch only ever has to know one shape.
export interface ApiError {
  status: number
  message: string
  errors?: Record<string, string[]>
}

async function getCsrfCookie(): Promise<void> {
  await fetch('/sanctum/csrf-cookie', {
    credentials: 'include',
  })
}

function getXsrfToken(): string {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/)
  return match?.[1] ? decodeURIComponent(match[1]) : ''
}

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const method = options.method?.toUpperCase() ?? 'GET'

  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    await getCsrfCookie()
  }

  const socketId = echo.socketId()
  const { headers: callerHeaders, ...restOptions } = options
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...restOptions,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-XSRF-TOKEN': getXsrfToken(),
      ...(socketId ? { 'X-Socket-Id': socketId } : {}),
      ...callerHeaders,
    },
    credentials: 'include',
  })

  if (response.status === 204) {
    return undefined as unknown as T
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    const apiError: ApiError = {
      status: response.status,
      message: body.message ?? body.error ?? `API error: ${response.status}`,
      errors: body.errors ?? body.details,
    }
    throw apiError
  }

  return (await response.json()) as T
}
