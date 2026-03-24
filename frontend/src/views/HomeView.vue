<script setup lang="ts">
import {RouterLink} from "vue-router";
import {ref, onMounted} from "vue";
import ArrowDown from "@/components/icons/ArrowDown.vue";
import IconPlusCircle from "@/components/icons/IconPlusCircle.vue";
import type {iShoppingList} from "@/types/index.ts"
import HandDrawnDivider from "@/components/elements/HandDrawnDivider.vue";
import Typewrite from "@/components/animations/Typewrite.vue";
import {apiFetch} from "@/serivices/api.ts";

const lists = ref<iShoppingList[]>([])
const newListName = ref<string>('')
const error = ref<string>('')

onMounted(async () => {
  try {
    const data = await apiFetch<iShoppingList[]>('/lists', {
      method: 'GET',
    })

    lists.value = data
  } catch (error) {
    console.error('Error during list loading:', error)
    lists.value = []
  }
})


async function remove(id: number) {
  await apiFetch<void>(`/lists/${id}`, {
    method: 'DELETE',
  })
  lists.value = lists.value.filter((list: iShoppingList) => list.id !== id);
}

async function addList() {

  const name = newListName.value.trim()  // odstraní bílé znaky na začátku/konci

  if (!name || name.length < 3) {
    error.value = 'Please enter a list name!'
    return
  }

  try {
    const data: iShoppingList = await apiFetch<iShoppingList>('/lists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    })
    lists.value.push({
      id: data.id,
      name: data.name,
      isNew: true,
      items: [],
    })

    newListName.value = ''
  } catch (error: any) {
    console.error('Failed to create list:', error)
    error.value = 'Failed to create list. Try again.'
  }

}
</script>

<template>
  <span
    class="add-list-btn absolute top-5 right-5"
  >
    <router-link title="New list with item" class="text-gray-900 text-2xl" :to="{name: 'new-list'}">
      <IconPlusCircle sizeClass="w-13 h-13"  />
    </router-link>
  </span>

  <h1 class="text-gray-900 text-4xl text-center mb-10">
    Shopping lists
  </h1>

  <p class="text-gray-900 text-2xl text-center mb-10">
    Create your own shopping list and you will never forget anything again! Only if you forget to write it here.
  </p>
  <HandDrawnDivider variant="low-wave" customClass="hidden mb-6"/>
  <form @submit.prevent="addList" class="hidden mb-8">
    <div class="">
      <label for="newListName" class="flex items-center gap-4 ">
        <span class="flex-1">Fast list creating:</span>
        <input
          v-model="newListName"
          name="newListName"
          type="text"
          class="w-80 p-2 border-b border-gray-300 rounded-none focus:outline-none focus:border-gray-600 text-gray-900"
          placeholder="New list name"
          @input="error = ''"
        />
        <button
          type="submit"
          class="text-gray-900 hover:text-gray-600 transition text-2xl cursor-pointer"
          title="Create new list"
          :disabled="!newListName.trim()"
        >
          <ArrowDown customClass="w-8 h-8"/>
        </button>
      </label>

    </div>
    <div v-if="error" class="mt-1 pl-30">
      <span  class="text-red-500 text-sm">{{ error }}</span>
    </div>
  </form>
  <HandDrawnDivider/>
  <ul class="space-y-4 text-2xl">
    <li
      v-for="list in lists"
      :key="list.id"

    >
      <article class="flex justify-between items-center text-gray-900">
        <span class="cursor-pointer hover:text-gray-600 transition duration-200 hover:scale-105">
          <router-link title="List detail" :to="{ name: 'list-detail', params: { id: list.id } }">
            <Typewrite v-if="list.isNew" :text="list.name" @done="list.isNew = false"/>
            <span v-else>
              {{ list.name }}
            </span>
          </router-link>
        </span>

        <a
          class="text-red-500 text-xl hover:scale-110 transition"
          @click.prevent="remove(list.id)"
          href="#"
        >
          X
        </a>
      </article>

    </li>
  </ul>
</template>

<style scoped lang="scss">

</style>
