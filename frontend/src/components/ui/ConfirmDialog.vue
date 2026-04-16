<template>
  <Teleport to="body">
    <Transition name="confirm">
      <div
        v-if="state.isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @keydown.esc="cancel"
        @keydown.enter="accept"
        tabindex="-1"
        ref="overlayRef"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/40" @click="cancel" />

        <!-- Dialog -->
        <div
          class="relative bg-white border-2 border-black rounded-xl shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] w-full max-w-sm p-6 space-y-4"
          role="alertdialog"
          aria-modal="true"
          :aria-labelledby="state.title ? 'confirm-title' : undefined"
          :aria-describedby="'confirm-message'"
        >
          <p v-if="state.title" id="confirm-title" class="text-xl font-bold">
            {{ state.title }}
          </p>
          <p id="confirm-message" class="text-xl" :class="{ 'font-medium': !state.title }">
            {{ state.message }}
          </p>
          <div class="flex gap-3 justify-end pt-1">
            <button
              @click="cancel"
              class="px-4 py-2 text-base border-2 border-black rounded-lg hover:bg-gray-100 transition cursor-pointer"
            >
              {{ $t('common.cancel') }}
            </button>
            <button
              @click="accept"
              ref="confirmBtnRef"
              class="btn-primary"
            >
              {{ $t('common.confirm') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { watch, nextTick, ref } from 'vue'
import { useConfirm } from '@/composables/useConfirm'

const { state, accept, cancel } = useConfirm()

const overlayRef = ref<HTMLElement | null>(null)
const confirmBtnRef = ref<HTMLElement | null>(null)

// Focus confirm button when dialog opens
watch(
  () => state.isOpen,
  async (open) => {
    if (open) {
      await nextTick()
      confirmBtnRef.value?.focus()
    }
  },
)
</script>

<style scoped>
.confirm-enter-active,
.confirm-leave-active {
  transition: opacity 0.15s ease;
}
.confirm-enter-from,
.confirm-leave-to {
  opacity: 0;
}
.confirm-enter-active .relative,
.confirm-leave-active .relative {
  transition: transform 0.15s ease;
}
.confirm-enter-from .relative,
.confirm-leave-to .relative {
  transform: scale(0.95);
}
</style>
