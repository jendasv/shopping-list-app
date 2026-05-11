import { apiFetch } from '@/services/api'
import type { iGlobalProduct } from '@/types'

export async function searchByBarcode(barcode: string): Promise<iGlobalProduct | null> {
  const params = new URLSearchParams({ barcode })
  const results = await apiFetch<iGlobalProduct[]>(`/global-products/search?${params}`)
  return results[0] ?? null
}

export async function storeUserProduct(
  name: string,
  barcode: string,
  brand?: string,
): Promise<iGlobalProduct> {
  return apiFetch<iGlobalProduct>('/global-products', {
    method: 'POST',
    body: JSON.stringify({ name, barcode, brand }),
  })
}
