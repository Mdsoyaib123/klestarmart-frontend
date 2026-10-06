import { baseApi } from '@/api/baseApi'
import type { Category, Product } from '@/types/catalog'
import type { ApiResponse, Banner } from '@/types/site'

export const catalogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => '/categories',
      transformResponse: (response: ApiResponse<Category[]>) => response.data,
    }),
    getProducts: builder.query<Product[], void>({
      query: () => '/products',
      transformResponse: (response: ApiResponse<Product[]>) => response.data,
    }),
    // Accepts a product slug or id.
    getProductById: builder.query<Product, string>({
      query: (idOrSlug) => `/products/${encodeURIComponent(idOrSlug)}`,
      transformResponse: (response: ApiResponse<Product>) => response.data,
    }),
    getBanners: builder.query<Banner[], void>({
      query: () => '/banners',
      transformResponse: (response: ApiResponse<Banner[]>) => response.data,
    }),
  }),
})

export const { useGetCategoriesQuery, useGetProductsQuery, useGetProductByIdQuery, useGetBannersQuery } = catalogApi
