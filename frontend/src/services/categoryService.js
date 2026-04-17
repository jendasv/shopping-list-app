import { apiFetch } from '@/services/api';
export async function fetchCategories() {
    return apiFetch('/categories');
}
export async function createCategory(name) {
    return apiFetch('/categories', {
        method: 'POST',
        body: JSON.stringify({ name }),
    });
}
export async function updateCategory(id, name) {
    return apiFetch(`/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ name }),
    });
}
export async function deleteCategory(id) {
    return apiFetch(`/categories/${id}`, { method: 'DELETE' });
}
