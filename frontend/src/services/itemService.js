import { apiFetch } from '@/services/api';
export async function createItem(listId, data) {
    return apiFetch(`/lists/${listId}/items`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}
export async function updateItem(listId, itemId, data) {
    return apiFetch(`/lists/${listId}/items/${itemId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}
export async function deleteItem(listId, itemId) {
    return apiFetch(`/lists/${listId}/items/${itemId}`, { method: 'DELETE' });
}
