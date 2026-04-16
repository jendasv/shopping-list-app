<template>
  <div class="py-4">
    <!-- Header -->
    <div class="flex items-center gap-3 mb-6">
      <RouterLink :to="{ name: 'home' }" class="text-gray-400 hover:text-black transition" :title="$t('common.back')">
        <ArrowLeft customClass="w-6 h-6" />
      </RouterLink>
      <h1 class="text-2xl font-bold flex-1 text-center">{{ $t('newList.title') }}</h1>
    </div>

    <!-- List type -->
    <div class="mb-6">
      <label class="block text-base text-gray-500 mb-2">{{ $t('newList.listType') }}</label>
      <div class="flex gap-2">
        <button
          v-for="type in LIST_TYPES"
          :key="type"
          type="button"
          @click="listType = type"
          :class="listType === type
            ? 'bg-black text-white border-black'
            : 'bg-white text-black border-black hover:bg-gray-50'"
          class="flex-1 py-2 px-3 border-2 rounded-lg text-base font-medium transition cursor-pointer"
        >
          {{ $t(`newList.types.${type}`) }}
        </button>
      </div>
    </div>

    <HandDrawnDivider class="mb-5" />

    <!-- List name -->
    <div class="mb-6 flex items-center gap-4 text-xl">
      <label class="shrink-0 text-gray-900">{{ $t('newList.listName') }}</label>
      <input
        v-model="listName"
        type="text"
        :placeholder="listNamePlaceholder"
        class="flex-1 p-2 focus:outline-none text-gray-900"
        @input="error = ''"
      />
    </div>

    <HandDrawnDivider class="mb-5" />

    <!-- Items (only for shopping + packing) -->
    <div v-if="listType !== 'todo'" class="mb-6">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-xl font-semibold">{{ $t('newList.items') }}</h2>
        <button
          v-if="!showItemAddForm"
          @click="showItemAddForm = true"
          class="text-sm text-gray-500 hover:text-black underline transition"
        >
          + {{ $t('items.addItem') }}
        </button>
      </div>

      <AddItemForm @add="addItem" v-model:showAddForm="showItemAddForm" />

      <ul v-if="items.length" class="space-y-6 mt-3">
        <li
          v-for="item in items"
          :key="item.id"
          class="flex items-center justify-between"
        >
          <span class="text-2xl">
            <Typewrite v-if="item.isNew" :text="item.quantity ? item.name + ' — ' + item.quantity + '×' : item.name" @done="item.isNew = false" />
            <span v-else>{{ item.name }}{{ item.quantity ? ' — ' + item.quantity + '×' : '' }}</span>
          </span>
          <button @click="removeItem(item.id)" class="text-red-400 hover:text-red-600 text-3xl leading-none ml-3">×</button>
        </li>
      </ul>
      <p v-else-if="!showItemAddForm" class="text-base text-gray-400 mt-2">{{ $t('items.noItems') }}</p>
    </div>

    <HandDrawnDivider v-if="listType !== 'todo'" class="mb-5" />

    <!-- Visibility -->
    <div class="mb-6">
      <HandDrawnCheckbox v-model="isShared">
        {{ $t('newList.shareWithHousehold') }}
      </HandDrawnCheckbox>
      <p class="text-base text-gray-400 mt-1">{{ $t('newList.sharedInfo') }}</p>
    </div>

    <AlertMessage v-if="error" type="error" :message="error" />
    <AlertMessage v-if="success" type="success" :message="success" />

    <div class="flex justify-end mt-4">
      <button
        @click="submitCreate"
        :disabled="!listName.trim()"
        class="btn-primary"
      >
        {{ $t('newList.createBtn') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { ListType } from '@/types'
import { createList } from '@/services/listService'

interface iPreviewItem {
  id: number
  name: string
  quantity: number | null
  unit_id: number | null
  isNew?: boolean
}
import AddItemForm from '@/components/form/AddItemForm.vue'
import AlertMessage from '@/components/elements/AlertMessage.vue'
import HandDrawnCheckbox from '@/components/elements/form/HandDrawnCheckbox.vue'
import HandDrawnDivider from '@/components/elements/HandDrawnDivider.vue'
import ArrowLeft from '@/components/icons/ArrowLeft.vue'
import Typewrite from '@/components/animations/Typewrite.vue'

const LIST_TYPES: ListType[] = ['shopping', 'packing', 'todo']

const { t } = useI18n()
const router = useRouter()

const listType = ref<ListType>('shopping')
const listName = ref('')
const isShared = ref(false)
const items = ref<iPreviewItem[]>([])
const showItemAddForm = ref(false)
const error = ref('')
const success = ref('')

const listNamePlaceholder = computed(() => {
  const map: Record<ListType, string> = {
    shopping: t('newList.listNamePlaceholder'),
    packing: t('newList.listNamePlaceholderPacking'),
    todo: t('newList.listNamePlaceholderTodo'),
  }
  return map[listType.value]
})

function addItem(payload: { name: string; product_id: number | null; quantity: number | null; unit_id: number | null; notes: string | null; isCompleted: boolean }) {
  items.value.push({ id: Date.now(), name: payload.name, quantity: payload.quantity, unit_id: payload.unit_id, isNew: true })
}

function removeItem(id: number) {
  items.value = items.value.filter((i) => i.id !== id)
}

async function submitCreate() {
  if (!listName.value.trim()) {
    error.value = t('lists.errors.nameRequired')
    return
  }
  try {
    await createList(
      listName.value.trim(),
      isShared.value ? 'shared' : 'private',
      listType.value !== 'todo' ? items.value : [],
      listType.value,
    )
    router.push({ name: 'home' })
  } catch (e) {
    console.error(e)
    error.value = t('lists.errors.createFailed')
  }
}
</script>
