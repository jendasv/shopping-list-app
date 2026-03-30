<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import ArrowDown from '@/components/icons/ArrowDown.vue'
import IconPlusCircle from '@/components/icons/IconPlusCircle.vue'
import HandDrawnDivider from '@/components/elements/HandDrawnDivider.vue'
import Typewrite from '@/components/animations/Typewrite.vue'
import HandDrawnPencil from '@/components/icons/HandDrawnPencil.vue'
import { useShoppingLists } from '@/composables/useShoppingLists'

const newListName = ref<string>('')
const { lists, error, isLoading, editingListId, startEditList, saveListName, addList, removeList } = useShoppingLists()

async function submitAddList() {
  await addList(newListName.value)
  newListName.value = ''
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
  <form @submit.prevent="submitAddList" class="hidden mb-8">
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
  <p v-if="isLoading" class="text-center text-gray-400 text-2xl mt-6">Loading...</p>
  <ul v-else class="space-y-4 text-2xl">
    <li
      v-for="list in lists"
      :key="list.id"

    >
      <article class="flex justify-between items-center text-gray-900">
        <span v-if="editingListId !== list.id" class="cursor-pointer hover:text-gray-600 transition duration-200 hover:scale-105">
          <router-link title="List detail" :to="{ name: 'list-detail', params: { id: list.id } }">
            <Typewrite v-if="list.isNew" :text="list.name" @done="list.isNew = false"/>
            <span v-else>
              {{ list.name }}
            </span>
          </router-link>
        </span>

        <form
          v-else
          @submit.prevent="saveListName(list)"
          class="flex items-center gap-2"
        >
          <input
            v-model="list.name"
            type="text"
            class="border-b p-1 text-xl focus:outline-none"
          />
          <button type="submit" class="text-green-600 cursor-pointer">✔</button>
        </form>

        <div class="controls flex items-center gap-2">
          <a href="#" @click.prevent="startEditList(list)" class="hover:scale-110 transition">
            <HandDrawnPencil sizeClass="w-9 h-9" />
          </a>
          <a
            class="text-red-500 text-xl hover:scale-110 transition"
            @click.prevent="removeList(list.id)"
            href="#"
          >
            ×
          </a>
        </div>
      </article>

    </li>
  </ul>
</template>

<style scoped lang="scss">

</style>
