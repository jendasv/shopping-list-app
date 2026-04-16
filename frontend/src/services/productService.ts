import { apiFetch } from '@/services/api'
import type { iProduct } from '@/types'

export async function searchProducts(query: string, limit = 10): Promise<iProduct[]> {
  const params = new URLSearchParams({ q: query, limit: String(limit) })
  return apiFetch<iProduct[]>(`/products/search?${params}`)
}

export async function fetchProducts(params: {
  page?: number
  category_id?: number | null
  q?: string
} = {}): Promise<{ data: iProduct[]; meta: { current_page: number; last_page: number; total: number } }> {
  const query = new URLSearchParams()
  if (params.page) query.set('page', String(params.page))
  if (params.category_id) query.set('category_id', String(params.category_id))
  if (params.q) query.set('q', params.q)
  const qs = query.toString()
  return apiFetch(`/products${qs ? `?${qs}` : ''}`)
}

export async function createProduct(data: {
  name: string
  category_id?: number | null
  preferred_unit_id?: number | null
  preferred_quantity?: number | null
  notes?: string | null
  barcode?: string | null
}): Promise<iProduct> {
  return apiFetch<iProduct>('/products', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateProduct(
  id: number,
  data: Partial<{
    name: string
    category_id: number | null
    preferred_unit_id: number | null
    preferred_quantity: number | null
    notes: string | null
    barcode: string | null
  }>,
): Promise<iProduct> {
  return apiFetch<iProduct>(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteProduct(id: number): Promise<void> {
  return apiFetch<void>(`/products/${id}`, { method: 'DELETE' })
}
