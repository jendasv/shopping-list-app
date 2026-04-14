<template>
  <Transition name="unroll">
  <form @submit.prevent="onSubmit" v-if="showAddForm" class="relative mb-4 flex flex-col gap-4 w-full">
    <HandDrawnClose :title="$t('items.closeForm')" :modelValue="showAddForm" @update:modelValue="val => emit('update:showAddForm', val)"/>
    <!-- NAME -->
    <div class="flex flex-col text-xl">
      <label class="text-gray-900 mb-1">{{ $t('items.name') }}
        <input
          v-model="item.name"
          type="text"
          :placeholder="$t('items.namePlaceholder')"
          class="px-2 pt-2 focus:outline-none focus:border-gray-600 text-gray-900"
          @input="error = ''"
        />
      </label>
    </div>

    <!-- QUANTITY -->
    <div class="flex flex-col text-xl">
      <label class="text-gray-900 mb-1">{{ $t('items.quantity') }}
        <input
          v-model.number="item.quantity"
          type="number"
          min="1"
          placeholder="1"
          class="w-20 p-2 text-gray-900 focus:outline-none"
          @input="error = ''"
        />
      </label>
    </div>

    <!-- CHECKBOX -->
    <div class="flex items-center gap-2">
      <HandDrawnCheckbox v-model="item.isCompleted" sizeClass="w-7 h-7">
        {{ $t('items.fulfilled') }}
      </HandDrawnCheckbox>
    </div>

    <!-- ERROR -->
    <p v-if="error" class="text-red-500 text-base">{{ error }}</p>

    <!-- SUBMIT -->
    <div class="flex">
      <button
        type="submit"
        class="mt-4 ml-auto text-gray-900 hover:text-gray-600 text-2xl flex items-center gap-2 cursor-pointer transition duration-200 hover:scale-105"
        :class="{ shake: shaking }"
      >
        {{ $t('items.addItem') }}
      </button>
    </div>
  </form>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { iItem } from '@/types'
import HandDrawnCheckbox from "@/components/elements/form/HandDrawnCheckbox.vue";
import HandDrawnClose from "@/components/icons/HandDrawnClose.vue";

const { t } = useI18n()

const emit = defineEmits<{
  (e: 'update:showAddForm', value: boolean): void
  (e: 'add', item: iItem): void
}>()

defineProps<{
  showAddForm: boolean
}>()

const item = ref<iItem>({
  id: Date.now(),
  name: '',
  quantity: 1,
  isCompleted: false,
  shoppingListId: 0,
  isNew: true
})

const error = ref('')
const shaking = ref(false)

function triggerShake() {
  shaking.value = true
  setTimeout(() => { shaking.value = false }, 500)
}

function onSubmit() {
  if (!item.value.name.trim()) {
    error.value = t('items.errors.nameRequired')
    triggerShake()
    return
  }
  if (item.value.quantity <= 0) {
    error.value = t('items.errors.quantityInvalid')
    triggerShake()
    return
  }

  emit('add', { ...item.value })
  item.value = {
    id: Date.now(),
    name: '',
    quantity: 1,
    isCompleted: false,
    shoppingListId: 0,
    isNew: true
  }
  error.value = ''
}
</script>

<style scoped>
@keyframes shake {
  0%   { transform: translateX(0); }
  20%  { transform: translateX(-8px); }
  40%  { transform: translateX(8px); }
  60%  { transform: translateX(-6px); }
  80%  { transform: translateX(4px); }
  100% { transform: translateX(0); }
}

.shake {
  animation: shake 0.5s ease-in-out;
}
</style>
