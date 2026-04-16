<template>
  <div class="py-4">
    <!-- Header -->
    <div class="flex items-center gap-3 mb-6">
      <h1 class="text-2xl font-bold flex-1">{{ $t('catalog.title') }}</h1>

      <!-- Shared catalog info -->
      <div class="relative" ref="infoRef">
        <button
          type="button"
          @click="showInfo = !showInfo"
          class="w-6 h-6 rounded-full border-2 border-gray-300 text-gray-400 hover:border-black hover:text-black text-sm font-bold transition flex items-center justify-center"
          :title="$t('catalog.infoTitle')"
        >i</button>
        <div
          v-if="showInfo"
          class="absolute right-0 top-8 w-64 bg-white border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] p-3 text-sm text-gray-700 z-50"
        >
          {{ $t('catalog.infoText') }}
        </div>
      </div>

      <button
        v-if="!showForm"
        @click="openAddForm"
        class="shrink-0 text-sm text-gray-500 hover:text-black underline transition"
      >
        + {{ $t('catalog.addProduct') }}
      </button>
    </div>

    <!-- Add / Edit form -->
    <Transition name="unroll">
      <div v-if="showForm" class="border-2 border-black rounded-lg p-4 mb-6 relative">
        <button
          type="button"
          class="absolute top-3 right-3 text-gray-400 hover:text-black transition text-xl"
          @click="closeForm"
        >✕</button>

        <h2 class="text-xl font-semibold mb-4">
          {{ editingProduct ? $t('catalog.editProduct') : $t('catalog.newProduct') }}
        </h2>

        <!-- Name -->
        <div class="flex flex-col text-xl mb-4">
          <label class="text-gray-900 mb-1">{{ $t('catalog.fields.name') }}
            <input
              v-model="form.name"
              type="text"
              class="px-2 pt-2 focus:outline-none focus:border-gray-600 text-gray-900 w-full"
              :placeholder="$t('catalog.fields.namePlaceholder')"
            />
          </label>
        </div>

        <!-- Category + Unit -->
        <div class="flex gap-6 flex-wrap mb-4">
          <div class="flex flex-col text-xl">
            <label class="text-gray-900 mb-1">{{ $t('catalog.fields.category') }}
              <select v-model="form.category_id" class="p-2 bg-transparent focus:outline-none">
                <option :value="null">{{ $t('catalog.fields.noCategory') }}</option>
                <optgroup v-if="categories.global.length" :label="$t('catalog.globalCategories')">
                  <option v-for="c in categories.global" :key="c.id" :value="c.id">{{ c.name }}</option>
                </optgroup>
                <optgroup v-if="categories.custom.length" :label="$t('catalog.customCategories')">
                  <option v-for="c in categories.custom" :key="c.id" :value="c.id">{{ c.name }}</option>
                </optgroup>
              </select>
            </label>
          </div>

          <div class="flex flex-col text-xl">
            <label class="text-gray-900 mb-1">{{ $t('items.unit') }}
              <select v-model="form.preferred_unit_id" class="p-2 bg-transparent focus:outline-none">
                <option :value="null">—</option>
                <template v-for="(units, groupType) in unitGroups" :key="groupType">
                  <optgroup :label="$t('units.types.' + groupType)">
                    <option v-for="unit in units" :key="unit.id" :value="unit.id">{{ unit.name }}</option>
                  </optgroup>
                </template>
              </select>
            </label>
          </div>

          <div class="flex flex-col text-xl">
            <label class="text-gray-900 mb-1">{{ $t('catalog.fields.preferredQty') }}
              <input
                v-model.number="form.preferred_quantity"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="—"
                class="w-20 p-2 focus:outline-none"
              />
            </label>
          </div>
        </div>

        <!-- Notes -->
        <div class="flex flex-col text-xl mb-4">
          <label class="text-gray-900 mb-1">{{ $t('catalog.fields.notes') }}
            <input
              v-model="form.notes"
              type="text"
              class="px-2 pt-2 focus:outline-none w-full"
              :placeholder="$t('catalog.fields.notesPlaceholder')"
            />
          </label>
        </div>

        <AlertMessage v-if="formError" :message="formError" type="error" />

        <div class="flex justify-end gap-4 mt-4">
          <button type="button" @click="closeForm" class="text-gray-500 hover:text-black transition">
            {{ $t('common.cancel') }}
          </button>
          <button
            type="button"
            class="text-gray-900 hover:text-gray-600 text-xl font-medium cursor-pointer transition"
            :disabled="saving"
            @click="saveProduct"
          >
            {{ saving ? $t('common.saving') : $t('common.save') }}
          </button>
        </div>
      </div>
    </Transition>

    <!-- Filters -->
    <div class="flex flex-wrap gap-3 mb-4">
      <input
        v-model="searchQ"
        type="search"
        :placeholder="$t('search.placeholder')"
        class="flex-1 min-w-0 border-b-2 border-gray-300 focus:border-black focus:outline-none py-1 text-base"
        @input="onSearch"
      />

      <select
        v-model="filterCategory"
        class="bg-transparent border-b-2 border-gray-300 focus:border-black focus:outline-none py-1 text-base"
        @change="loadPage(1)"
      >
        <option :value="null">{{ $t('catalog.allCategories') }}</option>
        <optgroup v-if="categories.global.length" :label="$t('catalog.globalCategories')">
          <option v-for="c in categories.global" :key="c.id" :value="c.id">{{ c.name }}</option>
        </optgroup>
        <optgroup v-if="categories.custom.length" :label="$t('catalog.customCategories')">
          <option v-for="c in categories.custom" :key="c.id" :value="c.id">{{ c.name }}</option>
        </optgroup>
      </select>
    </div>

    <!-- Loading -->
    <p v-if="loading" class="text-sm text-gray-400 text-center mt-10">{{ $t('common.loading') }}</p>

    <!-- Empty state -->
    <div v-else-if="products.length === 0" class="text-center mt-10 text-gray-400">
      <p>{{ $t('catalog.empty') }}</p>
      <button @click="openAddForm" class="mt-2 underline text-gray-500 hover:text-black transition">
        {{ $t('catalog.addFirst') }}
      </button>
    </div>

    <!-- Product list -->
    <ul v-else class="space-y-2">
      <li
        v-for="product in products"
        :key="product.id"
        class="group flex items-center justify-between py-2 border-b border-gray-100"
      >
        <div class="flex-1 min-w-0">
          <span class="text-xl">{{ product.name }}</span>
          <span v-if="product.category" class="ml-2 text-sm text-gray-400">{{ product.category.name }}</span>
          <span v-if="product.preferred_quantity || product.unit" class="ml-2 text-sm text-gray-400">
            {{ product.preferred_quantity ? product.preferred_quantity + ' ' : '' }}{{ product.unit?.symbol ?? '' }}
          </span>
          <p v-if="product.notes" class="text-sm text-gray-400 truncate">{{ product.notes }}</p>
        </div>

        <RowActions>
          <template #menu="{ close }">
            <button @click="openEditForm(product); close()" class="w-full px-4 py-3 text-left text-xl hover:bg-gray-50 transition-colors">
              {{ $t('common.edit') }}
            </button>
            <button @click="remove(product); close()" class="w-full px-4 py-3 text-left text-xl text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100">
              {{ $t('common.delete') }}
            </button>
          </template>
        </RowActions>
      </li>
    </ul>

    <!-- Pagination -->
    <div v-if="meta.last_page > 1" class="flex items-center justify-center gap-4 mt-6 text-sm">
      <button :disabled="meta.current_page <= 1" @click="loadPage(meta.current_page - 1)" class="disabled:opacity-30 hover:underline">
        {{ $t('common.prev') }}
      </button>
      <span>{{ meta.current_page }} / {{ meta.last_page }}</span>
      <button :disabled="meta.current_page >= meta.last_page" @click="loadPage(meta.current_page + 1)" class="disabled:opacity-30 hover:underline">
        {{ $t('common.next') }}
      </button>
    </div>

    <AlertMessage v-if="pageError" :message="pageError" type="error" class="mt-4" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { onClickOutside } from '@vueuse/core'
