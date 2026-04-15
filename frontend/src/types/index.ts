export interface iUser {
  id: number
  name: string
  email: string
  emailVerifiedAt: string | null
  isSuperAdmin: boolean
  householdId: number | null
  locale: string | null
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

export type ListType = 'shopping' | 'packing' | 'todo'
export type ListStatus = 'active' | 'completed' | 'archived'

export interface iItem {
  id: number
  name: string
  quantity: number | null
  isCompleted: boolean
  listId: number
  unitId?: number | null
  notes?: string | null
  createdAt?: string
  updatedAt?: string
  isNew?: boolean
}

export interface iListMeta {
  current_page: number
  last_page: number
  total: number
  per_page: number
}

export interface iListsResponse<T = unknown> {
  data: T[]
  meta: iListMeta
}

export interface iList {
  id: number
  name: string
  listType: ListType
  status: ListStatus
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
  listType?: ListType
  items: iItem[]
}
