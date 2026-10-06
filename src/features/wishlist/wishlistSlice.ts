import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/app/store'
import { isString, loadArray } from '@/lib/storage'

export const WISHLIST_STORAGE_KEY = 'klestar:wishlist'

const loadWishlist = () => loadArray(WISHLIST_STORAGE_KEY, isString)

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { ids: loadWishlist() },
  reducers: {
    toggleWishlist: (state, action: PayloadAction<string>) => {
      const id = action.payload
      state.ids = state.ids.includes(id) ? state.ids.filter((entry) => entry !== id) : [...state.ids, id]
    },
  },
})

export const { toggleWishlist } = wishlistSlice.actions
export default wishlistSlice.reducer

export const selectWishlistIds = (state: RootState) => state.wishlist.ids
