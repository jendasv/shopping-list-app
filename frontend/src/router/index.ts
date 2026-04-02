import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { iShoppingList } from '@/types'

declare module 'vue-router' {
  interface RouteMeta {
    list?: iShoppingList
    requiresAuth?: boolean
    requiresGuest?: boolean
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Public routes
    {
      path: '/',
      name: 'landing',
      component: () => import('@/views/auth/LandingView.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('@/views/auth/ForgotPasswordView.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('@/views/auth/ResetPasswordView.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/email-verify',
      name: 'email-verify',
      component: () => import('@/views/auth/EmailVerifyView.vue'),
    },
    {
      path: '/email-verified',
      name: 'email-verified',
      component: () => import('@/views/auth/EmailVerifiedView.vue'),
    },
    {
      path: '/invitations/:token/accept',
      name: 'invitation-accept',
      component: () => import('@/views/InvitationView.vue'),
    },
    {
      path: '/invitations/:token/decline',
      name: 'invitation-decline',
      component: () => import('@/views/InvitationView.vue'),
    },

    // Protected routes
    {
      path: '/lists',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/lists/new',
      name: 'new-list',
      component: () => import('@/views/CreateShoppingList.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/lists/:id',
      name: 'list-detail',
      component: () => import('@/views/ListDetail.vue'),
      meta: { requiresAuth: true },
      beforeEnter: async (to) => {
        const { fetchList } = await import('@/services/shoppingListService')
        try {
          to.meta.list = await fetchList(to.params.id as string)
          return true
        } catch {
          return { name: 'home' }
        }
      },
    },
    {
      path: '/household',
      name: 'household',
      component: () => import('@/views/HouseholdView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/SettingsView.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  // Inicializuj auth stav při prvním načtení
  if (!authStore.initialized) {
    await authStore.fetchUser()
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'landing' }
  }

  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    return { name: 'home' }
  }

  // Ověřený email je povinný pro přístup do aplikace
  const emailVerifyExempt = ['email-verify', 'email-verified', 'landing', 'login', 'forgot-password', 'reset-password', 'invitation-accept', 'invitation-decline']
  if (authStore.isAuthenticated && !authStore.isEmailVerified && !emailVerifyExempt.includes(to.name as string)) {
    return { name: 'email-verify' }
  }
})

export default router
