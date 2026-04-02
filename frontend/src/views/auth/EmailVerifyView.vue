<template>
  <div class="min-h-screen flex items-center justify-center px-8 py-12">
    <div class="w-full max-w-sm text-center">
      <h1 class="text-2xl font-bold mb-2">Verify your email</h1>
      <p class="text-gray-500 text-sm mb-8">
        We sent a verification link to
        <span v-if="authStore.user" class="font-medium text-black">{{ authStore.user.email }}</span>.
        Click the link in the email to activate your account.
      </p>

      <AlertMessage v-if="success" type="success" :message="success" class="mb-4" />
      <AlertMessage v-if="error" type="error" :message="error" class="mb-4" />

      <button :disabled="loading || cooldown > 0" @click="resend" class="btn-primary w-full mb-4">
        <span v-if="loading">Sending...</span>
        <span v-else-if="cooldown > 0">Resend ({{ cooldown }}s)</span>
        <span v-else>Resend email</span>
      </button>

      <button v-if="authStore.isAuthenticated" @click="logout" class="btn-secondary w-full mb-4">
        Sign out
      </button>

      <p v-if="!authStore.isAuthenticated" class="text-center text-sm text-gray-500">
        Already verified?
        <RouterLink :to="{ name: 'login' }" class="font-medium underline">Sign in</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { authService } from '@/services/authService'
import AlertMessage from '@/components/elements/AlertMessage.vue'

const authStore = useAuthStore()
const router = useRouter()

onMounted(async () => {
  await authStore.fetchUser()
  if (authStore.isEmailVerified) {
    router.push({ name: 'home' })
  }
})

const loading = ref(false)
const success = ref('')
const error = ref('')
const cooldown = ref(0)

let cooldownTimer: ReturnType<typeof setInterval> | null = null

async function resend() {
  success.value = ''
  error.value = ''
  loading.value = true
  try {
    await authService.resendVerification()
    success.value = 'Email sent.'
    cooldown.value = 60
    cooldownTimer = setInterval(() => {
      cooldown.value--
      if (cooldown.value <= 0 && cooldownTimer) {
        clearInterval(cooldownTimer)
        cooldownTimer = null
      }
    }, 1000)
  } catch (e: unknown) {
    const err = e as { message?: string }
    error.value = err.message ?? 'Failed to send email.'
  } finally {
    loading.value = false
  }
}

async function logout() {
  await authStore.logout()
  router.push({ name: 'landing' })
}
</script>

