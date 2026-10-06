export interface Category {
  id?: string
  slug: string
  name: string
  description: string
  highlights: string[]
  imageUrl?: string | null
}

export interface Product {
  id: string
  slug: string
  sku: string
  name: string
  brand: string
  description: string
  specs: [label: string, value: string][]
  price: number
  compareAtPrice?: number | null
  category: string
  rating: number
  reviewCount: number
  stock: number
  imageUrl?: string | null
  images?: string[]
  badge?: 'New' | 'Sale' | 'Bestseller' | null
}

export interface Review {
  id: string
  productId: string
  author: string
  rating: number
  title: string
  body: string
  date: string
  verified: boolean
  helpful: number
}
