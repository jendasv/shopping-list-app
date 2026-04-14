<script setup lang="ts">
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

const isOpen = ref(false)
const containerRef = ref<HTMLElement | null>(null)

onClickOutside(containerRef, () => { isOpen.value = false })
</script>

<template>
  <div ref="containerRef" class="ml-3 shrink-0 relative">
    <button
      @click.stop="isOpen = !isOpen"
      class="text-gray-400 hover:text-black text-2xl leading-none px-1 py-0.5 cursor-pointer transition-colors"
      :title="$t('common.options')"
    >⋯</button>

    <Transition name="dropdown">
      <div
        v-if="isOpen"
        class="absolute right-0 bottom-full mb-2 z-50 bg-white border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] overflow-hidden min-w-[140px]"
      >
        <slot name="menu" :close="() => (isOpen = false)" />
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
