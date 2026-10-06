import { createApi, fetchBaseQuery, type FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import { API_BASE_URL } from '@/config/site'

// Feature APIs add their endpoints with `baseApi.injectEndpoints`.
export const baseApi = createApi({
  reducerPath: 'api',
  // Sends the customer session cookie with every request.
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL, credentials: 'include' }),
  tagTypes: ['Me', 'MyOrders'],
  endpoints: () => ({}),
})

// The backend's `{ message }` from a failed request, for display.
export const errorMessage = (error: unknown) => {
  if (error && typeof error === 'object' && 'status' in error) {
    const { status, data } = error as FetchBaseQueryError
    if (data && typeof data === 'object' && 'message' in data && typeof data.message === 'string') return data.message
    if (status === 'FETCH_ERROR') return 'We could not reach the store. Please check your connection and try again.'
  }
  return 'Something went wrong. Please try again.'
}
