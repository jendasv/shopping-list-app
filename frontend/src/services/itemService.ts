import { apiFetch } from '@/services/api'
import type { iItem, iList } from '@/types'

export async function createItem(
  listId: number | string,
  data: { name: string; quantity: number; isCompleted: boolean },
): Promise<iList> {
  return apiFetch<iList>(`/lists/${listId}/item`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateItem(
  listId: number,
  itemId: number,
  data: Partial<{ name: string; quantity: number; isCompleted: boolean }>,
): Promise<iItem> {
  return apiFetch<iItem>(`/lists/${listId}/items/${itemId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteItem(listId: number, itemId: number): Promise<void> {
  return apiFetch<void>(`/lists/${listId}/items/${itemId}`, { method: 'DELETE' })
}
