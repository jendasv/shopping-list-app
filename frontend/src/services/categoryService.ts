import { apiFetch } from '@/services/api'
import type { iCategory } from '@/types'

export interface iCategoriesResponse {
  global: iCategory[]
  custom: iCategory[]
}

export async function fetchCategories(): Promise<iCategoriesResponse> {
  return apiFetch<iCategoriesResponse>('/categories')
}

export async function createCategory(name: string): Promise<iCategory> {
  return apiFetch<iCategory>('/categories', {
    method: 'POST',
    body: JSON.stringify({ name }),
  })
}

export async function updateCategory(id: number, name: string): Promise<iCategory> {
  return apiFetch<iCategory>(`/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ name }),
  })
}

export async function deleteCategory(id: number): Promise<void> {
  return apiFetch<void>(`/categories/${id}`, { method: 'DELETE' })
}
