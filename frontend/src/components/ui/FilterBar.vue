<template>
  <div class="flex flex-col gap-3 mb-6">
    <!-- Search -->
    <input
      :value="search"
      type="text"
      placeholder="Search..."
      class="w-full border-b-2 border-black px-1 py-1 text-base outline-none bg-transparent placeholder-gray-400"
      @input="emit('update:search', ($event.target as HTMLInputElement).value)"
    />

    <div class="flex items-center justify-between gap-3">
      <!-- Filter tabs -->
      <div v-if="filterOptions.length" class="flex gap-1">
        <button
          v-for="opt in filterOptions"
          :key="opt.value"
          class="px-3 py-1 text-sm border-b-2 transition-colors"
          :class="filter === opt.value
            ? 'border-black font-semibold text-black'
            : 'border-transparent text-gray-400 hover:text-black'"
          @click="emit('update:filter', opt.value)"
        >
          {{ opt.label }}
        </button>
      </div>
      <div v-else class="flex-1" />

      <!-- Sort -->
      <select
        v-if="sortOptions.length"
        :value="sort"
        class="text-sm border-b-2 border-black bg-transparent outline-none cursor-pointer py-1 pl-1 pr-6"
        @change="emit('update:sort', ($event.target as HTMLSelectElement).value)"
      >
        <option v-for="opt in sortOptions" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface FilterOption {
  value: string
  label: string
}

const props = defineProps<{
  search: string
  filter: string
  sort: string
  filterOptions: FilterOption[]
  sortOptions: FilterOption[]
}>()

const emit = defineEmits<{
  (e: 'update:search', value: string): void
  (e: 'update:filter', value: string): void
  (e: 'update:sort', value: string): void
}>()
</script>
