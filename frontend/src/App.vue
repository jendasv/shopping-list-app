<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppHeader from '@/components/layout/AppHeader.vue'

const authStore = useAuthStore()
</script>

<template>
  <div class="min-h-screen flex flex-col items-center">
    <div class="w-full max-w-xl min-h-screen shadow-xl relative flex flex-col paper">
      <AppHeader v-if="authStore.isAuthenticated" />
      <main class="flex-1 p-8">
        <RouterView />
      </main>
    </div>
  </div>
</template>
