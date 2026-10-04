import { configureStore } from '@reduxjs/toolkit'
import { catalogApi } from '@/features/catalog/catalogApi'
import cartReducer, { CART_STORAGE_KEY } from '@/features/cart/cartSlice'
import wishlistReducer, { WISHLIST_STORAGE_KEY } from '@/features/wishlist/wishlistSlice'
import uiReducer from '@/features/ui/uiSlice'
import reviewsReducer, { REVIEWS_STORAGE_KEY } from '@/features/reviews/reviewsSlice'
import recentReducer, { RECENT_STORAGE_KEY } from '@/features/recent/recentSlice'

export const store = configureStore({
  reducer: {
    [catalogApi.reducerPath]: catalogApi.reducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    ui: uiReducer,
    reviews: reviewsReducer,
    recent: recentReducer,
  },
  middleware: (getDefault) => getDefault().concat(catalogApi.middleware),
})

store.subscribe(() => {
  const { cart, wishlist, reviews, recent } = store.getState()
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart.items))
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist.ids))
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews.items))
    localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(recent.ids))
  } catch {
    return
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
