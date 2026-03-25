import { configureStore } from '@reduxjs/toolkit'
import { itemReducer } from '@entities/item'
import { filtersReducer } from '@features/filters'

export const store = configureStore({
  reducer: {
    item: itemReducer,
     filters: filtersReducer,
  },
})

// Типы для useSelector и useDispatch
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch