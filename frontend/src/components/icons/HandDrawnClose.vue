<template>
  <span class="absolute top-0 right-2">
    <svg
      @click="show = false"
      :class="['cursor-pointer transition-all duration-200 w-8 h-8 group', customClass]"
      viewBox="0 0 40 40"
      fill="none"

    >
      <!-- Křížek -->
      <path
        :class="strokeClass"
        d="M10 10 Q12 8 20 18 Q28 28 30 30"
        stroke-width="2.5"
        stroke-linecap="round"
      />
      <path
        :class="strokeClass"
        d="M30 10 Q28 12 20 18 Q12 24 10 30"
        stroke-width="2.5"
        stroke-linecap="round"
      />
    </svg>
  </span>
</template>

<script setup lang="ts">
const show = defineModel()

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
