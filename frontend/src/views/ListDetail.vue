<template>
  <div class="py-4">
    <!-- Header -->
    <div class="flex items-center gap-3 mb-6">
      <RouterLink :to="{ name: 'home' }" class="text-gray-400 hover:text-black transition shrink-0" :title="$t('common.back')">
        <ArrowLeft customClass="w-6 h-6" />
      </RouterLink>
      <h1 v-if="list" class="text-2xl font-bold flex-1 text-center truncate">{{ list.name }}</h1>
      <button
        v-if="!showItemAddForm"
        @click="showItemAddForm = true"
        class="shrink-0 text-sm text-gray-500 hover:text-black underline transition"
      >
        + {{ $t('items.addItem') }}
      </button>
    </div>

    <p v-if="isLoading" class="text-sm text-gray-400 text-center mt-10">{{ $t('common.loading') }}</p>

    <div v-else-if="list">
      <!-- Add item form -->
      <AddItemForm @add="addItem" v-model:showAddForm="showItemAddForm" :listType="list.listType" />

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
          v-for="(item, i) in list.items"
          :key="item.id"
          class="list-stagger-item group flex items-center justify-between transition-[opacity,transform] duration-[280ms] ease-in-out"
          :class="animatingItemId === item.id ? 'opacity-0 scale-95' : ''"
          :style="{ '--i': i }"
        >
          <template v-if="editingItemId !== item.id">
            <span class="drag-handle cursor-grab active:cursor-grabbing text-gray-200 group-hover:text-gray-400 mr-2 shrink-0 text-2xl leading-none select-none transition-colors">⠿</span>
            <button
              class="flex-1 text-left text-2xl transition hover:text-gray-600 hover:scale-105 duration-200"
              :class="item.isCompleted ? 'text-gray-400' : ''"
              @click="handleSetComplete(list.id, item.id, item.isCompleted)"
            >
              <Typewrite v-if="item.isNew" :text="formatItem(item, list.listType)" @done="item.isNew = false" />
              <HandDrawnStrikethrough v-else-if="item.isCompleted" :seed="item.id">{{ formatItem(item, list.listType) }}</HandDrawnStrikethrough>
              <span v-else>{{ formatItem(item, list.listType) }}</span>
            </button>

            <RowActions>
              <template #menu="{ close }">
                <button @click="startEdit(item); close()" class="w-full px-4 py-3 text-left text-xl hover:bg-gray-50 transition-colors">{{ $t('common.edit') }}</button>
                <button @click="removeItemFromList(list.id, item.id); close()" class="w-full px-4 py-3 text-left text-xl text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100">{{ $t('common.delete') }}</button>
              </template>
            </RowActions>
          </template>

          <form v-else @submit.prevent="saveItem(list.id, item)" class="flex items-center gap-2 w-full">
            <input
              v-model="item.name"
              type="text"
              class="flex-1 border-b-2 border-black text-base px-1 py-1 outline-none"
              v-focus-end
            />
            <input
              v-model.number="item.quantity"
              type="number"
              min="1"
              class="w-14 border-b-2 border-black text-base px-1 py-1 outline-none"
            />
            <button type="submit" class="text-base font-medium text-green-700 px-1 py-0.5 cursor-pointer">{{ $t('common.save') }}</button>
            <button type="button" @click="editingItemId = null" class="text-base text-gray-400 px-1 py-0.5 cursor-pointer">{{ $t('common.cancel') }}</button>
          </form>
        </li>
      </VueDraggablePlus>

      <p v-else class="text-sm text-gray-400 text-center mt-6">
        {{ $t('items.noItemsAdd') }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { VueDraggable as VueDraggablePlus } from 'vue-draggable-plus'
import { useListDetail } from '@/composables/useListDetail'
import { reorderItems } from '@/services/listService'
import AddItemForm from '@/components/form/AddItemForm.vue'
import AlertMessage from '@/components/elements/AlertMessage.vue'
import HandDrawnDivider from '@/components/elements/HandDrawnDivider.vue'
import ArrowLeft from '@/components/icons/ArrowLeft.vue'
import Typewrite from '@/components/animations/Typewrite.vue'
import HandDrawnStrikethrough from '@/components/animations/HandDrawnStrikethrough.vue'
import RowActions from '@/components/ui/RowActions.vue'
import type { iItem, ListType } from '@/types'

function formatItem(item: iItem, listType: ListType): string {
  if (listType === 'todo') return item.name
  if (!item.quantity) return item.name
  if (item.unit?.symbol) return `${item.name} ${item.quantity} ${item.unit.symbol}`
  return item.quantity > 1 ? `${item.name} — ${item.quantity}×` : item.name
}

const route = useRoute()
const id = route.params.id as string
const showItemAddForm = ref(false)

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