import type { iProduct, iUnitGroups } from '@/types'
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '@/services/productService'
import { fetchCategories } from '@/services/categoryService'
import { fetchUnits } from '@/services/unitService'
import { useConfirm } from '@/composables/useConfirm'
import AlertMessage from '@/components/elements/AlertMessage.vue'
import RowActions from '@/components/ui/RowActions.vue'

const { t } = useI18n()
const { confirm } = useConfirm()

// --- Info tooltip ---
const showInfo = ref(false)
const infoRef = ref<HTMLElement | null>(null)
onClickOutside(infoRef, () => { showInfo.value = false })

// --- Data ---
const products = ref<iProduct[]>([])
const loading = ref(false)
const pageError = ref('')
const meta = ref({ current_page: 1, last_page: 1, total: 0 })

import type { iCategoriesResponse } from '@/services/categoryService'
const categories = ref<iCategoriesResponse>({ global: [], custom: [] })
const unitGroups = ref<iUnitGroups>({})

// --- Filters ---
const searchQ = ref('')
const filterCategory = ref<number | null>(null)
let searchTimer: ReturnType<typeof setTimeout> | null = null

// --- Form state ---
const showForm = ref(false)
const editingProduct = ref<iProduct | null>(null)
const saving = ref(false)
const formError = ref('')

