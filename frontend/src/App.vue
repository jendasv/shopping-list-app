<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="min-h-screen flex justify-center <!--bg-stone-100-->">
    <main class="paper w-full max-w-xl min-h-screen p-8 shadow-xl relative">
      <RouterView />
    </main>
  </div>
</template>

<style scoped lang="scss">


</style>
