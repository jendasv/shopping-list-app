<template>
  <div class="py-4">
    <!-- Header -->
    <div class="flex items-center gap-3 mb-6">
      <RouterLink :to="{ name: 'home' }" class="text-gray-400 hover:text-black transition" title="Back">
        <ArrowLeft customClass="w-6 h-6" />
      </RouterLink>
      <h1 v-if="list" class="text-2xl font-bold flex-1 truncate">{{ list.name }}</h1>
      <button
        v-if="!showItemAddForm"
        @click="showItemAddForm = true"
        class="shrink-0 text-sm text-gray-500 hover:text-black underline transition"
      >
        + Add item
      </button>
    </div>

    <p v-if="isLoading" class="text-sm text-gray-400 text-center mt-10">Loading...</p>

    <div v-else-if="list">
      <!-- Add item form -->
      <AddItemForm @add="addItem" v-model:showAddForm="showItemAddForm" />

      <AlertMessage v-if="error" :message="error" type="error" />

      <HandDrawnDivider class="my-4" />

      <!-- Items -->
      <ul v-if="list.items && list.items.length" class="space-y-2">
        <li
          v-for="item in list.items"
          :key="item.id"
          class="flex items-center justify-between border-2 rounded-md px-3 py-2 transition-colors"
          :class="item.isCompleted ? 'border-gray-200 bg-gray-50' : 'border-black'"
        >
          <template v-if="editingItemId !== item.id">
            <button
              class="flex-1 text-left text-sm transition"
              :class="item.isCompleted ? 'line-through text-gray-400' : ''"
              @click="setComplete(list.id, item.id, item.isCompleted)"
            >
              <Typewrite v-if="item.isNew" :text="item.name + ' — ' + item.quantity + 'x'" @done="item.isNew = false" />
              <span v-else>{{ item.name }} — {{ item.quantity }}x</span>
            </button>
            <div class="flex items-center gap-2 ml-2 shrink-0">
              <button @click="startEdit(item)" class="text-gray-400 hover:text-black transition" title="Edit">
                <HandDrawnPencil sizeClass="w-5 h-5" />
              </button>
              <button @click="removeItemFromList(list.id, item.id)" class="text-red-400 hover:text-red-600 text-xl leading-none transition" title="Delete">×</button>
            </div>
          </template>

          <form v-else @submit.prevent="saveItem(list.id, item)" class="flex items-center gap-2 w-full">
            <input
              v-model="item.name"
              type="text"
              class="flex-1 border-b-2 border-black text-sm px-1 py-0.5 outline-none"
              autofocus
            />
            <input
              v-model.number="item.quantity"
              type="number"
              min="1"
              class="w-14 border-b-2 border-black text-sm px-1 py-0.5 outline-none"
            />
            <button type="submit" class="text-sm font-medium text-green-700">Save</button>
            <button type="button" @click="editingItemId = null" class="text-sm text-gray-400">Cancel</button>
          </form>
        </li>
      </ul>

      <p v-else class="text-sm text-gray-400 text-center mt-6">
        No items yet. Add your first above.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useListDetail } from '@/composables/useListDetail'
import AddItemForm from '@/components/form/AddItemForm.vue'
import AlertMessage from '@/components/elements/AlertMessage.vue'
import HandDrawnDivider from '@/components/elements/HandDrawnDivider.vue'
import ArrowLeft from '@/components/icons/ArrowLeft.vue'
import HandDrawnPencil from '@/components/icons/HandDrawnPencil.vue'
import Typewrite from '@/components/animations/Typewrite.vue'

const route = useRoute()
const id = route.params.id as string
const showItemAddForm = ref(false)

const { list, error, isLoading, editingItemId, removeItemFromList, setComplete, addItem, startEdit, saveItem } = useListDetail(id)
</script>
