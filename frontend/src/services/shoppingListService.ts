import { apiFetch } from '@/services/api'
import type { iShoppingList, iListsResponse } from '@/types'

export async function fetchAllLists(params: Record<string, string> = {}): Promise<iListsResponse<iShoppingList>> {
  const query = new URLSearchParams(params).toString()
  return apiFetch<iListsResponse<iShoppingList>>(`/lists${query ? `?${query}` : ''}`, { method: 'GET' })
}

export async function fetchList(id: number | string): Promise<iShoppingList> {
  return apiFetch<iShoppingList>(`/lists/${id}/items`, { method: 'GET' })
}

export async function createList(
  name: string,
  visibility: 'shared' | 'private',
  items?: { name: string; quantity: number }[],
): Promise<iShoppingList> {
  return apiFetch<iShoppingList>('/lists', {
    method: 'POST',
    body: JSON.stringify({ name, visibility, items }),
  })
}

export async function updateList(id: number, name: string): Promise<iShoppingList> {
  return apiFetch<iShoppingList>(`/lists/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ name }),
  })
}

export async function deleteList(id: number): Promise<void> {
  return apiFetch<void>(`/lists/${id}`, { method: 'DELETE' })
}

export async function reorderLists(order: number[]): Promise<void> {
  return apiFetch<void>('/lists/reorder', {
    method: 'POST',
    body: JSON.stringify({ order }),
  })
}

export async function reorderItems(listId: number, order: number[]): Promise<void> {
  return apiFetch<void>(`/lists/${listId}/items/reorder`, {
    method: 'POST',
    body: JSON.stringify({ order }),
  })
}
