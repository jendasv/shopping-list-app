<template>
  <svg
    :class="['group cursor-pointer p-2 transition-all duration-200 hover:scale-105 hover:rotate-3', sizeClass]"
    viewBox="0 0 40 40"
    fill="none"
  >
    <!-- tělo tužky -->
    <path
      :class="strokeClass"
      d="M10 30 Q12 28 26 14 Q30 10 32 12 Q34 14 30 18 Q16 32 14 34 Q12 36 10 30"
      stroke-width="2.2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />

    <!-- hrot -->
    <path
      :class="strokeClass"
      d="M26 14 Q28 12 30 14"
      stroke-width="2.2"
      stroke-linecap="round"
    />

    <!-- malá čára pro detail -->
    <path
      :class="strokeClass"
      d="M12 32 Q16 30 18 28"
      stroke-width="2"
      stroke-linecap="round"
    />
  </svg>
</template>

<script setup>
//group cursor-pointer transition-all duration-200 p-2
defineProps({
  sizeClass: {
    type: String,
    default: "w-10 h-10"
  },
  strokeClass: {
    type: String,
    default: "stroke-gray-800 group-hover:stroke-gray-400 transition-all duration-200"
  }
})
</script>
