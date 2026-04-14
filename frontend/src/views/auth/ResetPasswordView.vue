<template>
  <div class="min-h-screen flex items-center justify-center px-8 py-12">
    <div class="w-full max-w-sm">
      <h1 class="text-2xl font-bold mb-2">{{ $t('auth.newPassword') }}</h1>
      <p class="text-gray-500 text-base mb-8">{{ $t('auth.chooseNewPassword') }}</p>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-base font-medium mb-1">{{ $t('auth.fields.email') }}</label>
          <input
            v-model="form.email"
            type="email"
            :placeholder="$t('auth.placeholders.email')"
            required
            class="input-field"
          />
        </div>
        <div>
          <label class="block text-base font-medium mb-1">{{ $t('auth.fields.newPassword') }}</label>
          <input
            v-model="form.password"
            type="password"
            :placeholder="$t('auth.placeholders.password')"
            required
            class="input-field"
          />
        </div>
        <div>
          <label class="block text-base font-medium mb-1">{{ $t('auth.fields.confirmNewPassword') }}</label>
          <input
            v-model="form.password_confirmation"
            type="password"
            :placeholder="$t('auth.placeholders.repeatNewPassword')"
            required
            class="input-field"
          />
        </div>

        <AlertMessage v-if="error" type="error" :message="error" />

        <button type="submit" :disabled="loading" class="btn-primary w-full">
          {{ loading ? $t('common.saving') : $t('auth.setNewPassword') }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { authService } from '@/services/authService'
import AlertMessage from '@/components/elements/AlertMessage.vue'

const route = useRoute()
const router = useRouter()

const form = ref({
  token: '',
  email: '',
  password: '',
  password_confirmation: '',
})
const error = ref('')
const loading = ref(false)

onMounted(() => {
  form.value.token = route.query.token as string ?? ''
  form.value.email = route.query.email as string ?? ''
})

async function handleSubmit() {
  error.value = ''
  loading.value = true
  try {
    await authService.resetPassword(form.value)
    router.push({ name: 'login' })
  } catch (e: unknown) {
    const err = e as { errors?: Record<string, string[]>; message?: string }
    if (err.errors) {
      const first = Object.values(err.errors)[0]
      error.value = Array.isArray(first) ? (first[0] ?? '') : String(first)
    } else {
      error.value = err.message ?? 'Password reset failed.'
    }
  } finally {
    loading.value = false
  }
}
</script>