const form = ref({
  name: '',
  category_id: null as number | null,
  preferred_unit_id: null as number | null,
  preferred_quantity: null as number | null,
  notes: '',
})

onMounted(async () => {
  await Promise.all([loadPage(1), loadCategories(), loadUnits()])
})

async function loadPage(page: number) {
  loading.value = true
  pageError.value = ''
  try {
    const res = await fetchProducts({ page, category_id: filterCategory.value, q: searchQ.value || undefined })
    products.value = res.data
    meta.value = res.meta
  } catch {
    pageError.value = t('catalog.errors.loadFailed')
  } finally {
    loading.value = false
  }
}

async function loadCategories() {
  try {
    const res = await fetchCategories()
    categories.value = res
  } catch { /* non-critical */ }
}

async function loadUnits() {
  try {
    unitGroups.value = await fetchUnits()
  } catch { /* non-critical */ }
}

function onSearch() {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => loadPage(1), 350)
}

// --- Form ---
function openAddForm() {
  editingProduct.value = null
  form.value = { name: '', category_id: null, preferred_unit_id: null, preferred_quantity: null, notes: '' }
  formError.value = ''
  showForm.value = true
}

function openEditForm(product: iProduct) {
  editingProduct.value = product
  form.value = {
    name: product.name,
    category_id: product.category_id,
    preferred_unit_id: product.preferred_unit_id,
    preferred_quantity: product.preferred_quantity,
    notes: product.notes ?? '',
  }
  formError.value = ''
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  editingProduct.value = null
}

async function saveProduct() {
  if (!form.value.name.trim()) {
    formError.value = t('catalog.errors.nameRequired')
    return
  }

  saving.value = true
  formError.value = ''

  const payload = {
    name: form.value.name.trim(),
    category_id: form.value.category_id,
    preferred_unit_id: form.value.preferred_unit_id,
    preferred_quantity: form.value.preferred_quantity,
    notes: form.value.notes || null,
  }

  try {
    if (editingProduct.value) {
      const updated = await updateProduct(editingProduct.value.id, payload)
      const idx = products.value.findIndex((p) => p.id === updated.id)
      if (idx >= 0) products.value[idx] = updated
    } else {
      const created = await createProduct(payload)
      products.value.unshift(created)
      meta.value.total++
    }
    closeForm()
  } catch (e: unknown) {
    const err = e as { status?: number }
    if (err?.status === 402) {
      formError.value = t('catalog.errors.freeTierLimit')
    } else {
      formError.value = t('catalog.errors.saveFailed')
    }
  } finally {
    saving.value = false
  }
}

async function remove(product: iProduct) {
  const ok = await confirm(t('catalog.deleteConfirm', { name: product.name }))
  if (!ok) return
  try {
    await deleteProduct(product.id)
    products.value = products.value.filter((p) => p.id !== product.id)
    meta.value.total--
  } catch {
    pageError.value = t('catalog.errors.deleteFailed')
  }
}
</script>
