import { apiFetch } from '@/services/api';
export async function searchProducts(query, limit = 10) {
    const params = new URLSearchParams({ q: query, limit: String(limit) });
    return apiFetch(`/products/search?${params}`);
}
export async function fetchProducts(params = {}) {
    const query = new URLSearchParams();
    if (params.page)
        query.set('page', String(params.page));
    if (params.category_id)
        query.set('category_id', String(params.category_id));
    if (params.q)
        query.set('q', params.q);
    const qs = query.toString();
    return apiFetch(`/products${qs ? `?${qs}` : ''}`);
}
export async function createProduct(data) {
    return apiFetch('/products', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}
export async function updateProduct(id, data) {
    return apiFetch(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}
export async function deleteProduct(id) {
    return apiFetch(`/products/${id}`, { method: 'DELETE' });
}
