import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '../services/authService'
import { applyLocale, detectLocale } from '../plugins/i18n'
import type { iUser } from '../types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<iUser | null>(null)
  const loading = ref(false)
  const initialized = ref(false)

  const isAuthenticated = computed(() => user.value !== null)
  const isEmailVerified = computed(() => !!user.value?.emailVerifiedAt)

  async function fetchUser(): Promise<void> {
    try {
      const response = await authService.getUser()
      user.value = response.user
      applyLocale(response.user.locale ?? detectLocale())
    } catch {
      user.value = null
    } finally {
      initialized.value = true
    }
  }

  async function login(email: string, password: string): Promise<void> {
    loading.value = true
    try {
      const response = await authService.login({ email, password })
      user.value = response.user
      applyLocale(response.user.locale ?? detectLocale())
    } finally {
      loading.value = false
    }
  }

  async function register(data: {
    name: string
    email: string
    password: string
    password_confirmation: string
  }): Promise<void> {
    loading.value = true
    try {
      await authService.register(data)
    } finally {
      loading.value = false
    }
  }

  async function logout(): Promise<void> {
    loading.value = true
    try {
      await authService.logout()
      user.value = null
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    loading,
    initialized,
    isAuthenticated,
    isEmailVerified,
    fetchUser,
    login,
    register,
    logout,
  }
})
