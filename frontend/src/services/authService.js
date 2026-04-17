import { apiFetch } from './api';
export const authService = {
    async register(data) {
        return apiFetch('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    async login(data) {
        return apiFetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    async logout() {
        return apiFetch('/auth/logout', { method: 'POST' });
    },
    async getUser() {
        return apiFetch('/auth/user');
    },
    async forgotPassword(email) {
        return apiFetch('/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
    },
    async resetPassword(data) {
        return apiFetch('/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    async updateProfile(data) {
        return apiFetch('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },
    async updatePassword(data) {
        return apiFetch('/auth/password', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },
    async resendVerification() {
        return apiFetch('/auth/email/resend', { method: 'POST' });
    },
};
