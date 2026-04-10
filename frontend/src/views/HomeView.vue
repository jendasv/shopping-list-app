<template>
  <div class="py-4">
    <div v-if="menuOpenId !== null" class="fixed inset-0 z-10" @click="closeMenu()" />
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">My lists</h1>
      <RouterLink :to="{ name: 'new-list' }" class="btn-primary">+ New list</RouterLink>
    </div>

    <FilterBar
      v-model:search="search"
      v-model:filter="activeFilter"
      v-model:sort="activeSort"
      :filterOptions="[
        { value: 'all', label: 'All' },
        { value: 'shared', label: 'Shared' },
        { value: 'private', label: 'Private' },
      ]"
      :sortOptions="[
        { value: 'custom', label: 'Custom order' },
        { value: 'az', label: 'A–Z' },
        { value: 'za', label: 'Z–A' },
        { value: 'items-desc', label: 'Most items' },
        { value: 'items-asc', label: 'Fewest items' },
        { value: 'newest', label: 'Newest' },
        { value: 'oldest', label: 'Oldest' },
      ]"
    />

    <p v-if="isLoading" class="text-sm text-gray-400 text-center mt-10">Loading...</p>

    <template v-else>
      <!-- Drag & drop mode -->
      <VueDraggablePlus
        v-if="isDragEnabled && lists.length"
        v-model="lists"
        tag="ul"
        class="space-y-3"
        handle=".drag-handle"
        @end="onReorderLists"
      >
        <li v-for="list in lists" :key="list.id" class="group flex items-center justify-between">
          <span class="drag-handle cursor-grab active:cursor-grabbing text-gray-200 group-hover:text-gray-400 mr-2 shrink-0 text-2xl leading-none select-none transition-colors">⠿</span>
          <template v-if="editingListId !== list.id">
            <RouterLink
              :to="{ name: 'list-detail', params: { id: list.id } }"
              class="flex-1 flex items-baseline gap-3 hover:text-gray-600 transition duration-200 hover:scale-105"
            >
              <span class="text-2xl">
                <Typewrite v-if="list.isNew" :text="list.name" @done="list.isNew = false" />
                <span v-else>{{ list.name }}</span>
              </span>
              <span v-if="list.itemsCount" class="text-gray-400 text-base tabular-nums">{{ list.completedCount }}/{{ list.itemsCount }}</span>
              <span v-if="list.visibility === 'shared'" class="text-gray-400 text-base">
                shared — {{ list.isOwner ? 'owner' : 'member' }}
              </span>
            </RouterLink>
            <RowActions :id="list.id" :open="menuOpenId === list.id" @toggle="toggleMenu" @close="closeMenu">
              <template #desktop>
                <button @click="startEditList(list)" class="text-gray-400 hover:text-black transition" title="Rename">
                  <HandDrawnPencil sizeClass="w-11 h-11" />
                </button>
                <button @click="removeList(list.id)" class="text-red-400 hover:text-red-600 text-4xl leading-none transition cursor-pointer" title="Delete">×</button>
              </template>
              <template #menu>
                <button @click="startEditList(list); closeMenu()" class="w-full px-4 py-3 text-left text-xl hover:bg-gray-50 transition-colors">Rename</button>
                <button @click="removeList(list.id); closeMenu()" class="w-full px-4 py-3 text-left text-xl text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100">Delete</button>
              </template>
            </RowActions>
          </template>
          <form v-else @submit.prevent="saveListName(list)" class="flex items-center gap-2 w-full">
            <input v-model="list.name" type="text" class="flex-1 border-b-2 border-black text-base px-1 py-1 outline-none" autofocus />
            <button type="submit" class="text-base font-medium text-green-700 px-1 py-0.5 cursor-pointer">Save</button>
            <button type="button" @click="editingListId = null" class="text-base text-gray-400 px-1 py-0.5 cursor-pointer">Cancel</button>
          </form>
        </li>
      </VueDraggablePlus>

      <!-- Filtered / sorted mode (no drag) -->
      <ul v-else-if="displayedLists.length" class="space-y-3">
        <li v-for="list in displayedLists" :key="list.id" class="group flex items-center justify-between">
          <template v-if="editingListId !== list.id">
            <RouterLink
              :to="{ name: 'list-detail', params: { id: list.id } }"
              class="flex-1 flex items-baseline gap-3 hover:text-gray-600 transition duration-200 hover:scale-105"
            >
              <span class="text-2xl">{{ list.name }}</span>
              <span v-if="list.itemsCount" class="text-gray-400 text-base tabular-nums">{{ list.completedCount }}/{{ list.itemsCount }}</span>
              <span v-if="list.visibility === 'shared'" class="text-gray-400 text-base">
                shared — {{ list.isOwner ? 'owner' : 'member' }}
              </span>
            </RouterLink>
            <RowActions :id="list.id" :open="menuOpenId === list.id" @toggle="toggleMenu" @close="closeMenu">
              <template #desktop>
                <button @click="startEditList(list)" class="text-gray-400 hover:text-black transition" title="Rename">
                  <HandDrawnPencil sizeClass="w-11 h-11" />
                </button>
                <button @click="removeList(list.id)" class="text-red-400 hover:text-red-600 text-4xl leading-none transition cursor-pointer" title="Delete">×</button>
              </template>
              <template #menu>
                <button @click="startEditList(list); closeMenu()" class="w-full px-4 py-3 text-left text-xl hover:bg-gray-50 transition-colors">Rename</button>
                <button @click="removeList(list.id); closeMenu()" class="w-full px-4 py-3 text-left text-xl text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100">Delete</button>
              </template>
            </RowActions>
          </template>
          <form v-else @submit.prevent="saveListName(list)" class="flex items-center gap-2 w-full">
            <input v-model="list.name" type="text" class="flex-1 border-b-2 border-black text-base px-1 py-1 outline-none" autofocus />
            <button type="submit" class="text-base font-medium text-green-700 px-1 py-0.5 cursor-pointer">Save</button>
            <button type="button" @click="editingListId = null" class="text-base text-gray-400 px-1 py-0.5 cursor-pointer">Cancel</button>
          </form>
        </li>
      </ul>

      <!-- No results from filter/search -->
      <p v-else-if="lists.length" class="text-sm text-gray-400 text-center mt-10">
        No lists match your search.
      </p>

      <!-- No lists at all -->
      <p v-else class="text-sm text-gray-400 text-center mt-10">
        No lists yet.
        <RouterLink :to="{ name: 'new-list' }" class="underline font-medium text-black">Create your first.</RouterLink>
      </p>
    </template>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { VueDraggable as VueDraggablePlus } from 'vue-draggable-plus'
import { useShoppingLists } from '@/composables/useShoppingLists'
import { useContextMenu } from '@/composables/useContextMenu'
import { reorderLists } from '@/services/shoppingListService'
import FilterBar from '@/components/ui/FilterBar.vue'
import Typewrite from '@/components/animations/Typewrite.vue'
import HandDrawnPencil from '@/components/icons/HandDrawnPencil.vue'
import RowActions from '@/components/ui/RowActions.vue'

const {
  lists,
  displayedLists,
  isLoading,
  editingListId,
  search,
  activeFilter,
  activeSort,
  isDragEnabled,
  startEditList,
  saveListName,
  removeList,
} = useShoppingLists()

const { menuOpenId, toggleMenu, closeMenu } = useContextMenu()

async function onReorderLists() {
  await reorderLists(lists.value.map((l) => l.id))
}
</script>
