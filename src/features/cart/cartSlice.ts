import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/app/store'
import { isRecord, loadArray } from '@/lib/storage'
import type { Product } from '@/types/catalog'

export interface CartItem {
  id: string
  slug?: string
  name: string
  brand: string
  category: string
  price: number
  stock: number
  imageUrl?: string | null
  quantity: number
}

export const CART_STORAGE_KEY = 'klestar:cart'

const isCartItem = (value: unknown): value is CartItem =>
  isRecord(value) &&
  typeof value.id === 'string' &&
  typeof value.name === 'string' &&
  typeof value.price === 'number' &&
  typeof value.stock === 'number' &&
  typeof value.quantity === 'number' &&
  value.quantity >= 1

const loadCart = () => loadArray(CART_STORAGE_KEY, isCartItem)

const snapshot = (product: Product) => ({
  slug: product.slug,
  name: product.name,
  brand: product.brand,
  category: product.category,
  price: product.price,
  stock: product.stock,
  imageUrl: product.imageUrl,
})

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: loadCart() },
  reducers: {
    // `replace` sets the quantity instead of adding to it (used by "Buy it now").
    addItem: (state, action: PayloadAction<{ product: Product; quantity?: number; replace?: boolean }>) => {
      const { product, quantity = 1, replace = false } = action.payload
      if (product.stock <= 0) return
      const existing = state.items.find((item) => item.id === product.id)
      if (existing) {
        Object.assign(existing, snapshot(product))
        existing.quantity = Math.min(replace ? quantity : existing.quantity + quantity, product.stock)
        return
      }
      state.items.push({ id: product.id, ...snapshot(product), quantity: Math.min(quantity, product.stock) })
    },
    // Refreshes saved prices and stock from the live catalog, dropping items that are gone or sold out.
    syncWithCatalog: (state, action: PayloadAction<Product[]>) => {
      const byId = new Map(action.payload.map((product) => [product.id, product]))
      state.items = state.items.flatMap((item) => {
        const product = byId.get(item.id)
        if (!product || product.stock <= 0) return []
        return [{ ...item, ...snapshot(product), quantity: Math.min(item.quantity, product.stock) }]
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

export const { addItem, syncWithCatalog, setQuantity, removeItem, clearCart } = cartSlice.actions
export default cartSlice.reducer

export const selectCartItems = (state: RootState) => state.cart.items
export const selectCartCount = (state: RootState) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
export const selectCartSubtotal = (state: RootState) =>
  state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
