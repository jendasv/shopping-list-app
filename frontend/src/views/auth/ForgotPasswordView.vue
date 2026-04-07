<template>
  <div class="min-h-screen flex items-center justify-center px-8 py-12">
    <div class="w-full max-w-sm">
      <h1 class="text-2xl font-bold mb-2">Forgot password</h1>
      <p class="text-gray-500 text-base mb-8">
        Enter your email and we'll send you a reset link.
      </p>

      <form v-if="!sent" @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-base font-medium mb-1">Email</label>
          <input
            v-model="email"
            type="email"
            placeholder="jan@example.com"
            required
            class="input-field"
          />
        </div>

        <AlertMessage v-if="error" type="error" :message="error" />

        <button type="submit" :disabled="loading" class="btn-primary w-full">
          {{ loading ? 'Sending...' : 'Send reset link' }}
        </button>
      </form>

      <AlertMessage
        v-else
        type="success"
        message="Link sent. Check your email."
      />

      <p class="text-center text-base text-gray-500 mt-6">
        <RouterLink :to="{ name: 'login' }" class="font-medium underline">
          Back to sign in
        </RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { authService } from '@/services/authService'
import AlertMessage from '@/components/elements/AlertMessage.vue'

const email = ref('')
const error = ref('')
const loading = ref(false)
const sent = ref(false)

async function handleSubmit() {
  error.value = ''
  loading.value = true
  try {
    await authService.forgotPassword(email.value)
    sent.value = true
  } catch (e: unknown) {
    const err = e as { message?: string }
    error.value = err.message ?? 'Something went wrong.'
  } finally {
    loading.value = false
  }
}
</script>

