<template>
  <Transition name="unroll">
  <div v-if="showAddForm" class="border-2 border-black rounded-lg p-4 mb-4 relative">
    <!-- Close button -->
    <button
      type="button"
      class="absolute top-3 right-3 text-gray-400 hover:text-black transition text-xl leading-none"
      :title="$t('items.closeForm')"
      @click="emit('update:showAddForm', false)"
    >✕</button>

    <form @submit.prevent="onSubmit" class="flex flex-col gap-4">
      <!-- NAME — with autocomplete for shopping/packing, plain for todo -->
      <div class="relative flex flex-col text-xl">
        <label class="text-gray-900 mb-1">{{ $t('items.name') }}
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
        </label>

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

      <!-- QUANTITY + UNIT (hidden for todo) -->
      <div v-if="listType !== 'todo'" class="flex gap-6 items-end">
        <div class="flex flex-col text-xl">
          <label class="text-gray-900 mb-1">{{ $t('items.quantity') }}
            <input
              v-model.number="form.quantity"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="—"
              class="w-20 p-2 text-gray-900 focus:outline-none"
              @input="error = ''"
            />
          </label>
        </div>

        <div class="flex flex-col text-xl">
          <label class="text-gray-900 mb-1">{{ $t('items.unit') }}
            <select
              v-model="form.unit_id"
              class="p-2 text-gray-900 focus:outline-none bg-transparent"
            >
              <option :value="null">—</option>
              <template v-for="(units, groupType) in unitGroups" :key="groupType">
                <optgroup :label="$t('units.types.' + groupType)">
                  <option v-for="unit in units" :key="unit.id" :value="unit.id">
                    {{ unit.name }}
                  </option>
                </optgroup>
              </template>
            </select>
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
import { ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import type { iProduct, iUnitGroups } from '@/types'
import { searchProducts, createProduct } from '@/services/productService'
import { fetchUnits } from '@/services/unitService'

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
  unit_id: null as number | null,
})

const error = ref('')
const shaking = ref(false)

// Autocomplete
const suggestions = ref<iProduct[]>([])
const searching = ref(false)
const showDropdown = ref(false)
const focusedIndex = ref(-1)
let debounceTimer: ReturnType<typeof setTimeout> | null = null

// Units
const unitGroups = ref<iUnitGroups>({})

onMounted(async () => {
  if (props.listType === 'todo') return
  try {
    unitGroups.value = await fetchUnits()
  } catch {
    // units not critical — form works without them
  }
})

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
    form.value.unit_id = null
  } else {
    inputName.value = product.name
    form.value.quantity = null
    form.value.unit_id = product.preferred_unit_id ?? null
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
        preferred_unit_id: form.value.unit_id ?? null,
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
    unit_id: props.listType === 'todo' ? null : (form.value.unit_id ?? null),
    notes: null,
    isCompleted: false,
  })

  resetForm()
}

function resetForm() {
  inputName.value = ''
  selectedProduct.value = null
  form.value = { quantity: null, unit_id: null }
  error.value = ''
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
