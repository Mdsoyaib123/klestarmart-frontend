import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/app/store'
import { isRecord, loadArray } from '@/lib/storage'
import type { Review } from '@/types/catalog'

export const REVIEWS_STORAGE_KEY = 'klestar:reviews'

const isReview = (value: unknown): value is Review =>
  isRecord(value) &&
  typeof value.id === 'string' &&
  typeof value.productId === 'string' &&
  typeof value.rating === 'number' &&
  typeof value.date === 'string'

const load = () => loadArray(REVIEWS_STORAGE_KEY, isReview)

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
