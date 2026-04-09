<template>
  <div class="py-4">
    <div v-if="menuOpenItemId !== null" class="fixed inset-0 z-10" @click="closeMenu()" />
    <!-- Header -->
    <div class="flex items-center gap-3 mb-6">
      <RouterLink :to="{ name: 'home' }" class="text-gray-400 hover:text-black transition shrink-0" title="Back">
        <ArrowLeft customClass="w-6 h-6" />
      </RouterLink>
      <h1 v-if="list" class="text-2xl font-bold flex-1 text-center truncate">{{ list.name }}</h1>
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
      <VueDraggablePlus
        v-if="list.items && list.items.length"
        v-model="list.items"
        tag="ul"
        class="space-y-3"
        handle=".drag-handle"
        @end="onReorderItems"
      >
        <li
          v-for="item in list.items"
          :key="item.id"
          class="group flex items-center justify-between transition-[opacity,transform] duration-[280ms] ease-in-out"
          :class="animatingItemId === item.id ? 'opacity-0 scale-95' : ''"
        >
          <template v-if="editingItemId !== item.id">
            <span class="drag-handle cursor-grab active:cursor-grabbing text-gray-200 group-hover:text-gray-400 mr-2 shrink-0 text-2xl leading-none select-none transition-colors">⠿</span>
            <button
              class="flex-1 text-left text-2xl transition hover:text-gray-600 hover:scale-105 duration-200"
              :class="item.isCompleted ? 'text-gray-400' : ''"
              @click="handleSetComplete(list.id, item.id, item.isCompleted)"
            >
              <Typewrite v-if="item.isNew" :text="item.quantity > 1 ? item.name + ' — ' + item.quantity + 'x' : item.name" @done="item.isNew = false" />
              <HandDrawnStrikethrough v-else-if="item.isCompleted" :seed="item.id">{{ item.name }}{{ item.quantity > 1 ? ' — ' + item.quantity + 'x' : '' }}</HandDrawnStrikethrough>
              <span v-else>{{ item.name }}{{ item.quantity > 1 ? ' — ' + item.quantity + 'x' : '' }}</span>
            </button>

            <RowActions :id="item.id" :open="menuOpenItemId === item.id" @toggle="toggleMenu" @close="closeMenu">
              <template #desktop>
                <button @click="startEdit(item)" class="text-gray-400 hover:text-black transition" title="Edit">
                  <HandDrawnPencil sizeClass="w-11 h-11" />
                </button>
                <button @click="removeItemFromList(list.id, item.id)" class="text-red-400 hover:text-red-600 text-4xl leading-none transition cursor-pointer" title="Delete">×</button>
              </template>
              <template #menu>
                <button @click="startEdit(item); closeMenu()" class="w-full px-4 py-3 text-left text-xl hover:bg-gray-50 transition-colors">Edit</button>
                <button @click="removeItemFromList(list.id, item.id); closeMenu()" class="w-full px-4 py-3 text-left text-xl text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100">Delete</button>
              </template>
            </RowActions>
          </template>

          <form v-else @submit.prevent="saveItem(list.id, item)" class="flex items-center gap-2 w-full">
            <input
              v-model="item.name"
              type="text"
              class="flex-1 border-b-2 border-black text-base px-1 py-1 outline-none"
              autofocus
            />
            <input
              v-model.number="item.quantity"
              type="number"
              min="1"
              class="w-14 border-b-2 border-black text-base px-1 py-1 outline-none"
            />
            <button type="submit" class="text-base font-medium text-green-700 px-1 py-0.5 cursor-pointer">Save</button>
            <button type="button" @click="editingItemId = null" class="text-base text-gray-400 px-1 py-0.5 cursor-pointer">Cancel</button>
          </form>
        </li>
      </VueDraggablePlus>

      <p v-else class="text-sm text-gray-400 text-center mt-6">
        No items yet. Add your first above.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { VueDraggable as VueDraggablePlus } from 'vue-draggable-plus'
import { useListDetail } from '@/composables/useListDetail'
import { reorderItems } from '@/services/shoppingListService'
import AddItemForm from '@/components/form/AddItemForm.vue'
import AlertMessage from '@/components/elements/AlertMessage.vue'
import HandDrawnDivider from '@/components/elements/HandDrawnDivider.vue'
import ArrowLeft from '@/components/icons/ArrowLeft.vue'
import HandDrawnPencil from '@/components/icons/HandDrawnPencil.vue'
import Typewrite from '@/components/animations/Typewrite.vue'
import HandDrawnStrikethrough from '@/components/animations/HandDrawnStrikethrough.vue'
import RowActions from '@/components/ui/RowActions.vue'
import { useContextMenu } from '@/composables/useContextMenu'

const route = useRoute()
const id = route.params.id as string
const showItemAddForm = ref(false)
const { menuOpenId: menuOpenItemId, toggleMenu, closeMenu } = useContextMenu()

const { list, error, isLoading, editingItemId, removeItemFromList, setComplete, addItem, startEdit, saveItem } = useListDetail(id)

const animatingItemId = ref<number | null>(null)

async function handleSetComplete(listId: number, itemId: number, isCompleted: boolean) {
  animatingItemId.value = itemId
  await new Promise((r) => setTimeout(r, 280))
  await setComplete(listId, itemId, isCompleted)
  await nextTick()
  await new Promise((r) => setTimeout(r, 16))
  animatingItemId.value = null
}

async function onReorderItems() {
  if (!list.value) return
  await reorderItems(list.value.id, list.value.items.map((i) => i.id))
}
</script>
