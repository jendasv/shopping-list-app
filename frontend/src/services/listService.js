import { apiFetch } from '@/services/api';
export async function fetchAllLists(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/lists${query ? `?${query}` : ''}`, { method: 'GET' });
}
export async function fetchList(id) {
    return apiFetch(`/lists/${id}`, { method: 'GET' });
}
export async function createList(name, visibility, items, listType = 'shopping') {
    return apiFetch('/lists', {
        method: 'POST',
        body: JSON.stringify({ name, visibility, items, list_type: listType }),
    });
}
export async function updateList(id, name) {
    return apiFetch(`/lists/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ name }),
    });
}
export async function deleteList(id) {
    return apiFetch(`/lists/${id}`, { method: 'DELETE' });
}
export async function reorderLists(order) {
    return apiFetch('/lists/reorder', {
        method: 'POST',
        body: JSON.stringify({ order }),
    });
}
export async function reorderItems(listId, order) {
    return apiFetch(`/lists/${listId}/items/reorder`, {
        method: 'POST',
        body: JSON.stringify({ order }),
    });
}
