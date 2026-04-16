import { apiFetch } from '@/services/api'
import type { iList, iListsResponse } from '@/types'

export async function fetchAllLists(params: Record<string, string> = {}): Promise<iListsResponse<iList>> {
  const query = new URLSearchParams(params).toString()
  return apiFetch<iListsResponse<iList>>(`/lists${query ? `?${query}` : ''}`, { method: 'GET' })
}

export async function fetchList(id: number | string): Promise<iList> {
  return apiFetch<iList>(`/lists/${id}`, { method: 'GET' })
}

export async function createList(
  name: string,
  visibility: 'shared' | 'private',
  items?: { name: string; quantity: number | null }[],
  listType: 'shopping' | 'packing' | 'todo' = 'shopping',
): Promise<iList> {
  return apiFetch<iList>('/lists', {
    method: 'POST',
    body: JSON.stringify({ name, visibility, items, list_type: listType }),
  })
}

export async function updateList(id: number, name: string): Promise<iList> {
  return apiFetch<iList>(`/lists/${id}`, {
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
