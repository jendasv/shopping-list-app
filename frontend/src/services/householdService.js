import { apiFetch } from './api';
export const householdService = {
    async getHousehold() {
        return apiFetch('/household');
    },
    async updateHousehold(name) {
        return apiFetch('/household', {
            method: 'PUT',
            body: JSON.stringify({ name }),
        });
    },
    async sendInvitation(email) {
        return apiFetch('/invitations', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
    },
    async leaveHousehold(id) {
        return apiFetch(`/household/${id}/leave`, { method: 'POST' });
    },
    async removeMember(userId) {
        return apiFetch(`/household/members/${userId}`, { method: 'DELETE' });
    },
};
