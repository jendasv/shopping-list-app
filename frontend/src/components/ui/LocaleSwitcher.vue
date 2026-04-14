<template>
  <div class="relative" ref="containerRef">
    <button
      @click="toggle"
      class="flex items-center gap-1 text-sm px-2 py-1 border-b-2 border-transparent hover:border-black transition-colors"
      :class="{ 'border-black': isOpen }"
    >
      <span>{{ currentFlag }}</span>
      <span class="font-medium uppercase tracking-wide">{{ currentLocale }}</span>
    </button>

    <Transition name="dropdown">
      <div
        v-if="isOpen"
        class="absolute right-0 top-full mt-1 bg-white border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] z-50 overflow-hidden min-w-[130px]"
      >
        <button
          v-for="loc in availableLocales"
          :key="loc.code"
          @click="select(loc.code)"
          class="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-50 transition-colors text-left"
          :class="{ 'font-semibold': loc.code === currentLocale }"
        >
          <span>{{ loc.flag }}</span>
          <span>{{ loc.nativeLabel }}</span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useLocale } from '@/composables/useLocale'

const { currentLocale, availableLocales, setLocale } = useLocale()

const isOpen = ref(false)
const containerRef = ref<HTMLElement | null>(null)

const currentFlag = computed(
  () => availableLocales.find((l) => l.code === currentLocale.value)?.flag ?? '🌐',
)

function toggle() { isOpen.value = !isOpen.value }
function close()  { isOpen.value = false }

onClickOutside(containerRef, close)

async function select(code: string) {
  close()
  await setLocale(code)
}
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.12s ease, transform 0.12s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
