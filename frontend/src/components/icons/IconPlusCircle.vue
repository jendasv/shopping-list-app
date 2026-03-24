<template>
  <svg
    :class="['group p-2 cursor-pointer transition-all duration-200 hover:scale-105', sizeClass]"
    viewBox="0 0 40 40"
    fill="none"
  >
    <!-- kroužek (lehce nepravidelný) -->
    <path
      :class="strokeClass"
      d="M20 6 Q30 8 34 20 Q32 30 20 34 Q10 32 6 20 Q8 10 20 6"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />

    <!-- plus (2 čáry) -->
    <path
      :class="strokeClass"
      d="M20 13 Q20 20 20 27"
      stroke-width="2.5"
      stroke-linecap="round"
    />
    <path
      :class="strokeClass"
      d="M13 20 Q20 20 27 20"
      stroke-width="2.5"
      stroke-linecap="round"
    />
  </svg>
</template>

<script setup>
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
