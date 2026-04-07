<template>
  <label class="inline-flex items-center cursor-pointer group text-xl">
    <span v-if="$slots.default" class="mr-2">
      <slot />
    </span>
    <!-- reálný input (skrytý, ale funkční) -->
    <input
      type="checkbox"
      v-model="model"
      class="hidden"
    />

    <!-- SVG -->
    <svg
      :class="['w-6 h-6 transition-all duration-200', sizeClass]"
      viewBox="0 0 40 40"
      fill="none"
    >
      <!-- čtverec (ručně kreslený) -->
      <path
        :class="strokeClass"
        d="M8 9 C 14 7.5, 26 8.5, 32 9 C 32.5 15, 32 25, 32 31 C 26 32.5, 14 31.5, 8 31 C 7.5 25, 8 15, 8 9 Z"
        stroke-width="2.2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      <!-- check (jen když checked) -->
      <path
        v-if="model"
        :class="strokeClass"
        d="M11 22 Q18 29 20 27 Q27 18 36 11"
        stroke-width="2.2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </label>
</template>

<script setup lang="ts">
const model = defineModel()


defineProps({
  sizeClass: {
    type: String,
    default: ""
  },
  strokeClass: {
    type: String,
    default: "stroke-gray-800 group-hover:stroke-gray-400"
  }
})
</script>
