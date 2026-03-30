import { apiFetch } from '@/services/api'
import type { iShoppingList } from '@/types'

export async function fetchAllLists(): Promise<iShoppingList[]> {
  return apiFetch<iShoppingList[]>('/lists', { method: 'GET' })
}

export async function fetchList(id: number | string): Promise<iShoppingList> {
  return apiFetch<iShoppingList>(`/lists/${id}/items`, { method: 'GET' })
}

export async function createList(name: string, items?: { name: string; quantity: number }[]): Promise<iShoppingList> {
  return apiFetch<iShoppingList>('/lists', {
    method: 'POST',
    body: JSON.stringify({ name, items }),
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
