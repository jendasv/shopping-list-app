<template>
  <Transition name="unroll">
  <div v-if="showAddForm" class="border-2 border-black rounded-lg p-4 mb-4 relative">
    <!-- Top-right actions: scan + close -->
    <div class="absolute top-3 right-3 z-10 flex items-center gap-3">
      <button
        v-if="listType !== 'todo'"
        type="button"
        class="text-gray-400 hover:text-black transition"
        :title="$t('barcode.scanning')"
        @click="showScanner = true"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 4h2v16H3V4zm4 0h1v16H7V4zm3 0h2v16h-2V4zm4 0h1v16h-1V4zm3 0h1v16h-1V4zM2 3h4v2H2V3zm0 16h4v2H2v-2zm14-16h4v2h-4V3zm0 16h4v2h-4v-2z" />
        </svg>
      </button>
      <button
        type="button"
        class="text-gray-400 hover:text-black transition text-xl leading-none"
        :title="$t('items.closeForm')"
        @click="emit('update:showAddForm', false)"
      >✕</button>
    </div>

    <form @submit.prevent="onSubmit" class="flex flex-col gap-4">
      <!-- Barcode scanner overlay -->
      <BarcodeScanner
        v-if="showScanner"
        @productFound="onProductFound"
        @barcodeOnly="onBarcodeOnly"
        @close="showScanner = false"
      />

      <!-- NAME — with autocomplete for shopping/packing, plain for todo -->
      <div class="relative flex flex-col text-xl">
        <label class="text-gray-900 mb-1">{{ $t('items.name') }}</label>
          <input
            ref="nameInputRef"
            v-model="inputName"
            type="text"
            :placeholder="$t('items.namePlaceholder')"
            class="px-2 pt-2 focus:outline-none focus:border-gray-600 text-gray-900 w-full"
            autocomplete="off"
            @input="listType !== 'todo' ? onNameInput() : (error = '')"
            @keydown.esc.prevent="listType !== 'todo' && closeSuggestions()"
            @keydown.arrow-down.prevent="listType !== 'todo' && moveFocus(1)"
            @keydown.arrow-up.prevent="listType !== 'todo' && moveFocus(-1)"
            @keydown.enter.prevent="listType !== 'todo' ? confirmFocused() : onSubmit()"
            @blur="listType !== 'todo' && onBlur()"
            @focus="listType !== 'todo' && onFocus()"
          />

        <!-- Dropdown (shopping/packing only) -->
        <div
          v-if="listType !== 'todo' && showDropdown"
          class="absolute top-full left-0 right-0 bg-white border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] z-50 max-h-60 overflow-y-auto"
        >
          <button
            v-for="(product, i) in suggestions"
            :key="product.id"
            type="button"
            class="w-full px-4 py-3 text-left flex items-center justify-between transition-colors"
            :class="focusedIndex === i ? 'bg-gray-100' : 'hover:bg-gray-50'"
            @mousedown.prevent="selectProduct(product)"
          >
            <span class="font-medium">{{ product.name }}</span>
            <span class="text-sm text-gray-400 ml-2 shrink-0">
              {{ product.category?.name ?? '' }}
              <template v-if="product.preferred_quantity && product.unit">
                · {{ product.preferred_quantity }} {{ product.unit.symbol }}
              </template>
            </span>
          </button>

          <button
            v-if="inputName.trim().length >= 2"
            type="button"
            class="w-full px-4 py-3 text-left text-gray-500 hover:bg-gray-50 transition-colors"
            :class="suggestions.length > 0 ? 'border-t border-gray-100' : ''"
            @mousedown.prevent="addAsFreeText"
          >
            + {{ $t('items.addNew') }}: "{{ inputName.trim() }}"
          </button>

          <p v-if="searching" class="px-4 py-3 text-sm text-gray-400">{{ $t('common.loading') }}</p>
          <p v-else-if="suggestions.length === 0 && inputName.trim().length >= 2 && !searching" class="px-4 py-3 text-sm text-gray-400">
            {{ $t('items.noSuggestions') }}
          </p>
        </div>
      </div>

      <!-- Barcode indicator (shown when scanned barcode is not in any DB) -->
      <p v-if="scannedBarcode" class="text-xs text-gray-400 -mt-2 flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 4h2v16H3V4zm4 0h1v16H7V4zm3 0h2v16h-2V4zm4 0h1v16h-1V4zm3 0h1v16h-1V4zM2 3h4v2H2V3zm0 16h4v2H2v-2zm14-16h4v2h-4V3zm0 16h4v2h-4v-2z" />
        </svg>
        {{ $t('barcode.attachedHint') }}
      </p>

      <!-- QUANTITY (hidden for todo) -->
      <div v-if="listType !== 'todo'" class="flex gap-6 items-end">
        <div class="flex flex-col text-xl">
          <label class="text-gray-900 mb-1">{{ $t('items.quantity') }}
            <input
              v-model.number="form.quantity"
              type="number"
              min="1"
              step="1"
              placeholder="—"
              class="w-20 p-2 text-gray-900 focus:outline-none"
              @input="error = ''"
            />
          </label>
        </div>
      </div>

      <!-- ERROR -->
      <p v-if="error" class="text-red-500 text-base">{{ error }}</p>

      <!-- SUBMIT -->
      <div class="flex">
        <button
          type="submit"
          class="mt-2 ml-auto text-gray-900 hover:text-gray-600 text-2xl flex items-center gap-2 cursor-pointer transition duration-200 hover:scale-105"
          :class="{ shake: shaking }"
        >
          {{ $t('items.addItem') }}
        </button>
      </div>
    </form>
  </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { iProduct } from '@/types'
