<template>
  <div class="py-4">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">{{ $t('lists.title') }}</h1>
      <RouterLink :to="{ name: 'new-list' }" class="btn-primary">{{ $t('lists.newList') }}</RouterLink>
    </div>

    <FilterBar
      v-model:search="search"
      v-model:filter="activeFilter"
      v-model:sort="activeSort"
      :filterOptions="[
        { value: 'all', label: $t('lists.filters.all') },
        { value: 'shared', label: $t('lists.filters.shared') },
        { value: 'private', label: $t('lists.filters.private') },
      ]"
      :sortOptions="[
        { value: 'custom', label: $t('lists.sort.custom') },
        { value: 'az', label: $t('lists.sort.az') },
        { value: 'za', label: $t('lists.sort.za') },
        { value: 'items-desc', label: $t('lists.sort.itemsDesc') },
        { value: 'items-asc', label: $t('lists.sort.itemsAsc') },
        { value: 'newest', label: $t('lists.sort.newest') },
        { value: 'oldest', label: $t('lists.sort.oldest') },
      ]"
    />

    <Transition name="page" mode="out-in">
      <p v-if="isLoading" key="loading" class="text-sm text-gray-400 text-center mt-10">{{ $t('common.loading') }}</p>

      <div v-else key="content">
      <!-- Drag & drop mode -->
      <VueDraggablePlus
        v-if="isDragEnabled && lists.length"
        v-model="lists"
        tag="ul"
        class="space-y-3"
        handle=".drag-handle"
        @end="onReorderLists"
      >
        <li v-for="(list, i) in lists" :key="list.id" class="list-stagger-item group flex items-center justify-between" :style="{ '--i': i }">
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
                {{ list.isOwner ? $t('lists.owner') : $t('lists.member') }}
              </span>
            </RouterLink>
            <RowActions>
              <template #menu="{ close }">
                <button @click="startEditList(list); close()" class="w-full px-4 py-3 text-left text-xl hover:bg-gray-50 transition-colors">{{ $t('common.rename') }}</button>
                <button @click="removeList(list.id); close()" class="w-full px-4 py-3 text-left text-xl text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100">{{ $t('common.delete') }}</button>
              </template>
            </RowActions>
          </template>
          <form v-else @submit.prevent="saveListName(list)" class="flex items-center gap-2 w-full">
            <input v-model="list.name" type="text" class="flex-1 border-b-2 border-black text-base px-1 py-1 outline-none" v-focus-end />
            <button type="submit" class="text-base font-medium text-green-700 px-1 py-0.5 cursor-pointer">{{ $t('common.save') }}</button>
            <button type="button" @click="editingListId = null" class="text-base text-gray-400 px-1 py-0.5 cursor-pointer">{{ $t('common.cancel') }}</button>
          </form>
        </li>
      </VueDraggablePlus>

      <!-- Filtered / sorted mode (no drag) -->
      <TransitionGroup v-else-if="lists.length" name="list-stagger" appear tag="ul" class="space-y-3">
        <li v-for="(list, i) in lists" :key="list.id" class="group flex items-center justify-between" :style="{ '--i': i }">
          <template v-if="editingListId !== list.id">
            <RouterLink
              :to="{ name: 'list-detail', params: { id: list.id } }"
              class="flex-1 flex items-baseline gap-3 hover:text-gray-600 transition duration-200 hover:scale-105"
            >
              <span class="text-2xl">{{ list.name }}</span>
              <span v-if="list.itemsCount" class="text-gray-400 text-base tabular-nums">{{ list.completedCount }}/{{ list.itemsCount }}</span>
              <span v-if="list.visibility === 'shared'" class="text-gray-400 text-base">
                {{ list.isOwner ? $t('lists.owner') : $t('lists.member') }}
              </span>
            </RouterLink>
            <RowActions>
              <template #menu="{ close }">
                <button @click="startEditList(list); close()" class="w-full px-4 py-3 text-left text-xl hover:bg-gray-50 transition-colors">{{ $t('common.rename') }}</button>
                <button @click="removeList(list.id); close()" class="w-full px-4 py-3 text-left text-xl text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100">{{ $t('common.delete') }}</button>
              </template>
            </RowActions>
          </template>
          <form v-else @submit.prevent="saveListName(list)" class="flex items-center gap-2 w-full">
            <input v-model="list.name" type="text" class="flex-1 border-b-2 border-black text-base px-1 py-1 outline-none" v-focus-end />
            <button type="submit" class="text-base font-medium text-green-700 px-1 py-0.5 cursor-pointer">{{ $t('common.save') }}</button>
            <button type="button" @click="editingListId = null" class="text-base text-gray-400 px-1 py-0.5 cursor-pointer">{{ $t('common.cancel') }}</button>
          </form>
        </li>
      </TransitionGroup>

      <!-- No results from filter/search -->
      <p v-else-if="search || activeFilter !== 'all'" class="text-sm text-gray-400 text-center mt-10">
        {{ $t('lists.noMatch') }}
      </p>

      <!-- No lists at all -->
      <p v-else class="text-sm text-gray-400 text-center mt-10">
        {{ $t('lists.empty') }}
        <RouterLink :to="{ name: 'new-list' }" class="underline font-medium text-black">{{ $t('lists.createFirst') }}</RouterLink>
      </p>

      <!-- Pagination -->
      <div v-if="meta.last_page > 1" class="flex items-center justify-center gap-6 mt-8 text-sm text-gray-400">
        <button
          @click="prevPage"
          :disabled="meta.current_page === 1"
          class="disabled:opacity-30 hover:text-black transition cursor-pointer"
        >{{ $t('common.prev') }}</button>
        <span>{{ meta.current_page }} / {{ meta.last_page }}</span>
        <button
          @click="nextPage"
          :disabled="meta.current_page === meta.last_page"
          class="disabled:opacity-30 hover:text-black transition cursor-pointer"
        >{{ $t('common.next') }}</button>
      </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { VueDraggable as VueDraggablePlus } from 'vue-draggable-plus'
import { useLists } from '@/composables/useLists'
import { reorderLists } from '@/services/listService'
import FilterBar from '@/components/ui/FilterBar.vue'
import Typewrite from '@/components/animations/Typewrite.vue'
import RowActions from '@/components/ui/RowActions.vue'

const {
  lists,
  isLoading,
  meta,
  editingListId,
  search,
  activeFilter,
  activeSort,
  isDragEnabled,
  prevPage,
  nextPage,
  startEditList,
  saveListName,
  removeList,
} = useLists()

async function onReorderLists() {
  await reorderLists(lists.value.map((l) => l.id))
}
</script>
