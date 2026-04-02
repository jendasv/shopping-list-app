<template>
  <div class="py-4">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">My lists</h1>
      <RouterLink :to="{ name: 'new-list' }" class="btn-primary">+ New list</RouterLink>
    </div>

    <p v-if="isLoading" class="text-sm text-gray-400 text-center mt-10">Loading...</p>

    <ul v-else-if="lists.length" class="space-y-2">
      <li
        v-for="list in lists"
        :key="list.id"
        class="flex items-center justify-between border-2 border-black rounded-md px-3 py-2"
      >
        <template v-if="editingListId !== list.id">
          <RouterLink
            :to="{ name: 'list-detail', params: { id: list.id } }"
            class="flex-1 text-sm font-medium hover:underline"
          >
            <Typewrite v-if="list.isNew" :text="list.name" @done="list.isNew = false" />
            <span v-else>{{ list.name }}</span>
          </RouterLink>
          <div class="flex items-center gap-2 ml-2 shrink-0">
            <button @click="startEditList(list)" class="text-gray-400 hover:text-black transition" title="Rename">
              <HandDrawnPencil sizeClass="w-5 h-5" />
            </button>
            <button @click="removeList(list.id)" class="text-red-400 hover:text-red-600 text-xl leading-none transition" title="Delete">×</button>
          </div>
        </template>

        <form v-else @submit.prevent="saveListName(list)" class="flex items-center gap-2 w-full">
          <input
            v-model="list.name"
            type="text"
            class="flex-1 border-b-2 border-black text-sm px-1 py-0.5 outline-none"
            autofocus
          />
          <button type="submit" class="text-sm font-medium text-green-700">Save</button>
          <button type="button" @click="editingListId = null" class="text-sm text-gray-400">Cancel</button>
        </form>
      </li>
    </ul>

    <p v-else class="text-sm text-gray-400 text-center mt-10">
      No lists yet.
      <RouterLink :to="{ name: 'new-list' }" class="underline font-medium text-black">Create your first.</RouterLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useShoppingLists } from '@/composables/useShoppingLists'
import Typewrite from '@/components/animations/Typewrite.vue'
import HandDrawnPencil from '@/components/icons/HandDrawnPencil.vue'

const { lists, isLoading, editingListId, startEditList, saveListName, removeList } = useShoppingLists()
</script>

