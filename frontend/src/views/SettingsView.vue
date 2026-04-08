<template>
  <div class="py-4 space-y-10">
    <h1 class="text-2xl font-bold text-center">Profile settings</h1>

    <!-- Profile -->
    <section>
      <h2 class="text-xl font-semibold mb-4">Profile</h2>
      <form @submit.prevent="saveProfile" class="space-y-4">
        <div class="flex items-center gap-4 text-xl">
          <label class="w-32 shrink-0 text-gray-900">Name</label>
          <input v-model="profile.name" type="text" readonly placeholder="Your name" class="flex-1 p-2 focus:outline-none text-gray-900 bg-transparent cursor-default" />
        </div>
        <div class="flex items-center gap-4 text-xl">
          <label class="w-32 shrink-0 text-gray-900">Email</label>
          <input v-model="profile.email" type="email" readonly placeholder="your@email.com" class="flex-1 p-2 focus:outline-none text-gray-900 bg-transparent cursor-default" />
        </div>
        <AlertMessage v-if="profileError" type="error" :message="profileError" />
        <AlertMessage v-if="profileSuccess" type="success" :message="profileSuccess" />
      </form>
    </section>

    <HandDrawnDivider />

    <!-- Password -->
    <section>
      <h2 class="text-xl font-semibold mb-4">Change password</h2>
      <form @submit.prevent="savePassword" class="space-y-4">
        <div class="flex items-center gap-4 text-xl">
          <label class="w-32 shrink-0 text-gray-900">Current</label>
          <input v-model="password.current" type="password" required placeholder="Current password" class="flex-1 p-2 focus:outline-none text-gray-900" />
        </div>
        <div class="flex items-center gap-4 text-xl">
          <label class="w-32 shrink-0 text-gray-900">New</label>
          <input v-model="password.next" type="password" required placeholder="At least 8 characters" class="flex-1 p-2 focus:outline-none text-gray-900" />
        </div>
        <div class="flex items-center gap-4 text-xl">
          <label class="w-32 shrink-0 text-gray-900">Confirm</label>
          <input v-model="password.confirm" type="password" required placeholder="Repeat new password" class="flex-1 p-2 focus:outline-none text-gray-900" />
        </div>
        <AlertMessage v-if="passwordError" type="error" :message="passwordError" />
        <AlertMessage v-if="passwordSuccess" type="success" :message="passwordSuccess" />
        <button type="submit" :disabled="passwordLoading" class="btn-primary">
          {{ passwordLoading ? 'Saving...' : 'Change password' }}
        </button>
      </form>
    </section>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { authService } from '@/services/authService'
import AlertMessage from '@/components/elements/AlertMessage.vue'
import HandDrawnDivider from '@/components/elements/HandDrawnDivider.vue'

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
    profileSuccess.value = 'Profile saved.'
  } catch (e: unknown) {
    const err = e as { errors?: Record<string, string[]>; message?: string }
    if (err.errors) {
      const first = Object.values(err.errors)[0]
      profileError.value = Array.isArray(first) ? (first[0] ?? '') : String(first)
    } else {
      profileError.value = err.message ?? 'Failed to save profile.'
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
    passwordSuccess.value = 'Password changed.'
    password.value = { current: '', next: '', confirm: '' }
  } catch (e: unknown) {
    const err = e as { errors?: Record<string, string[]>; message?: string }
    if (err.errors) {
      const first = Object.values(err.errors)[0]
      passwordError.value = Array.isArray(first) ? (first[0] ?? '') : String(first)
    } else {
      passwordError.value = err.message ?? 'Failed to change password.'
    }
  } finally {
    passwordLoading.value = false
  }
}
</script>
