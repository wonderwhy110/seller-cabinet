import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction} from '@reduxjs/toolkit'
import type { ItemListItem } from '@shared/types'

interface ItemState {
  // Текущее открытое объявление (для передачи между страницами)
  selectedItem: ItemListItem | null
}

const initialState: ItemState = {
  selectedItem: null,
}

const itemSlice = createSlice({
  name: 'item',
  initialState,
  reducers: {
    setSelectedItem(state, action: PayloadAction<ItemListItem | null>) {
      state.selectedItem = action.payload
    },
  },
})

export const { setSelectedItem } = itemSlice.actions
export default itemSlice.reducer