import type { iGlobalProduct } from '@/types'
import { searchProducts, createProduct } from '@/services/productService'
import { storeUserProduct } from '@/services/globalProductService'
import BarcodeScanner from '@/components/ui/BarcodeScanner.vue'

const { t } = useI18n()

const props = defineProps<{
  showAddForm: boolean
  listType?: 'shopping' | 'packing' | 'todo'
}>()

const emit = defineEmits<{
  (e: 'update:showAddForm', value: boolean): void
  (e: 'add', payload: {
    name: string
    product_id: number | null
    quantity: number | null
    unit_id: number | null
    notes: string | null
    isCompleted: boolean
  }): void
}>()

// --- State ---
const nameInputRef = ref<HTMLInputElement | null>(null)
const inputName = ref('')
const selectedProduct = ref<iProduct | null>(null)

const form = ref({
  quantity: null as number | null,
})

const error = ref('')
const shaking = ref(false)
const showScanner = ref(false)
const scannedBarcode = ref<string | null>(null)

// Autocomplete
const suggestions = ref<iProduct[]>([])
const searching = ref(false)
const showDropdown = ref(false)
const focusedIndex = ref(-1)
let debounceTimer: ReturnType<typeof setTimeout> | null = null

// Reset form when closed
watch(() => props.showAddForm, (val) => {
  if (!val) resetForm()
})

// --- Autocomplete ---
function onNameInput() {
  error.value = ''
  selectedProduct.value = null

  const q = inputName.value.trim()
  if (q.length < 2) {
    closeSuggestions()
    return
  }

  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => doSearch(q), 300)
}

async function doSearch(q: string) {
  searching.value = true
  showDropdown.value = true
  try {
    suggestions.value = await searchProducts(q)
  } catch {
    suggestions.value = []
  } finally {
    searching.value = false
  }
}

function onFocus() {
  if (inputName.value.trim().length >= 2 && (suggestions.value.length > 0 || searching.value)) {
    showDropdown.value = true
  }
}

function onBlur() {
  setTimeout(() => { showDropdown.value = false; focusedIndex.value = -1 }, 150)
}

function closeSuggestions() {
  showDropdown.value = false
  focusedIndex.value = -1
}

function moveFocus(dir: 1 | -1) {
  if (!showDropdown.value) return
  const max = suggestions.value.length
  focusedIndex.value = Math.max(-1, Math.min(max, focusedIndex.value + dir))
}

function confirmFocused() {
  if (focusedIndex.value >= 0 && focusedIndex.value < suggestions.value.length) {
    const product = suggestions.value[focusedIndex.value]
    if (product) selectProduct(product)
  } else if (focusedIndex.value === suggestions.value.length) {
    addAsFreeText()
  } else {
    onSubmit()
  }
}

function selectProduct(product: iProduct) {
  selectedProduct.value = product

  if (product.preferred_quantity && product.unit) {
    inputName.value = `${product.name} ${product.preferred_quantity} ${product.unit.symbol}`
    form.value.quantity = 1
  } else {
    inputName.value = product.name
    form.value.quantity = null
  }

  closeSuggestions()
}

async function addAsFreeText() {
  closeSuggestions()
  const name = inputName.value.trim()
  if (name.length >= 2 && props.listType !== 'todo') {
    try {
      const product = await createProduct({
        name,
        category_id: null,
        preferred_quantity: null,
        notes: null,
      })
      selectedProduct.value = product
    } catch {
      // catalog save failed — add to list without product link
      selectedProduct.value = null
    }
  } else {
    selectedProduct.value = null
  }
  onSubmit()
}

// --- Barcode scanning ---
function onProductFound(product: iGlobalProduct) {
  showScanner.value = false
  error.value = ''
  inputName.value = product.brand ? `${product.name} ${product.brand}` : product.name
  form.value.quantity = 1
  selectedProduct.value = null
  scannedBarcode.value = null
}

function onBarcodeOnly(barcode: string) {
  showScanner.value = false
  error.value = ''
  scannedBarcode.value = barcode
}

// --- Validation & submit ---
function triggerShake() {
  shaking.value = true
  setTimeout(() => { shaking.value = false }, 500)
}

function onSubmit() {
  const name = inputName.value.trim()

  if (!name && !selectedProduct.value) {
    error.value = t('items.errors.nameRequired')
    triggerShake()
    return
  }

  const qty = form.value.quantity
  if (props.listType !== 'todo' && qty !== null && qty <= 0) {
    error.value = t('items.errors.quantityInvalid')
    triggerShake()
    return
  }

  emit('add', {
    name: name || selectedProduct.value!.name,
    product_id: selectedProduct.value?.id ?? null,
    quantity: props.listType === 'todo' ? null : (qty ?? null),
    unit_id: null,
    notes: null,
    isCompleted: false,
  })

  // Save unknown barcode product to global DB in background
  if (scannedBarcode.value && name) {
    storeUserProduct(name, scannedBarcode.value).catch(() => {})
  }

  resetForm()
}

function resetForm() {
  inputName.value = ''
  selectedProduct.value = null
  form.value = { quantity: null }
  error.value = ''
  scannedBarcode.value = null
  closeSuggestions()
}
</script>

<style scoped>
@keyframes shake {
  0%   { transform: translateX(0); }
  20%  { transform: translateX(-8px); }
  40%  { transform: translateX(8px); }
  60%  { transform: translateX(-6px); }
  80%  { transform: translateX(4px); }
  100% { transform: translateX(0); }
}
.shake { animation: shake 0.5s ease-in-out; }
</style>
