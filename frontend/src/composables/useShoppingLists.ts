import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import type { iShoppingList } from '@/types'
import { fetchAllLists, createList, updateList, deleteList } from '@/services/shoppingListService'
import { useAuthStore } from '@/stores/auth'
import { useFilterableList } from '@/composables/useFilterableList'
import echo from '@/plugins/echo'

export type SortKey = 'custom' | 'az' | 'za' | 'items-desc' | 'items-asc' | 'newest' | 'oldest'
export type FilterKey = 'all' | 'shared' | 'private'

export function useShoppingLists() {
  const { t } = useI18n()
  const authStore = useAuthStore()
  const error = ref<string>('')
  const editingListId = ref<number | null>(null)

  const base = useFilterableList<iShoppingList>({
    fetchFn: fetchAllLists,
    defaultSort: 'custom',
  })

  const isDragEnabled = computed(
    () => base.activeSort.value === 'custom' && !base.search.value && base.activeFilter.value === 'all',
  )

  onMounted(async () => {
    await base.fetchItems()

    const householdId = authStore.user?.householdId
    if (!householdId) return

    echo
      .private(`household.${householdId}`)
      .listen('.ListUpdated', () => base.fetchItems())
      .listen('.ListCreated', () => base.fetchItems(1))
      .listen('.ListDeleted', () => {
        const goBack = base.items.value.length === 1 && base.meta.value.current_page > 1
        base.fetchItems(goBack ? base.meta.value.current_page - 1 : undefined)
      })
  })

  onUnmounted(() => {
    const householdId = authStore.user?.householdId
    if (householdId) echo.leave(`household.${householdId}`)
  })

  function startEditList(list: iShoppingList) {
    editingListId.value = list.id
  }

  async function saveListName(list: iShoppingList) {
    if (!list.name.trim()) {
      error.value = t('lists.errors.nameRequired')
      return
    }
    try {
      await updateList(list.id, list.name.trim())
      editingListId.value = null
    } catch (e) {
      console.error('Failed to update list:', e)
      error.value = t('lists.errors.updateFailed')
      editingListId.value = null
      await base.fetchItems()
    }
  }

  async function addList(name: string) {
    if (!name.trim() || name.trim().length < 3) {
      error.value = t('lists.errors.nameRequired')
      return
    }
    try {
      const data = await createList(name.trim(), 'private')
      await base.fetchItems(1)
      const newList = base.items.value.find((l) => l.id === data.id)
      if (newList) newList.isNew = true
    } catch (e) {
      console.error('Failed to create list:', e)
      error.value = t('lists.errors.createFailed')
    }
  }

  async function removeList(id: number) {
    try {
      await deleteList(id)
      const goBack = base.items.value.length === 1 && base.meta.value.current_page > 1
      await base.fetchItems(goBack ? base.meta.value.current_page - 1 : undefined)
    } catch (e) {
      console.error('Failed to delete list:', e)
      error.value = t('lists.errors.deleteFailed')
    }
  }

  return {
    lists: base.items,
    isLoading: base.isLoading,
    meta: base.meta,
    search: base.search,
    activeFilter: base.activeFilter,
    activeSort: base.activeSort,
    isDragEnabled,
    prevPage: base.prevPage,
    nextPage: base.nextPage,
    fetchLists: base.fetchItems,
    error,
    editingListId,
    startEditList,
    saveListName,
    addList,
    removeList,
  }
}
