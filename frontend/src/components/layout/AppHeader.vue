<template>
  <header class="sticky top-0 z-40 bg-white border-b-2 border-black">
    <div class="max-w-xl mx-auto px-4 h-14 flex items-center justify-between">
      <!-- Hamburger vlevo -->
      <HamburgerMenu />

      <!-- Logo / název uprostřed -->
      <RouterLink
        :to="{ name: 'home' }"
        class="absolute left-1/2 -translate-x-1/2 font-bold text-lg tracking-tight"
      >
        {{ appName }}
      </RouterLink>

      <!-- User ikona vpravo -->
      <UserPanel />
    </div>
  </header>
</template>

<script setup lang="ts">
import HamburgerMenu from './HamburgerMenu.vue'
import UserPanel from './UserPanel.vue'

const appName = import.meta.env.VITE_APP_NAME ?? 'Shopping List'
</script>
