export interface iItem {
  id: number
  name: string
  quantity: number
  isCompleted: boolean
  shoppingListId: number
  createdAt?: string
  updatedAt?: string
  isNew?: boolean
}

export interface iShoppingList {
  id: number
  name: string
  createdAt?: string
  updatedAt?: string
  isNew?: boolean
  items: iItem[]
}

export interface iNewList {
  name: string
  items: iItem[]
}
