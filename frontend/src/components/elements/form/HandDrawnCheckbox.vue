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
        d="M8 10 Q10 6 20 8 Q30 10 32 20 Q30 30 20 32 Q10 30 8 20 Z"
        stroke-width="2.2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      <!-- check (jen když checked) -->
      <path
        v-if="model"
        :class="strokeClass"
        d="M12 22 Q18 28 20 26 Q26 18 34 12"
        stroke-width="2.2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </label>
</template>

<script setup>
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
