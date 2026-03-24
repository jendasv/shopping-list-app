<template>
  <Transition name="unroll">
  <form @submit.prevent="onSubmit" v-if="showAddForm" class="relative mb-4 flex flex-col gap-4 w-full">
    <HandDrawnClose title="Close form" :modelValue="showAddForm" @update:modelValue="val => emit('update:showAddForm', val)"/>
    <!-- NAME -->
    <div class="flex flex-col text-xl">
      <label class="text-gray-900 mb-1">Name
        <input
          v-model="item.name"
          type="text"
          placeholder="Item name"
          class="p-2 focus:outline-none focus:border-gray-600 text-gray-900"
          @input="error = ''"
        />
      </label>
    </div>

    <!-- QUANTITY -->
    <div class="flex flex-col text-xl">
      <label class="text-gray-900 mb-1">Quantity
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
        Already bought?
      </HandDrawnCheckbox>
    </div>

    <!-- SUBMIT -->
    <div class="flex">
      <button
        type="submit"
        class="mt-4 ml-auto text-gray-900 hover:text-gray-600 text-2xl flex items-center gap-2 cursor-pointer transition duration-200 hover:scale-105"
        :disabled="!item.name.trim()"
      >
        Add item
      </button>
    </div>

    <!-- ERROR -->
    <div v-if="error">
      <span class="text-red-500 text-sm">{{ error }}</span>
    </div>
  </form>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { iItem } from '@/types'
import HandDrawnCheckbox from "@/components/elements/form/HandDrawnCheckbox.vue";
import HandDrawnClose from "@/components/icons/HandDrawnClose.vue";

const emit = defineEmits<{
  (e: 'update:showAddForm', value: boolean): void
  (e: 'add', item: iItem): void
}>()

const props = defineProps<{
  showAddForm: Boolean
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

function onSubmit() {
  if (!item.value.name.trim()) {
    error.value = 'Name is required'
    return
  }
  if (item.value.quantity <= 0) {
    error.value = 'Quantity must be greater than 0'
    return
  }

  emit('add', { ...item.value }) // pošli kopii itemu
  // reset formu
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
