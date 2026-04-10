export interface iUser {
  id: number
  name: string
  email: string
  emailVerifiedAt: string | null
  isSuperAdmin: boolean
  householdId: number | null
}

export interface iHouseholdMember {
  id: number
  name: string
  email: string
  role: 'owner' | 'member'
}

export interface iHousehold {
  id: number
  name: string
  isActive: boolean
  members: iHouseholdMember[]
}

export interface iHouseholdOverview {
  ownHousehold: iHousehold
  joinedHouseholds: iHousehold[]
}

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
  visibility: 'shared' | 'private'
  isOwner: boolean | null
  sortOrder: number | null
  itemsCount?: number
  completedCount?: number
  createdAt?: string
  updatedAt?: string
  isNew?: boolean
  items: iItem[]
}

export interface iNewList {
  name: string
  items: iItem[]
}
