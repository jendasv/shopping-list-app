<template>
  <Transition name="fade">
    <div v-if="localMessage" class="mt-2">
      <span :class="alertClass">
        {{ localMessage }}
      </span>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { watch, ref, computed } from 'vue'

const props = defineProps<{
  message: string
  type?: 'success' | 'error' | 'warning'
  duration?: number
}>()

const emit = defineEmits<{
  (e: 'update:message', value: string): void
}>()

const localMessage = ref(props.message)
const timeout = ref<number | null>(null)
const defaultTimeout: number = 5000

// 🎨 dynamické styly podle typu
const alertClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'block text-green-700 text-center text-lg'
    case 'warning':
      return 'block text-yellow-600 text-center text-lg'
    case 'error':
    default:
      return 'text-red-500 text-sm'
  }
})

// 👀 sleduj změnu message z parenta
watch(
  () => props.message,
  (newVal) => {
    localMessage.value = newVal

    if (timeout.value) {
      clearTimeout(timeout.value)
    }

    if (newVal) {
      timeout.value = setTimeout(() => {
        localMessage.value = ''
        emit('update:message', '')
      }, props.duration ?? defaultTimeout)
    }
  },
  { immediate: true }
)
</script>

<style scoped>

</style>
