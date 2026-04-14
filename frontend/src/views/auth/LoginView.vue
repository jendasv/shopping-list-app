<template>
  <div class="min-h-screen flex items-center justify-center px-8 py-12">
    <div class="absolute top-4 right-4">
      <LocaleSwitcher />
    </div>
    <div class="w-full max-w-sm">
      <h1 class="text-2xl font-bold mb-2">{{ $t('auth.signIn') }}</h1>
      <p class="text-gray-500 text-base mb-8">{{ $t('auth.welcomeBack') }}</p>

      <form @submit.prevent="handleLogin" class="space-y-4">
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
          <label class="block text-base font-medium mb-1">{{ $t('auth.fields.password') }}</label>
          <input
            v-model="form.password"
            type="password"
            :placeholder="$t('auth.placeholders.yourPassword')"
            required
            class="input-field"
          />
          <div class="text-right mt-1">
            <RouterLink
              :to="{ name: 'forgot-password' }"
              class="text-sm text-gray-500 hover:underline"
            >
              {{ $t('auth.forgotPasswordLink') }}
            </RouterLink>
          </div>
        </div>

        <AlertMessage v-if="error" type="error" :message="error" />

        <button type="submit" :disabled="authStore.loading" class="btn-primary w-full">
          {{ authStore.loading ? $t('auth.signingIn') : $t('auth.signIn') }}
        </button>
      </form>

      <p class="text-center text-base text-gray-500 mt-6">
        {{ $t('auth.noAccount') }}
        <RouterLink :to="{ name: 'landing' }" class="font-medium underline">
          {{ $t('auth.signUp') }}
        </RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AlertMessage from '@/components/elements/AlertMessage.vue'
import LocaleSwitcher from '@/components/ui/LocaleSwitcher.vue'

const authStore = useAuthStore()
const router = useRouter()

const form = ref({ email: '', password: '' })
const error = ref('')

async function handleLogin() {
  error.value = ''
  try {
    await authStore.login(form.value.email, form.value.password)
    const redirect = router.currentRoute.value.query.redirect as string | undefined
    router.push(redirect ?? { name: 'home' })
  } catch (e: unknown) {
    const err = e as { errors?: Record<string, string[]>; message?: string }
    if (err.errors) {
      const first = Object.values(err.errors)[0]
      error.value = Array.isArray(first) ? (first[0] ?? '') : String(first)
    } else {
      error.value = err.message ?? 'Sign in failed.'
    }
  }
}
</script>
