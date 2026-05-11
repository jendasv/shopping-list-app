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

export interface iUnit {
  id: number
  symbol: string
  name: string
}

export interface iUnitGroups {
  count?: iUnit[]
  weight?: iUnit[]
  volume?: iUnit[]
  piece?: iUnit[]
  [key: string]: iUnit[] | undefined
}

export interface iCategory {
  id: number
  name: string
  is_global: boolean
}

export interface iGlobalProduct {
  id: number
  name: string
  brand: string | null
  barcode: string | null
  image_url: string | null
  default_category_id: number | null
  default_unit_id: number | null
  verified: boolean
  scan_count: number
}

export interface iProduct {
  id: number
  name: string
  barcode: string | null
  notes: string | null
  preferred_quantity: number | null
  category_id: number | null
  category: { id: number; name: string } | null
  preferred_unit_id: number | null
  unit: { id: number; symbol: string } | null
  global_product_id: number | null
}

export interface iItem {
  id: number
  name: string
  quantity: number | null
  isCompleted: boolean
  listId: number
  unit_id?: number | null
  unit?: { id: number; symbol: string } | null
  notes?: string | null
  product_id?: number | null
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
