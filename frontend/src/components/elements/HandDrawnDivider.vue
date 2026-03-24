<template>
  <svg
    :class="['group w-full h-6', customClass]"
    viewBox="0 0 100 20"
    preserveAspectRatio="none"
    fill="none"
  >

    <path v-if="variant === 'default'"
      :class="strokeClass"
      d="
        M0 10
        Q10 6 20 10
        T40 10
        T60 10
        T80 10
        T100 10
      "
      stroke-width="1"
      stroke-linecap="round"
      fill="none"
    />
    <path v-if="variant === 'low-wave'"
          :class="strokeClass"
          d="M0 10 Q25 8 50 10 T100 10"
          stroke-width="1"
          stroke-linecap="round"
          fill="none"
    />
    <path v-if="variant === 'hand-shake'"
          :class="strokeClass"
          d="M0 10 Q10 5 20 11 T40 9 T60 12 T80 8 T100 10"
          stroke-width="1"
          stroke-linecap="round"
          fill="none"
    />
  </svg>
</template>

<script setup>
defineProps({
  customClass: {
    type: String,
    default: "mb-6"
  },
  strokeClass: {
    type: String,
    default: "stroke-gray-800"
  },
  variant: {
    type: String,
    default: "default"
  }
})
</script>
