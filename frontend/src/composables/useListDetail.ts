import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { iShoppingList, iItem } from '@/types'
import { fetchList } from '@/services/shoppingListService'
import { createItem, updateItem, deleteItem } from '@/services/itemService'

export function useListDetail(id: string) {
  const route = useRoute()
  const list = ref<iShoppingList | null>(null)
  const error = ref<string>('')
  const isLoading = ref<boolean>(false)
  const editingItemId = ref<number | null>(null)

  onMounted(async () => {
    if (route.meta.list) {
      list.value = route.meta.list
      return
    }
    isLoading.value = true
    try {
      list.value = await fetchList(id)
    } catch (e) {
      console.error('Failed to load list:', e)
    } finally {
      isLoading.value = false
    }
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
    try {
      await updateItem(listId, itemId, { isCompleted: !isCompleted })
      list.value.items = list.value.items.map((item: iItem) =>
        item.id === itemId ? { ...item, isCompleted: !isCompleted } : item,
      )
    } catch (e) {
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
