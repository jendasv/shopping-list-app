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

    <Transition name="dropdown">
      <div
        v-if="open"
        class="absolute right-0 bottom-full mb-2 z-20 bg-white border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] overflow-hidden min-w-[140px]"
        @click.stop
      >
        <slot name="menu" />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>
