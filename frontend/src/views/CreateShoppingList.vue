<script setup lang="ts">
import HandDrawnDivider from "@/components/elements/HandDrawnDivider.vue";
import { ref } from 'vue'
import AddItemForm from '@/components/form/AddItemForm.vue'
import type { iItem, iNewList, iShoppingList } from '@/types'
import ArrowLeft from "@/components/icons/ArrowLeft.vue";
import Typewrite from "@/components/animations/Typewrite.vue";
import {useRoute} from "vue-router";
import AlertMessage from "@/components/elements/AlertMessage.vue";
import IconPlusCircle from "@/components/icons/IconPlusCircle.vue";
import {apiFetch} from "@/serivices/api.ts";

interface iNewList {
  name: string
  items: iItem[]
}

const router = useRoute()
const shoppingListName = ref('')
const items = ref<iItem[]>([])
const showItemAddForm = ref(false)
const error = ref('')
const success = ref('')

function addItem(item: iItem) {
  items.value.push(item)
}

function removeItem(id: number) {
  items.value = items.value.filter(i => i.id !== id)
}

async function createShoppingList() {
  if (!shoppingListName.value.trim()) {
    error.value = 'List name is required'
    return
  }

  const newList: iNewList = {
    name: shoppingListName.value,
    items: items.value
  }

  try {
    await apiFetch('/lists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: shoppingListName.value,
        items: items.value
      })
    })

    shoppingListName.value = ''
    items.value = []
    error.value = ''

    success.value = 'Shopping list created successfully'
  } catch (e) {
    console.error(e)
    error.value = 'Failed to create shopping list'
  }
}
</script>

<template>
  <div class="arrow-back">
    <router-link title="Back" class="text-gray-900 text-2xl" :to="{name: 'home'}">
      <ArrowLeft customClass="w-10 h-10"/>
    </router-link>
  </div>
  <div class="p-6 max-w-2xl mx-auto">
    <h1 class="text-4xl text-center mb-8">Create Shopping List</h1>

    <p class="text-gray-900 text-left text-xl mb-8">
      You can also create a shopping list with items. Create your items first.
    </p>

    <!-- LIST NAME -->
    <div class="flex flex-col mb-2 text-2xl">
      <label class="text-gray-900 mb-1">List name:
      <input
        v-model="shoppingListName"
        type="text"
        placeholder="My shopping list"
        class="p-2 text-gray-900 focus:outline-none"
        @input="error = ''"
      />
      </label>
    </div>

    <HandDrawnDivider variant="default" customClass="hidden mb-4"/>

    <!-- ITEMS -->
    <div class="relative">
      <h2 class="text-2xl pt-2">Items</h2>
      <a
        v-if="!showItemAddForm"
        class="add-list-btn absolute top-0 right-0"
        title="New list's item"
        href="#"
        @click.prevent="showItemAddForm = !showItemAddForm"
      ><IconPlusCircle sizeClass="w-13 h-13"  /></a>
      <AddItemForm @add="addItem" v-model:showAddForm="showItemAddForm"/>

      <ul class="text-2xl mb-4 mt-4">
        <li v-for="item in items" :key="item.id" class="flex justify-between items-center mb-2">
          <span :class="item.isCompleted ? 'line-through' : ''">
            <Typewrite v-if="item.isNew" :text="item.name + ' - ' + item.quantity + 'x'" @done="item.isNew = false"/>
            <span v-else>
              {{ item.name }} - {{ item.quantity }}x
            </span>
          </span>
<!--          <button @click="removeItem(item.id)" class="text-red-500">x</button>-->
          <a
            href="#" @click.prevent="removeItem(item.id)"
            class="text-red-500 text-3xl hover:scale-110 transition pl-2"
          > x
          </a>
        </li>
      </ul>
    </div>

    <HandDrawnDivider variant="low-wave" customClass="mb-4"/>
    <!-- SUBMIT WHOLE LIST -->
    <div class="flex mt-4">
      <button
        @click="createShoppingList"
        class="ml-auto mb-4 text-3xl cursor-pointer transition duration-200 hover:scale-105"
        :disabled="!shoppingListName.trim()"
      >
        Create List
      </button>
    </div>
    <!-- ERROR -->
   <AlertMessage :message="error" type="error"/>
   <AlertMessage :message="success" type="success"/>
  </div>
</template>



