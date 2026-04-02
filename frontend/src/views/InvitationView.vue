<template>
  <div class="min-h-screen flex items-center justify-center px-8 py-12">
    <div class="w-full max-w-sm text-center">
      <div v-if="loading">
        <p class="text-gray-500 text-sm">Processing invitation...</p>
      </div>

      <div v-else-if="success">
        <h1 class="text-2xl font-bold mb-2">{{ action === 'accept' ? 'Welcome!' : 'Invitation declined' }}</h1>
        <p class="text-gray-500 text-sm mb-8">{{ success }}</p>
        <RouterLink :to="{ name: 'home' }" class="btn-primary inline-block">
          Go to my lists
        </RouterLink>
      </div>

      <div v-else-if="error">
        <h1 class="text-2xl font-bold mb-2">Something went wrong</h1>
        <p class="text-gray-500 text-sm mb-8">{{ error }}</p>
        <RouterLink :to="{ name: 'home' }" class="btn-primary inline-block">
          Go to my lists
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { apiFetch } from '@/services/api'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const token = route.params.token as string
const action = route.name === 'invitation-accept' ? 'accept' : 'decline'

const loading = ref(true)
const success = ref('')
const error = ref('')

onMounted(async () => {
  if (!authStore.initialized) {
    await authStore.fetchUser()
  }

  if (!authStore.isAuthenticated) {
    router.replace({ name: 'login', query: { redirect: route.fullPath } })
    return
  }

  try {
    await apiFetch(`/invitations/${token}/${action}`, { method: 'POST' })
    success.value = action === 'accept'
      ? 'You have joined the household. Your lists have been moved.'
      : 'You have declined the invitation.'
  } catch (e: unknown) {
    const err = e as { message?: string }
    error.value = err.message ?? 'Failed to process invitation.'
  } finally {
    loading.value = false
  }
})
</script>
