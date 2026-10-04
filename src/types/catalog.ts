export interface Category {
  slug: string
  name: string
  description: string
  highlights: string[]
  imageUrl?: string
}

export interface Product {
  id: string
  sku: string
  name: string
  brand: string
  description: string
  specs: [label: string, value: string][]
  price: number
  compareAtPrice?: number
  category: string
  rating: number
  reviewCount: number
  stock: number
  imageUrl?: string
  images?: string[]
  badge?: 'New' | 'Sale' | 'Bestseller'
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
