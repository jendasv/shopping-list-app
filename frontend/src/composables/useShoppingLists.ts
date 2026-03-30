import { ref, onMounted } from 'vue'
import type { iShoppingList } from '@/types'
import { fetchAllLists, createList, updateList, deleteList } from '@/services/shoppingListService'

export function useShoppingLists() {
  const lists = ref<iShoppingList[]>([])
  const error = ref<string>('')
  const isLoading = ref<boolean>(false)
  const editingListId = ref<number | null>(null)

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
      const data = await createList(name.trim())
      lists.value.push({ id: data.id, name: data.name, isNew: true, items: [] })
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

  return { lists, error, isLoading, editingListId, startEditList, saveListName, addList, removeList }
}
