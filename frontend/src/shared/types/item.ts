export type Category = "auto" | "real_estate" | "electronics"

export type AutoItemParams = {
  brand?: string
  model?: string
  yearOfManufacture?: number
  transmission?: "automatic" | "manual"
  mileage?: number
  enginePower?: number
}

export type RealEstateItemParams = {
  type?: "flat" | "house" | "room"
  address?: string
  area?: number
  floor?: number
}

export type ElectronicsItemParams = {
  type?: "phone" | "laptop" | "misc"
  brand?: string
  model?: string
  condition?: "new" | "used"
  color?: string
}

export type ItemParams = AutoItemParams | RealEstateItemParams | ElectronicsItemParams

export interface Item {
  id: string
  category: Category
  title: string
  price: number
  description?: string
  image?: string
  createdAt: string
  params: ItemParams
  needsRevision: boolean
}

export interface ItemListItem {
  id: string
  category: Category
  title: string
  price: number
  needsRevision: boolean
  image?: string
  createdAt: string
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
  sortColumn?: "title" | "createdAt" | "price"
  sortDirection?: "asc" | "desc"
}
