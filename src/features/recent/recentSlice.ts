import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/app/store'

export const RECENT_STORAGE_KEY = 'klestar:recent'
const MAX_RECENT = 8

const load = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(RECENT_STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

const recentSlice = createSlice({
  name: 'recent',
  initialState: { ids: load() },
  reducers: {
    viewProduct: (state, action: PayloadAction<string>) => {
      state.ids = [action.payload, ...state.ids.filter((id) => id !== action.payload)].slice(0, MAX_RECENT)
    },
  },
})

export const { viewProduct } = recentSlice.actions
export default recentSlice.reducer

export const selectRecentIds = (state: RootState) => state.recent.ids
