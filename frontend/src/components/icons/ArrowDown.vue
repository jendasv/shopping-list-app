<template>
  <div>
    <svg
      viewBox="0 0 40 40"
      :class="['group cursor-pointer transition-all duration-200', customClass]"
      fill="none"
    >
      <path :class="strokeClass" d="M20 10 Q22 18 20 28" stroke="#222222" fill="none" stroke-width="2.5" stroke-linecap="round"/>
      <path :class="strokeClass" d="M14 22 Q18 26 20 28" stroke="#222222" fill="none" stroke-width="2.5" stroke-linecap="round"/>
      <path :class="strokeClass" d="M26 22 Q22 26 20 28" stroke="#222222" fill="none" stroke-width="2.5" stroke-linecap="round"/>
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
