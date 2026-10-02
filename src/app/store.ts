import { configureStore } from '@reduxjs/toolkit'
import { catalogApi } from '@/features/catalog/catalogApi'
import cartReducer, { CART_STORAGE_KEY } from '@/features/cart/cartSlice'
import wishlistReducer, { WISHLIST_STORAGE_KEY } from '@/features/wishlist/wishlistSlice'
import uiReducer from '@/features/ui/uiSlice'

export const store = configureStore({
  reducer: {
    [catalogApi.reducerPath]: catalogApi.reducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    ui: uiReducer,
  },
  middleware: (getDefault) => getDefault().concat(catalogApi.middleware),
})

store.subscribe(() => {
  const { cart, wishlist } = store.getState()
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart.items))
  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist.ids))
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
