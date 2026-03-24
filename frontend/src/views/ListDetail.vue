<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ArrowLeft from "@/components/icons/ArrowLeft.vue";
import type {iShoppingList, iItem} from "@/types/index.ts"
import HandDrawnDivider from "@/components/elements/HandDrawnDivider.vue";
import IconPlusCircle from "@/components/icons/IconPlusCircle.vue";
import Typewrite from "@/components/animations/Typewrite.vue";
import AddItemForm from "@/components/form/AddItemForm.vue";
import AlertMessage from "@/components/elements/AlertMessage.vue";
import HandDrawnPencil from "@/components/icons/HandDrawnPencil.vue";
import {apiFetch} from "@/serivices/api.ts";

const route = useRoute()
const id = route.params.id as string
const list = ref<iShoppingList | null>(null)
const error = ref<string>('')
const showItemAddForm = ref<boolean>(false)
const editingItemId = ref<number | null>(null)


interface iItemInput {
  name: string
  quantity: number
  isCompleted: boolean
}

const newItem = ref<iItemInput>({
  name: '',
  quantity: 1,
  isCompleted: false
})

onMounted(async () => {
  try {
    list.value =  await apiFetch<iShoppingList>(`/lists/${id}/items`, {
      method: 'GET',
    })

  } catch (error: any) {
    console.error('Failed to remove item:', e)
  }
})

async function removeItemFromList(listId: number, itemId: number) {
  if (!list.value) return
  try {
    await apiFetch(`/lists/${listId}/items/${itemId}`, {
      method: 'DELETE',
    })

    list.value.items = list.value.items.filter((item: iItem) => item.id !== itemId)
  } catch (e) {
    console.error('Failed to remove item:', e)
    error.value = 'Failed to add item. Try again.'
  }
}

async function setComplete(listId: number, itemId: number, isCompleted: boolean) {
  try {
    await apiFetch<iItem>(`/lists/${listId}/items/${itemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        'isCompleted': !isCompleted,
      })
    })

    list.value.items = list.value.items.map((item: iItem) => {
      if (item.id === itemId) {
        return { ...item, isCompleted: !isCompleted }
      }
      return item
    })
  } catch (e) {
    console.error('Failed to remove item:', e)
    error.value = 'Failed to add item. Try again.'
  }
}
async function addItem(item: iItem) {
  const name: string = item.name.trim()
  // return
  if (!name) {
    error.value = 'Please enter a item name!'
    return
  }

  if (newItem.value.quantity < 1) {
    error.value = 'Please enter a quantity greater than 0!'
    return
  }

  try {
    const data: iShoppingList = await apiFetch<iShoppingList>(`/lists/${id}/item`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        quantity: item.quantity,
        isCompleted: item.isCompleted
      })
    })

    const items: iItem[] = data.items

    const lastItem: iItem = items[items.length - 1]
    lastItem.isNew = true

    list.value.items.push(lastItem)
  } catch (e) {
    console.error('Failed to add item:', e)
    error.value = 'Failed to add item. Try again.'
  }

  return;
}

function startEdit(item: iItem) {
  editingItemId.value = item.id
}

async function updateItem(listId: number, item: iItem) {

  if (!item.name.trim()) {
    error.value = 'Please enter a item name!'
    return
  }

  if (item.quantity < 1) {
    error.value = 'Please enter a quantity greater than 0!'
    return
  }
  try {
    await apiFetch(`/lists/${listId}/items/${item.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: item.name,
        quantity: item.quantity,
        isCompleted: item.isCompleted
      })
    })

    item.isNew = true
    editingItemId.value = null
  } catch (e) {
    console.error('Failed to update item:', e)
    error.value = 'Failed to update item. Try again.'
    editingItemId.value = null
  }
}
</script>
<template>

  <div class="arrow-back">
    <router-link title="Back" class="text-gray-900 text-2xl" :to="{name: 'home'}">
      <ArrowLeft customClass="w-10 h-10"/>
    </router-link>
  </div>

  <a
    v-if="!showItemAddForm"
    class="add-list-btn absolute top-5 right-5"
    title="New list's item"
    href="#"
    @click.prevent="showItemAddForm = !showItemAddForm"
  ><IconPlusCircle sizeClass="w-13 h-13"  /></a>

  <h1 v-if="list" class="text-4xl text-center text-gray-900 mb-10">
    {{list.name}}
  </h1>

  <AddItemForm @add="addItem" v-model:showAddForm="showItemAddForm" />

  <AlertMessage v-if="error" :message="error" type="error"/>

  <div  v-else-if="list" class="list">
    <HandDrawnDivider variant="low-wave"/>
    <ul class="text-2xl space-y-6">
      <template v-if="list.items && list.items.length">
      <li
        v-for="item in list.items"
        :key="item.id"
        class="text-gray-900 flex justify-between items-center mb-3"
        :data-isComplete="item.isCompleted? 1:0"
      >
        <a
          v-if="editingItemId !== item.id"
          :class="[item.isCompleted ? 'line-through' : '', 'item hover:text-gray-600 transition duration-200 hover:scale-105']"
          href="#"
          @click.prevent="setComplete(list.id, item.id, item.isCompleted)"
        >
          <Typewrite v-if="item.isNew" :text="item.name + ' - ' + item.quantity + 'x'" @done="item.isNew = false"/>
          <span v-else>
            {{ item.name }} - {{ item.quantity }}x
          </span>
        </a>

        <form
          v-else
          @submit.prevent="updateItem(list.id, item)"
          class="flex items-center gap-2"
        >
          <input
            v-model="item.name"
            type="text"
            class="border-b p-1 text-xl focus:outline-none"
          />

          <input
            v-model.number="item.quantity"
            type="number"
            min="1"
            class="w-16 border-b p-1 text-xl focus:outline-none"
          />

          <button type="submit" class="text-green-600 cursor-pointer">✔</button>
        </form>
        <div class="controls flex items-center gap-2">
          <a href="#" @click.prevent="startEdit(item)" class="hover:scale-110 transition">
            <HandDrawnPencil sizeClass="w-9 h-9" />
          </a>
          <a
            href="#"
            @click.prevent="removeItemFromList(list.id, item.id)"
            class="text-red-500 text-3xl hover:scale-110 transition"
          >
            ×
          </a>
        </div>

      </li>
      </template>
      <li v-else>
        Your list is empty at this moment.
      </li>
    </ul>
  </div>
</template>

<style>
.line-through {
  text-decoration: line-through;
}
</style>
