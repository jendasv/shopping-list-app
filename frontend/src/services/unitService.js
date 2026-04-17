import { apiFetch } from '@/services/api';
export async function fetchUnits() {
    return apiFetch('/units');
}
