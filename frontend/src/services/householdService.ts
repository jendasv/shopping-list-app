import { apiFetch } from './api'
import type { iHouseholdOverview } from '@/types'

interface MessageResponse {
  message: string
}

export const householdService = {
  async getHousehold(): Promise<iHouseholdOverview> {
    return apiFetch<iHouseholdOverview>('/household')
  },

  async updateHousehold(name: string): Promise<MessageResponse> {
    return apiFetch<MessageResponse>('/household', {
      method: 'PUT',
      body: JSON.stringify({ name }),
    })
  },

  async sendInvitation(email: string): Promise<MessageResponse> {
    return apiFetch<MessageResponse>('/invitations', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  },

  async leaveHousehold(id: number): Promise<MessageResponse> {
    return apiFetch<MessageResponse>(`/household/${id}/leave`, { method: 'POST' })
  },

  async removeMember(userId: number): Promise<MessageResponse> {
    return apiFetch<MessageResponse>(`/household/members/${userId}`, { method: 'DELETE' })
  },
}
