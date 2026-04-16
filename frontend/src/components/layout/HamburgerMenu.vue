<template>
  <div ref="menuRef">
    <!-- Hamburger button (tatarka 🥩) -->
    <button
      @click="toggle"
      class="flex flex-col justify-center items-center w-9 h-9 gap-[5px] hover:bg-black/5 rounded-md transition-colors cursor-pointer"
      aria-label="Menu"
    >
      <span
        v-for="i in 3"
        :key="i"
        class="block h-[2px] bg-current transition-all duration-200 origin-center"
        :class="[
          i === 1 ? (isOpen ? 'w-5 rotate-45 translate-y-[7px]' : 'w-6') : '',
          i === 2 ? (isOpen ? 'opacity-0 w-0' : 'w-5') : '',
          i === 3 ? (isOpen ? 'w-5 -rotate-45 -translate-y-[7px]' : 'w-6') : '',
        ]"
      />
    </button>

    <!-- Slide-in panel -->
    <Transition name="slide">
      <div
        v-if="isOpen"
        class="absolute top-14 left-0 w-56 bg-white border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] z-50 py-2"
      >
        <RouterLink
          v-for="item in menuItems"
          :key="item.name"
          :to="item.to"
          @click="close"
          class="flex items-center gap-3 px-4 py-3 text-xl font-medium hover:bg-gray-50 transition-colors"
        >
          {{ $t(item.labelKey) }}
        </RouterLink>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

const isOpen = ref(false)
const menuRef = ref<HTMLElement | null>(null)

const menuItems = [
  { name: 'home', labelKey: 'lists.title', to: { name: 'home' } },
  { name: 'catalog', labelKey: 'catalog.title', to: { name: 'catalog' } },
  { name: 'household', labelKey: 'household.title', to: { name: 'household' } },
  { name: 'settings', labelKey: 'settings.title', to: { name: 'settings' } },
]

function toggle() { isOpen.value = !isOpen.value }
function close() { isOpen.value = false }

onClickOutside(menuRef, close)
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
