export type Category = 'auto' | 'real_estate' | 'electronics'

export interface AutoItemParams {
  brand?: string
  model?: string
  yearOfManufacture?: number
  transmission?: 'automatic' | 'manual'
  mileage?: number
  enginePower?: number
}

export interface RealEstateItemParams {
  type?: 'flat' | 'house' | 'room'
  address?: string
  area?: number
  floor?: number
}

export interface ElectronicsItemParams {
  type?: 'phone' | 'laptop' | 'misc'
  brand?: string
  model?: string
  condition?: 'new' | 'used'
  color?: string
}

export type ItemParams = AutoItemParams | RealEstateItemParams | ElectronicsItemParams

export type Item = {
  id: number
  title: string
  description?: string
  price: number | null
  createdAt: string
  updatedAt: string
} & (
  | { category: 'auto'; params: AutoItemParams }
  | { category: 'real_estate'; params: RealEstateItemParams }
  | { category: 'electronics'; params: ElectronicsItemParams }
)

export interface ItemListItem {
  category: Category
  title: string
  price: number | null
  needsRevision: boolean
  tempId?: number
  globalIndex?: number
}

export interface ItemsGetOut {
  items: ItemListItem[]
  total: number
}
export interface ItemUpdateIn {
  category: Category
  title: string
  description?: string
  price: number
  params: ItemParams
}

export interface ItemsQueryParams {
  q?: string
  limit?: number
  skip?: number
  needsRevision?: boolean
  categories?: Category[]
  sortColumn?: 'title' | 'createdAt' | 'id'
  sortDirection?: 'asc' | 'desc'
}
