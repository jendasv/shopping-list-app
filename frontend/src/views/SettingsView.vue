<template>
  <div class="py-4 space-y-10">
    <h1 class="text-2xl font-bold text-center">{{ $t('settings.title') }}</h1>

    <!-- Profile -->
    <section>
      <h2 class="text-xl font-semibold mb-4">{{ $t('settings.profile') }}</h2>
      <form @submit.prevent="saveProfile" class="space-y-4">
        <div class="flex items-center gap-4 text-xl">
          <label class="w-32 shrink-0 text-gray-900">{{ $t('settings.fields.name') }}</label>
          <input v-model="profile.name" type="text" readonly :placeholder="$t('settings.placeholders.name')" class="flex-1 p-2 focus:outline-none text-gray-900 bg-transparent cursor-default" />
        </div>
        <div class="flex items-center gap-4 text-xl">
          <label class="w-32 shrink-0 text-gray-900">{{ $t('settings.fields.email') }}</label>
          <input v-model="profile.email" type="email" readonly :placeholder="$t('settings.placeholders.email')" class="flex-1 p-2 focus:outline-none text-gray-900 bg-transparent cursor-default" />
        </div>
        <div class="flex items-center gap-4 text-xl">
          <label class="w-32 shrink-0 text-gray-900">{{ $t('settings.language') }}</label>
          <LocaleSwitcher />
        </div>
        <AlertMessage v-if="profileError" type="error" :message="profileError" />
        <AlertMessage v-if="profileSuccess" type="success" :message="profileSuccess" />
      </form>
    </section>

    <HandDrawnDivider />

    <!-- Password -->
    <section>
      <h2 class="text-xl font-semibold mb-4">{{ $t('settings.changePassword') }}</h2>
      <form @submit.prevent="savePassword" class="space-y-4">
        <div class="flex items-center gap-4 text-xl">
          <label class="w-32 shrink-0 text-gray-900">{{ $t('auth.fields.currentPassword') }}</label>
          <input v-model="password.current" type="password" required :placeholder="$t('auth.placeholders.currentPassword')" class="flex-1 p-2 focus:outline-none text-gray-900" />
        </div>
        <div class="flex items-center gap-4 text-xl">
          <label class="w-32 shrink-0 text-gray-900">{{ $t('settings.fields.newPassword') }}</label>
          <input v-model="password.next" type="password" required :placeholder="$t('settings.placeholders.newPassword')" class="flex-1 p-2 focus:outline-none text-gray-900" />
        </div>
        <div class="flex items-center gap-4 text-xl">
          <label class="w-32 shrink-0 text-gray-900">{{ $t('settings.fields.confirmPassword') }}</label>
          <input v-model="password.confirm" type="password" required :placeholder="$t('settings.placeholders.confirmPassword')" class="flex-1 p-2 focus:outline-none text-gray-900" />
        </div>
        <AlertMessage v-if="passwordError" type="error" :message="passwordError" />
        <AlertMessage v-if="passwordSuccess" type="success" :message="passwordSuccess" />
        <button type="submit" :disabled="passwordLoading" class="btn-primary">
          {{ passwordLoading ? $t('common.saving') : $t('settings.changePassword') }}
        </button>
      </form>
    </section>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { authService } from '@/services/authService'
import AlertMessage from '@/components/elements/AlertMessage.vue'
import HandDrawnDivider from '@/components/elements/HandDrawnDivider.vue'
import LocaleSwitcher from '@/components/ui/LocaleSwitcher.vue'

const { t } = useI18n()
const authStore = useAuthStore()

// Profile
const profile = ref({ name: authStore.user?.name ?? '', email: authStore.user?.email ?? '' })
const profileLoading = ref(false)
const profileError = ref('')
const profileSuccess = ref('')

async function saveProfile() {
  profileError.value = ''
  profileSuccess.value = ''
  profileLoading.value = true
  try {
    const res = await authService.updateProfile(profile.value)
    authStore.user = res.user
    profileSuccess.value = t('settings.profileSaved')
  } catch (e: unknown) {
    const err = e as { errors?: Record<string, string[]>; message?: string }
    if (err.errors) {
      const first = Object.values(err.errors)[0]
      profileError.value = Array.isArray(first) ? (first[0] ?? '') : String(first)
    } else {
      profileError.value = err.message ?? t('settings.errors.saveFailed')
    }
  } finally {
    profileLoading.value = false
  }
}

// Password
const password = ref({ current: '', next: '', confirm: '' })
const passwordLoading = ref(false)
const passwordError = ref('')
const passwordSuccess = ref('')

async function savePassword() {
  passwordError.value = ''
  passwordSuccess.value = ''
  passwordLoading.value = true
  try {
    await authService.updatePassword({
      current_password: password.value.current,
      password: password.value.next,
      password_confirmation: password.value.confirm,
    })
    passwordSuccess.value = t('settings.passwordChanged')
    password.value = { current: '', next: '', confirm: '' }
  } catch (e: unknown) {
    const err = e as { errors?: Record<string, string[]>; message?: string }
    if (err.errors) {
      const first = Object.values(err.errors)[0]
      passwordError.value = Array.isArray(first) ? (first[0] ?? '') : String(first)
    } else {
      passwordError.value = err.message ?? t('settings.errors.passwordChangeFailed')
    }
  } finally {
    passwordLoading.value = false
  }
}
</script>
