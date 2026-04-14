import { apiFetch } from './api'
import type { iUser } from '../types'

interface AuthResponse {
  user: iUser
}

interface MessageResponse {
  message: string
}

export const authService = {
  async register(data: {
    name: string
    email: string
    password: string
    password_confirmation: string
  }): Promise<MessageResponse> {
    return apiFetch<MessageResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    return apiFetch<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async logout(): Promise<MessageResponse> {
    return apiFetch<MessageResponse>('/auth/logout', { method: 'POST' })
  },

  async getUser(): Promise<AuthResponse> {
    return apiFetch<AuthResponse>('/auth/user')
  },

  async forgotPassword(email: string): Promise<MessageResponse> {
    return apiFetch<MessageResponse>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  },

  async resetPassword(data: {
    token: string
    email: string
    password: string
    password_confirmation: string
  }): Promise<MessageResponse> {
    return apiFetch<MessageResponse>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async updateProfile(data: { name?: string; email?: string; locale?: string | null }): Promise<AuthResponse> {
    return apiFetch<AuthResponse>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  async updatePassword(data: {
    current_password: string
    password: string
    password_confirmation: string
  }): Promise<MessageResponse> {
    return apiFetch<MessageResponse>('/auth/password', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  async resendVerification(): Promise<MessageResponse> {
    return apiFetch<MessageResponse>('/auth/email/resend', { method: 'POST' })
  },
}
