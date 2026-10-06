import { baseApi } from '@/api/baseApi'
import type { ApiResponse, CheckoutInput, Order } from '@/types/site'

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    placeOrder: builder.mutation<Order, CheckoutInput>({
      query: (body) => ({ url: '/orders', method: 'POST', body }),
      transformResponse: (response: ApiResponse<Order>) => response.data,
      invalidatesTags: ['MyOrders'],
    }),
  }),
})

export const { usePlaceOrderMutation } = ordersApi
