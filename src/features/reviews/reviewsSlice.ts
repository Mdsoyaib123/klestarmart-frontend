import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/app/store'
import type { Review } from '@/types/catalog'

export const REVIEWS_STORAGE_KEY = 'klestar:reviews'

const load = (): Review[] => {
  try {
    return JSON.parse(localStorage.getItem(REVIEWS_STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

// Reviews written by the visitor are kept in the browser until the backend has a reviews API.
const reviewsSlice = createSlice({
  name: 'reviews',
  initialState: { items: load() },
  reducers: {
    addReview: (state, action: PayloadAction<Review>) => {
      state.items.unshift(action.payload)
    },
  },
})

export const { addReview } = reviewsSlice.actions
export default reviewsSlice.reducer

export const selectUserReviews = (state: RootState) => state.reviews.items
