import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { categories, products } from '@/data/catalog'
import { generateReviews } from '@/data/reviews'
import type { Category, Product, Review } from '@/types/catalog'

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Mock endpoints; swap `fakeBaseQuery` for `fetchBaseQuery` once the backend exposes these routes.
export const catalogApi = createApi({
  reducerPath: 'catalogApi',
  baseQuery: fakeBaseQuery<string>(),
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      queryFn: async () => {
        await wait(150)
        return { data: categories }
      },
    }),
    getProducts: builder.query<Product[], void>({
      queryFn: async () => {
        await wait(350)
        return { data: products }
      },
    }),
    getProductById: builder.query<Product, string>({
      queryFn: async (id) => {
        await wait(250)
        const product = products.find((item) => item.id === id)
        return product ? { data: product } : { error: 'Product not found' }
      },
    }),
    getReviews: builder.query<Review[], string>({
      queryFn: async (id) => {
        await wait(300)
        const product = products.find((item) => item.id === id)
        return product ? { data: generateReviews(product) } : { error: 'Product not found' }
      },
    }),
  }),
})

export const { useGetCategoriesQuery, useGetProductsQuery, useGetProductByIdQuery, useGetReviewsQuery } = catalogApi
