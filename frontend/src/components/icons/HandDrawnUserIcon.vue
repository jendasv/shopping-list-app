<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="hand-drawn-user"
  >
    <!-- Hlava — ručně kreslená kružnice -->
    <path
      d="M20 6 C24.5 5.8 28.2 9.2 28.5 13.8 C28.8 18.4 25.5 22.2 20.8 22.6 C16.1 23 12 19.5 11.6 14.9 C11.2 10.3 14.8 6.4 19.5 6.1"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
    />
    <!-- Tělo — ramena -->
    <path
      d="M6 36 C6.2 29.5 10.8 24.8 17.2 23.8 C18.4 23.6 19.6 23.5 20.5 23.6 C27.2 24 32.2 28.8 33.8 35.5"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
    />
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ size?: number }>(), { size: 32 })
</script>

<style scoped>
.hand-drawn-user {
  color: currentColor;
}
</style>
