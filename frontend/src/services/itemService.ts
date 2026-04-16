import { apiFetch } from '@/services/api'
import type { iItem, iList } from '@/types'

export interface iCreateItemPayload {
  name?: string
  product_id?: number | null
  quantity?: number | null
  unit_id?: number | null
  notes?: string | null
  isCompleted?: boolean
}

export async function createItem(listId: number | string, data: iCreateItemPayload): Promise<iList> {
  return apiFetch<iList>(`/lists/${listId}/items`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateItem(
  listId: number,
  itemId: number,
  data: Partial<{
    name: string
    product_id: number | null
    quantity: number | null
    unit_id: number | null
    notes: string | null
    isCompleted: boolean
  }>,
): Promise<iItem> {
  return apiFetch<iItem>(`/lists/${listId}/items/${itemId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteItem(listId: number, itemId: number): Promise<void> {
  return apiFetch<void>(`/lists/${listId}/items/${itemId}`, { method: 'DELETE' })
}
