export interface Category {
  slug: string
  name: string
  description: string
  highlights: string[]
}

export interface Product {
  id: string
  name: string
  brand: string
  description: string
  price: number
  compareAtPrice?: number
  category: string
  rating: number
  reviewCount: number
  stock: number
  imageUrl?: string
  badge?: 'New' | 'Sale' | 'Bestseller'
}
