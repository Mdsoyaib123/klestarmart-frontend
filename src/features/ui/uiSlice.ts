import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '@/app/store'

const uiSlice = createSlice({
  name: 'ui',
  initialState: { cartOpen: false },
  reducers: {
    openCart: (state) => {
      state.cartOpen = true
    },
    closeCart: (state) => {
      state.cartOpen = false
    },
  },
})

export const { openCart, closeCart } = uiSlice.actions
export default uiSlice.reducer

export const selectCartOpen = (state: RootState) => state.ui.cartOpen
