import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import type { iShoppingList, iItem } from '@/types'
import { fetchList } from '@/services/shoppingListService'
import { createItem, updateItem, deleteItem } from '@/services/itemService'
import { useAuthStore } from '@/stores/auth'
import echo from '@/plugins/echo'

export function useListDetail(id: string) {
  const route = useRoute()
  const authStore = useAuthStore()
  const list = ref<iShoppingList | null>(null)
  const error = ref<string>('')
  const isLoading = ref<boolean>(false)
  const editingItemId = ref<number | null>(null)

  function sortItems(items: iItem[]): iItem[] {
    return [
      ...items.filter((i) => !i.isCompleted),
      ...items.filter((i) => i.isCompleted),
    ]
  }

  onMounted(async () => {
    if (route.meta.list) {
      list.value = route.meta.list
    } else {
      isLoading.value = true
      try {
        list.value = await fetchList(id)
      } catch (e) {
        console.error('Failed to load list:', e)
      } finally {
        isLoading.value = false
      }
    }

    const householdId = authStore.user?.householdId
    if (!householdId) return

    echo
      .private(`household.${householdId}`)
      .listen('.ItemAdded', (data: iItem & { shoppingListId: number }) => {
        if (!list.value || data.shoppingListId !== list.value.id) return
        if (list.value.items.some((i) => i.id === data.id)) return
        list.value.items.push(data)
      })
      .listen('.ItemUpdated', (data: iItem & { shoppingListId: number }) => {
        if (!list.value || data.shoppingListId !== list.value.id) return
        list.value.items = sortItems(
          list.value.items.map((i) => (i.id === data.id ? { ...i, ...data } : i)),
        )
      })
      .listen('.ItemDeleted', (data: { id: number; listId: number }) => {
        if (!list.value || data.listId !== list.value.id) return
        list.value.items = list.value.items.filter((i) => i.id !== data.id)
      })
      .listen('.ItemsReordered', (data: { listId: number; order: number[] }) => {
        if (!list.value || data.listId !== list.value.id) return
        const indexMap = new Map(data.order.map((id, pos) => [id, pos]))
        list.value.items = [...list.value.items].sort(
          (a, b) => (indexMap.get(a.id) ?? 0) - (indexMap.get(b.id) ?? 0),
        )
      })
  })

  onUnmounted(() => {
    const householdId = authStore.user?.householdId
    if (householdId) echo.leave(`household.${householdId}`)
  })

  async function removeItemFromList(listId: number, itemId: number) {
    if (!list.value) return
    try {
      await deleteItem(listId, itemId)
      list.value.items = list.value.items.filter((item) => item.id !== itemId)
    } catch (e) {
      console.error('Failed to remove item:', e)
      error.value = 'Failed to remove item. Try again.'
    }
  }

  async function setComplete(listId: number, itemId: number, isCompleted: boolean) {
    if (!list.value) return
    const newCompleted = !isCompleted
    list.value.items = sortItems(
      list.value.items.map((item: iItem) =>
        item.id === itemId ? { ...item, isCompleted: newCompleted } : item,
      ),
    )
    try {
      await updateItem(listId, itemId, { isCompleted: newCompleted })
    } catch (e) {
      list.value.items = sortItems(
        list.value.items.map((item: iItem) =>
          item.id === itemId ? { ...item, isCompleted } : item,
        ),
      )
      console.error('Failed to update item:', e)
      error.value = 'Failed to update item. Try again.'
    }
  }

  async function addItem(item: iItem) {
    const name = item.name.trim()
    if (!name) {
      error.value = 'Please enter an item name!'
      return
    }
    if (item.quantity < 1) {
      error.value = 'Please enter a quantity greater than 0!'
      return
    }
    try {
      const data = await createItem(id, { name, quantity: item.quantity, isCompleted: item.isCompleted })
      const lastItem = data.items[data.items.length - 1]
      if (!lastItem || !list.value) return
      lastItem.isNew = true
      list.value.items.push(lastItem)
    } catch (e) {
      console.error('Failed to add item:', e)
      error.value = 'Failed to add item. Try again.'
    }
  }

  function startEdit(item: iItem) {
    editingItemId.value = item.id
  }

  async function saveItem(listId: number, item: iItem) {
    if (!item.name.trim()) {
      error.value = 'Please enter an item name!'
      return
    }
    if (item.quantity < 1) {
      error.value = 'Please enter a quantity greater than 0!'
      return
    }
    try {
      await updateItem(listId, item.id, { name: item.name, quantity: item.quantity, isCompleted: item.isCompleted })
      item.isNew = true
      editingItemId.value = null
    } catch (e) {
      console.error('Failed to update item:', e)
      error.value = 'Failed to update item. Try again.'
      editingItemId.value = null
    }
  }

  return { list, error, isLoading, editingItemId, removeItemFromList, setComplete, addItem, startEdit, saveItem }
}
