import { ref, watchEffect, onMounted, onUnmounted } from 'vue'
import type { iShoppingList } from '@/types'
import { fetchAllLists, createList, updateList, deleteList } from '@/services/shoppingListService'
import { useAuthStore } from '@/stores/auth'
import echo from '@/plugins/echo'

export type SortKey = 'custom' | 'az' | 'za' | 'items-desc' | 'items-asc' | 'newest' | 'oldest'
export type FilterKey = 'all' | 'shared' | 'private'

export function useShoppingLists() {
  const authStore = useAuthStore()
  const lists = ref<iShoppingList[]>([])
  const error = ref<string>('')
  const isLoading = ref<boolean>(false)
  const editingListId = ref<number | null>(null)

  const search = ref('')
  const activeFilter = ref<FilterKey>('all')
  const activeSort = ref<SortKey>('custom')

  const isDragEnabled = ref(true)
  const displayedLists = ref<iShoppingList[]>([])

  watchEffect(() => {
    isDragEnabled.value = activeSort.value === 'custom' && !search.value && activeFilter.value === 'all'

    let result = [...lists.value]

    if (search.value.trim()) {
      const q = search.value.toLowerCase()
      result = result.filter((l) => l.name.toLowerCase().includes(q))
    }

    if (activeFilter.value !== 'all') {
      result = result.filter((l) => l.visibility === activeFilter.value)
    }

    switch (activeSort.value) {
      case 'az':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'za':
        result.sort((a, b) => b.name.localeCompare(a.name))
        break
      case 'items-desc':
        result.sort((a, b) => (b.itemsCount ?? 0) - (a.itemsCount ?? 0))
        break
      case 'items-asc':
        result.sort((a, b) => (a.itemsCount ?? 0) - (b.itemsCount ?? 0))
        break
      case 'newest':
        result.sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''))
        break
      case 'oldest':
        result.sort((a, b) => (a.createdAt ?? '').localeCompare(b.createdAt ?? ''))
        break
    }

    displayedLists.value = result
  })

  onMounted(async () => {
    isLoading.value = true
    try {
      lists.value = await fetchAllLists()
    } catch (e) {
      console.error('Error during list loading:', e)
      lists.value = []
    } finally {
      isLoading.value = false
    }

    const householdId = authStore.user?.householdId
    if (!householdId) return

    echo
      .private(`household.${householdId}`)
      .listen('.ListUpdated', (data: iShoppingList) => {
        lists.value = lists.value.map((l) => (l.id === data.id ? { ...l, name: data.name } : l))
      })
      .listen('.ListCreated', (data: iShoppingList) => {
        if (!lists.value.find((l) => l.id === data.id)) {
          lists.value.push({ ...data, isNew: false, items: [] })
        }
      })
      .listen('.ListDeleted', (data: { id: number }) => {
        lists.value = lists.value.filter((l) => l.id !== data.id)
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
      error.value = 'Please enter a list name!'
      return
    }
    try {
      await updateList(list.id, list.name.trim())
      editingListId.value = null
    } catch (e) {
      console.error('Failed to update list:', e)
      error.value = 'Failed to update list. Try again.'
      editingListId.value = null
    }
  }

  async function addList(name: string) {
    if (!name.trim() || name.trim().length < 3) {
      error.value = 'Please enter a list name!'
      return
    }
    try {
      const data = await createList(name.trim(), 'private')
      lists.value.push({ id: data.id, name: data.name, visibility: data.visibility, isOwner: data.isOwner, sortOrder: data.sortOrder, itemsCount: 0, isNew: true, items: [] })
    } catch (e) {
      console.error('Failed to create list:', e)
      error.value = 'Failed to create list. Try again.'
    }
  }

  async function removeList(id: number) {
    try {
      await deleteList(id)
      lists.value = lists.value.filter((list) => list.id !== id)
    } catch (e) {
      console.error('Failed to delete list:', e)
      error.value = 'Failed to delete list. Try again.'
    }
  }

  return {
    lists,
    displayedLists,
    error,
    isLoading,
    editingListId,
    search,
    activeFilter,
    activeSort,
    isDragEnabled,
    startEditList,
    saveListName,
    addList,
    removeList,
  }
}
