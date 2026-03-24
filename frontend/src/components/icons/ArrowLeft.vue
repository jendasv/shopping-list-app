<template>
  <div>
    <svg
      viewBox="0 0 40 40"
      :class="['group cursor-pointer transition-all duration-200', customClass]"
      fill="none"
    >
      <path :class="strokeClass" d="M30 20 Q22 18 12 20" stroke="#222222" fill="none" stroke-width="2.5" stroke-linecap="round"/>
      <path :class="strokeClass" d="M18 14 Q14 18 12 20" stroke="#222222" fill="none" stroke-width="2.5" stroke-linecap="round"/>
      <path :class="strokeClass" d="M18 26 Q14 22 12 20" stroke="#222222" fill="none" stroke-width="2.5" stroke-linecap="round"/>
    </svg>
  </div>
</template>

<script setup lang="ts">
defineProps({
  customClass: {
    type: String,
    default: ""
  },
  strokeClass: {
    type: String,
    default: "stroke-gray-800 group-hover:stroke-gray-400 transition-all duration-200"
  }
})
</script>

<style scoped>

</style>
