<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  text?: string
  texts?: string[]
  speed?: number
  pauseMs?: number
}>()

const emit = defineEmits<{ (e: 'done'): void }>()

const displayed = ref('')
let timeoutId: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  if (props.texts && props.texts.length > 0) {
    cycleTexts(0)
  } else if (props.text) {
    typeOnce(props.text, () => emit('done'))
  }
})

onUnmounted(() => {
  if (timeoutId) clearTimeout(timeoutId)
})

function typeOnce(str: string, onDone?: () => void) {
  let i = 0
  const speed = props.speed ?? 50

  function step() {
    if (i < str.length) {
      displayed.value += str[i++]
      timeoutId = setTimeout(step, speed)
    } else {
      onDone?.()
    }
  }
  step()
}

function eraseOnce(onDone: () => void) {
  const speed = (props.speed ?? 50) / 2

  function step() {
    if (displayed.value.length > 0) {
      displayed.value = displayed.value.slice(0, -1)
      timeoutId = setTimeout(step, speed)
    } else {
      onDone()
    }
  }
  step()
}

function cycleTexts(index: number) {
  const list = props.texts!
  const pause = props.pauseMs ?? 1800

  typeOnce(list[index]!, () => {
    timeoutId = setTimeout(() => {
      eraseOnce(() => {
        cycleTexts((index + 1) % list.length)
      })
    }, pause)
  })
}
</script>

<template>
  <span class="written">{{ displayed }}</span>
</template>
