import { configureStore } from '@reduxjs/toolkit'
import { baseApi } from '@/api/baseApi'
import cartReducer, { CART_STORAGE_KEY } from '@/features/cart/cartSlice'
import wishlistReducer, { WISHLIST_STORAGE_KEY } from '@/features/wishlist/wishlistSlice'
import uiReducer from '@/features/ui/uiSlice'
import reviewsReducer, { REVIEWS_STORAGE_KEY } from '@/features/reviews/reviewsSlice'
import recentReducer, { RECENT_STORAGE_KEY } from '@/features/recent/recentSlice'

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    ui: uiReducer,
    reviews: reviewsReducer,
    recent: recentReducer,
  },
  middleware: (getDefault) => getDefault().concat(baseApi.middleware),
})

// Persist each slice only when it changes, rather than on every dispatched action.
const persisted = [
  { key: CART_STORAGE_KEY, select: () => store.getState().cart.items },
  { key: WISHLIST_STORAGE_KEY, select: () => store.getState().wishlist.ids },
  { key: REVIEWS_STORAGE_KEY, select: () => store.getState().reviews.items },
  { key: RECENT_STORAGE_KEY, select: () => store.getState().recent.ids },
]
const lastSaved = new Map(persisted.map(({ key, select }) => [key, select() as unknown]))

store.subscribe(() => {
  for (const { key, select } of persisted) {
    const value = select()
    if (value === lastSaved.get(key)) continue
    lastSaved.set(key, value)
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Storage is full or blocked (private mode); the in-memory state still works.
    }
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
