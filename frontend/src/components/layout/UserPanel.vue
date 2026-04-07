<template>
  <div class="relative" ref="panelRef">
    <button
      @click="toggle"
      class="flex items-center justify-center w-9 h-9 rounded-full border-2 border-current hover:bg-black/5 transition-colors"
      :class="{ 'bg-black/5': isOpen }"
      aria-label="User menu"
    >
      <HandDrawnUserIcon :size="22" />
    </button>

    <Transition name="dropdown">
      <div
        v-if="isOpen"
        class="absolute right-0 top-11 w-56 bg-white border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] z-50"
      >
        <!-- User info -->
        <div class="px-4 py-3 border-b border-gray-100">
          <p class="text-base font-semibold truncate">{{ user?.name }}</p>
          <p class="text-sm text-gray-500 truncate">{{ user?.email }}</p>
        </div>

        <!-- Menu items -->
        <div class="py-1">
          <RouterLink
            :to="{ name: 'settings' }"
            @click="close"
            class="flex items-center gap-2 px-4 py-2 text-xl hover:bg-gray-50 transition-colors"
          >
            Settings
          </RouterLink>
        </div>

        <div class="border-t border-gray-100 py-1">
          <button
            @click="handleLogout"
            class="flex w-full items-center gap-2 px-4 py-2 text-xl text-red-600 hover:bg-red-50 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { onClickOutside } from '@vueuse/core'
import { useAuthStore } from '@/stores/auth'
import HandDrawnUserIcon from '@/components/icons/HandDrawnUserIcon.vue'

const authStore = useAuthStore()
const router = useRouter()
const user = authStore.user

const isOpen = ref(false)
const panelRef = ref<HTMLElement | null>(null)

function toggle() { isOpen.value = !isOpen.value }
function close() { isOpen.value = false }

onClickOutside(panelRef, close)

async function handleLogout() {
  await authStore.logout()
  close()
  router.push({ name: 'landing' })
}
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
