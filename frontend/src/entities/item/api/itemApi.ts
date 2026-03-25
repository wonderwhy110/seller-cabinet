// @entities/item/api/itemApi.ts
import { apiInstance } from '@shared/api'
import type { Item, ItemsGetOut, ItemsQueryParams, ItemUpdateIn, Category } from '@shared/types'

export const itemApi = {
  // GET /items — список объявлений
  getItems: async (params: ItemsQueryParams, signal?: AbortSignal): Promise<ItemsGetOut> => {
    const query: Record<string, string> = {}

    if (params.q) query.q = params.q
    if (params.limit != null) query.limit = String(params.limit)
    if (params.skip != null) query.skip = String(params.skip)
    if (params.needsRevision) query.needsRevision = 'true'
    if (params.sortColumn) query.sortColumn = params.sortColumn
    if (params.sortDirection) query.sortDirection = params.sortDirection
    if (params.categories?.length) {
      query.categories = params.categories.join(',')
    }

    const response = await apiInstance.get<ItemsGetOut>('/items', { params: query, signal })
    return response.data
  },

  // GET /items/:id — получение конкретного объявления
  getItem: async (id: number, signal?: AbortSignal): Promise<Item> => {
    const response = await apiInstance.get<Item>(`/items/${id}`, { signal })
    return response.data
  },

  // PUT /items/:id — обновление объявления
  updateItem: async (id: number, data: ItemUpdateIn): Promise<Item> => {
    const response = await apiInstance.put<Item>(`/items/${id}`, data)
    return response.data
  },
  findIdByTitle: async (title: string): Promise<number | null> => {
    for (let id = 1; id <= 32; id++) {
      const item = await apiInstance.get<{ id: number; title: string }>(`/items/${id}`)
      if (item.data.title === title) return item.data.id
    }
    return null
  },
}
