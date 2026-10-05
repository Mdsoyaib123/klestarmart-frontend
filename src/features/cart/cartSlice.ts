import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { DELIVERY_RATES, FREE_SHIPPING_THRESHOLD, INSIDE_DHAKA_DISTRICTS, type DeliveryRegion } from '@/config/site'
import type { RootState } from '@/app/store'
import type { Product } from '@/types/catalog'

export interface CartItem {
  id: string
  name: string
  brand: string
  category: string
  price: number
  stock: number
  imageUrl?: string
  quantity: number
}

export const CART_STORAGE_KEY = 'klestar:cart'

const loadCart = (): CartItem[] => {
  try {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: loadCart() },
  reducers: {
    addItem: (state, action: PayloadAction<{ product: Product; quantity?: number }>) => {
      const { product, quantity = 1 } = action.payload
      const existing = state.items.find((item) => item.id === product.id)
      if (existing) {
        existing.quantity = Math.min(existing.quantity + quantity, product.stock)
        return
      }
      state.items.push({
        id: product.id,
        name: product.name,
        brand: product.brand,
        category: product.category,
        price: product.price,
        stock: product.stock,
        imageUrl: product.imageUrl,
        quantity: Math.min(quantity, product.stock),
      })
    },
    setQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find((entry) => entry.id === action.payload.id)
      if (item) item.quantity = Math.max(1, Math.min(action.payload.quantity, item.stock))
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
    clearCart: (state) => {
      state.items = []
    },
  },
})

export const { addItem, setQuantity, removeItem, clearCart } = cartSlice.actions
export default cartSlice.reducer

export const selectCartItems = (state: RootState) => state.cart.items
export const selectCartCount = (state: RootState) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
export const selectCartSubtotal = (state: RootState) =>
  state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

export const regionForDistrict = (district: string): DeliveryRegion =>
  INSIDE_DHAKA_DISTRICTS.includes(district) ? 'dhaka' : 'outside'

export const shippingFor =(subtotal: number, region: DeliveryRegion = 'dhaka') =>
  subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : DELIVERY_RATES[region].fee
