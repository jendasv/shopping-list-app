<template>
  <div class="py-4">
    <!-- Header -->
    <div class="flex items-center gap-3 mb-6">
      <RouterLink :to="{ name: 'home' }" class="text-gray-400 hover:text-black transition" title="Back">
        <ArrowLeft customClass="w-6 h-6" />
      </RouterLink>
      <h1 class="text-2xl font-bold">New list</h1>
    </div>

    <!-- List name -->
    <div class="mb-6">
      <label class="block text-sm font-medium mb-1">List name</label>
      <input
        v-model="shoppingListName"
        type="text"
        placeholder="e.g. Weekly shopping"
        class="input-field"
        @input="error = ''"
      />
    </div>

    <HandDrawnDivider class="mb-5" />

    <!-- Items -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-sm font-semibold">Items</h2>
        <button
          v-if="!showItemAddForm"
          @click="showItemAddForm = true"
          class="text-sm text-gray-500 hover:text-black underline transition"
        >
          + Add item
        </button>
      </div>

      <AddItemForm @add="addItem" v-model:showAddForm="showItemAddForm" />

      <ul v-if="items.length" class="space-y-2 mt-3">
        <li
          v-for="item in items"
          :key="item.id"
          class="flex items-center justify-between border-2 border-black rounded-md px-3 py-2 text-sm"
        >
          <span :class="item.isCompleted ? 'line-through text-gray-400' : ''">
            <Typewrite v-if="item.isNew" :text="item.name + ' — ' + item.quantity + 'x'" @done="item.isNew = false" />
            <span v-else>{{ item.name }} — {{ item.quantity }}x</span>
          </span>
          <button @click="removeItem(item.id)" class="text-red-400 hover:text-red-600 text-xl leading-none ml-2">×</button>
        </li>
      </ul>
      <p v-else-if="!showItemAddForm" class="text-sm text-gray-400 mt-2">No items yet.</p>
    </div>

    <HandDrawnDivider class="mb-5" />

    <!-- Visibility -->
    <div class="mb-6">
      <HandDrawnCheckbox v-model="isShared">
        Share with household
      </HandDrawnCheckbox>
      <p class="text-xs text-gray-400 mt-1 ml-9">Shared lists are visible to all household members.</p>
    </div>

    <AlertMessage v-if="error" type="error" :message="error" />
    <AlertMessage v-if="success" type="success" :message="success" />

    <div class="flex justify-end mt-4">
      <button
        @click="createShoppingList"
        :disabled="!shoppingListName.trim()"
        class="btn-primary"
      >
        Create list
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { iItem } from '@/types'
import { createList } from '@/services/shoppingListService'
import AddItemForm from '@/components/form/AddItemForm.vue'
import AlertMessage from '@/components/elements/AlertMessage.vue'
import HandDrawnCheckbox from '@/components/elements/form/HandDrawnCheckbox.vue'
import HandDrawnDivider from '@/components/elements/HandDrawnDivider.vue'
import ArrowLeft from '@/components/icons/ArrowLeft.vue'
import Typewrite from '@/components/animations/Typewrite.vue'

const router = useRouter()

const shoppingListName = ref('')
const isShared = ref(false)
const items = ref<iItem[]>([])
const showItemAddForm = ref(false)
const error = ref('')
const success = ref('')

function addItem(item: iItem) {
  items.value.push(item)
}

function removeItem(id: number) {
  items.value = items.value.filter((i) => i.id !== id)
}

async function createShoppingList() {
  if (!shoppingListName.value.trim()) {
    error.value = 'List name is required.'
    return
  }
  try {
    await createList(shoppingListName.value.trim(), isShared.value ? 'shared' : 'private', items.value)
    router.push({ name: 'home' })
  } catch (e) {
    console.error(e)
    error.value = 'Failed to create list.'
  }
}
</script>

