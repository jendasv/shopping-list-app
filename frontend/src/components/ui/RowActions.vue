<script setup lang="ts">
defineProps<{
  id: number
  open: boolean
}>()

defineEmits<{
  toggle: [id: number]
  close: []
}>()
</script>

<template>
  <!-- desktop: shown on group-hover -->
  <div class="flex items-center gap-3 ml-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity [@media(pointer:coarse)]:hidden">
    <slot name="desktop" />
  </div>

  <!-- mobile: ⋯ button + popup menu -->
  <div class="hidden [@media(pointer:coarse)]:flex ml-3 shrink-0 relative">
    <button
      @click="$emit('toggle', id)"
      class="text-gray-400 text-2xl leading-none px-1 py-0.5"
      title="Options"
    >⋯</button>

    <div
      v-if="open"
      class="absolute right-0 bottom-full mb-1 z-20 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
      @click.stop
    >
      <slot name="menu" />
    </div>
  </div>
</template>
