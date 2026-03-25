import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { Category } from '@shared/types'

interface FiltersState {
  search: string
  categories: Category[]
  needsRevision: boolean
  sortColumn: 'title' | 'createdAt'
  sortDirection: 'asc' | 'desc'
  page: number
}

const initialState: FiltersState = {
  search: '',
  categories: [],
  needsRevision: false,
  sortColumn: 'createdAt',
  sortDirection: 'desc',
  page: 1,
}

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload
      state.page = 1 // сбрасываем страницу при поиске
    },
    setCategories(state, action: PayloadAction<Category[]>) {
      state.categories = action.payload
      state.page = 1
    },
    setNeedsRevision(state, action: PayloadAction<boolean>) {
      state.needsRevision = action.payload
      state.page = 1
    },
    setSort(state, action: PayloadAction<{ column: 'title' | 'createdAt'; direction: 'asc' | 'desc' }>) {
      state.sortColumn = action.payload.column
      state.sortDirection = action.payload.direction
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload
    },
    resetFilters() {
      return initialState
    },
  },
})

export const {
  setSearch,
  setCategories,
  setNeedsRevision,
  setSort,
  setPage,
  resetFilters,
} = filtersSlice.actions

export default filtersSlice.reducer