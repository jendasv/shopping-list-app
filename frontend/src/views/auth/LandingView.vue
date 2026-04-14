<template>
  <div class="min-h-screen flex flex-col md:flex-row">
    <div class="absolute top-4 right-4 z-10">
      <LocaleSwitcher />
    </div>

    <!-- Right side — registration (first on mobile) -->
    <div class="flex-1 flex flex-col justify-center px-8 py-12 md:pl-8 md:pr-0 order-1 md:order-2">
      <div class="max-w-sm mx-auto w-full">
        <!-- App name — mobile only -->
        <p class="md:hidden text-xs font-bold tracking-widest uppercase text-gray-400 mb-5">{{ $t('auth.appName') }}</p>

        <h1 class="text-2xl font-bold mb-2">{{ $t('auth.getStarted') }}</h1>
        <p class="text-gray-500 text-base mb-8">{{ $t('auth.noCredits') }}</p>

        <form @submit.prevent="handleRegister" class="space-y-4">
          <div>
            <label class="block text-base font-medium mb-1">{{ $t('auth.fields.name') }}</label>
            <input
              v-model="form.name"
              type="text"
              :placeholder="$t('auth.placeholders.name')"
              required
              class="input-field"
            />
          </div>
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
              :placeholder="$t('auth.placeholders.password')"
              required
              class="input-field"
            />
          </div>
          <div>
            <label class="block text-base font-medium mb-1">{{ $t('auth.fields.confirmPassword') }}</label>
            <input
              v-model="form.password_confirmation"
              type="password"
              :placeholder="$t('auth.placeholders.repeatPassword')"
              required
              class="input-field"
            />
          </div>

          <AlertMessage v-if="error" type="error" :message="error" />

          <button
            type="submit"
            :disabled="authStore.loading"
            class="btn-primary w-full"
          >
            {{ authStore.loading ? $t('auth.creatingAccount') : $t('auth.createAccount') }}
          </button>
        </form>

        <p class="text-center text-base text-gray-500 mt-6">
          {{ $t('auth.alreadyHaveAccount') }}
          <RouterLink :to="{ name: 'login' }" class="font-medium underline">
            {{ $t('auth.signIn') }}
          </RouterLink>
        </p>
      </div>
    </div>

    <!-- Left side — preview (second on mobile) -->
    <div class="flex-1 flex flex-col justify-center items-center px-8 py-12 md:pr-8 md:pl-0 md:border-r-2 border-black order-2 md:order-1">
      <div class="max-w-sm text-center">
        <!-- App name — desktop only -->
        <p class="hidden md:block text-xs font-bold tracking-widest uppercase text-gray-400 mb-4">{{ $t('auth.appName') }}</p>

        <Typewrite
          :texts="['Shopping.', 'Packing for trips.', 'Shared with family.']"
          class="text-3xl font-bold mb-6"
        />
        <HandDrawnDivider class="mb-6" />
        <ul class="space-y-3 text-left text-base">
          <li class="flex items-start gap-2">
            <span class="mt-0.5">✓</span>
            <span>{{ $t('auth.features.realtime') }}</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="mt-0.5">✓</span>
            <span>{{ $t('auth.features.versatile') }}</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="mt-0.5">✓</span>
            <span>{{ $t('auth.features.privacy') }}</span>
          </li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AlertMessage from '@/components/elements/AlertMessage.vue'
import Typewrite from '@/components/animations/Typewrite.vue'
import HandDrawnDivider from '@/components/elements/HandDrawnDivider.vue'
import LocaleSwitcher from '@/components/ui/LocaleSwitcher.vue'

const authStore = useAuthStore()
const router = useRouter()

const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
})
const error = ref('')

async function handleRegister() {
  error.value = ''
  try {
    await authStore.register(form.value)
    router.push({ name: 'email-verify' })
  } catch (e: unknown) {
    const err = e as { errors?: Record<string, string[]>; message?: string }
    if (err.errors) {
      const first = Object.values(err.errors)[0]
      error.value = Array.isArray(first) ? (first[0] ?? '') : String(first)
    } else {
      error.value = err.message ?? 'Registration failed.'
    }
  }
}
</script>
