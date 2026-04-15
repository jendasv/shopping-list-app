<template>
  <div class="py-4">
    <!-- Header -->
    <div class="flex items-center gap-3 mb-6">
      <RouterLink :to="{ name: 'home' }" class="text-gray-400 hover:text-black transition" :title="$t('common.back')">
        <ArrowLeft customClass="w-6 h-6" />
      </RouterLink>
      <h1 class="text-2xl font-bold flex-1 text-center">{{ $t('newList.title') }}</h1>
    </div>

    <!-- List name -->
    <div class="mb-6 flex items-center gap-4 text-xl">
      <label class="shrink-0 text-gray-900">{{ $t('newList.listName') }}</label>
      <input
        v-model="listName"
        type="text"
        :placeholder="$t('newList.listNamePlaceholder')"
        class="flex-1 p-2 focus:outline-none text-gray-900"
        @input="error = ''"
      />
    </div>

    <HandDrawnDivider class="mb-5" />

    <!-- Items -->
    <div class="mb-6">
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
          <span class="text-2xl" :class="item.isCompleted ? 'line-through text-gray-400' : ''">
            <Typewrite v-if="item.isNew" :text="(item.quantity ?? 0) > 1 ? item.name + ' — ' + item.quantity + 'x' : item.name" @done="item.isNew = false" />
            <span v-else>{{ item.name }}{{ (item.quantity ?? 0) > 1 ? ' — ' + item.quantity + 'x' : '' }}</span>
          </span>
          <button @click="removeItem(item.id)" class="text-red-400 hover:text-red-600 text-3xl leading-none ml-3">×</button>
        </li>
      </ul>
      <p v-else-if="!showItemAddForm" class="text-base text-gray-400 mt-2">{{ $t('items.noItems') }}</p>
    </div>

    <HandDrawnDivider class="mb-5" />

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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { iItem } from '@/types'
import { createList } from '@/services/listService'
import AddItemForm from '@/components/form/AddItemForm.vue'
import AlertMessage from '@/components/elements/AlertMessage.vue'
import HandDrawnCheckbox from '@/components/elements/form/HandDrawnCheckbox.vue'
import HandDrawnDivider from '@/components/elements/HandDrawnDivider.vue'
import ArrowLeft from '@/components/icons/ArrowLeft.vue'
import Typewrite from '@/components/animations/Typewrite.vue'

const { t } = useI18n()
const router = useRouter()

const listName = ref('')
const isShared = ref(false)
const items = ref<iItem[]>([])
const showItemAddForm = ref(false)
const error = ref('')
const success = ref('')

function addItem(item: iItem) {
  items.value.push(item)
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
    await createList(listName.value.trim(), isShared.value ? 'shared' : 'private', items.value)
    router.push({ name: 'home' })
  } catch (e) {
    console.error(e)
    error.value = t('lists.errors.createFailed')
  }
}
</script>
