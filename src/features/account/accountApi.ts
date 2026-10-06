import { baseApi } from '@/api/baseApi'
import type { ApiResponse, Customer, Order } from '@/types/site'

export const accountApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<Customer | null, void>({
      // Signed-out visitors get 401, which simply means "no account".
      queryFn: async (_arg, _api, _extra, baseQuery) => {
        const result = await baseQuery('/auth/me')
        if (result.error) return result.error.status === 401 ? { data: null } : { error: result.error }
        return { data: (result.data as ApiResponse<Customer>).data }
      },
      providesTags: ['Me'],
    }),
    register: builder.mutation<Customer, { name: string; phone: string; email?: string; password: string }>({
      query: (body) => ({ url: '/auth/register', method: 'POST', body }),
      transformResponse: (response: ApiResponse<Customer>) => response.data,
      invalidatesTags: ['Me', 'MyOrders'],
    }),
    login: builder.mutation<Customer, { identifier: string; password: string }>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
      transformResponse: (response: ApiResponse<Customer>) => response.data,
      invalidatesTags: ['Me', 'MyOrders'],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
      invalidatesTags: ['Me', 'MyOrders'],
    }),
    getMyOrders: builder.query<Order[], void>({
      query: () => '/account/orders',
      transformResponse: (response: ApiResponse<Order[]>) => response.data,
      providesTags: ['MyOrders'],
    }),
  }),
})

export const { useGetMeQuery, useRegisterMutation, useLoginMutation, useLogoutMutation, useGetMyOrdersQuery } = accountApi
