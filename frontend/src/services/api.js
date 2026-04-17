import echo from '@/plugins/echo';
const API_URL = '/api';
async function getCsrfCookie() {
    await fetch('/sanctum/csrf-cookie', {
        credentials: 'include',
    });
}
function getXsrfToken() {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match?.[1] ? decodeURIComponent(match[1]) : '';
}
export async function apiFetch(endpoint, options = {}) {
    const method = options.method?.toUpperCase() ?? 'GET';
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
        await getCsrfCookie();
    }
    const socketId = echo.socketId();
    const response = await fetch(`${API_URL}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-XSRF-TOKEN': getXsrfToken(),
            ...(socketId ? { 'X-Socket-Id': socketId } : {}),
            ...options.headers,
        },
        credentials: 'include',
        ...options,
    });
    if (response.status === 204) {
        return undefined;
    }
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: `API error: ${response.status}` }));
        throw { status: response.status, ...error };
    }
    return (await response.json());
}
