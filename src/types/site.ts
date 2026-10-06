export interface DeliveryRate {
  fee: number
  minDays: number
  maxDays: number
}

// Matches the backend settings model (backend/src/modules/settings/settings.model.ts).
export interface SiteSettings {
  siteName: string
  tagline: string
  logoUrl: string
  announcement: { enabled: boolean; text: string }
  contact: { email: string; phone: string; address: string }
  social: { facebook: string; instagram: string; youtube: string }
  shipping: {
    dhaka: DeliveryRate
    outside: DeliveryRate
    freeShippingThreshold: number
    insideDhakaDistricts: string[]
  }
  returnDays: number
  seo: { metaDescription: string }
}

export type DeliveryRegion = 'dhaka' | 'outside'

export interface Banner {
  id: string
  eyebrow: string
  title: string
  text: string
  imageUrl?: string | null
  ctaLabel: string
  ctaLink: string
  secondaryLabel: string
  secondaryLink: string
  theme: 'light' | 'dark' | 'accent'
}

export interface Customer {
  id: string
  name: string
  phone?: string
  email?: string
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned'

export interface Order {
  id: string
  orderNumber: string
  customer: { name: string; phone: string; email?: string }
  shippingAddress: { district: string; upazila: string; address: string; note?: string }
  items: { product: string; name: string; slug?: string; imageUrl?: string; price: number; quantity: number }[]
  subtotal: number
  shippingFee: number
  total: number
  paymentMethod: string
  paymentStatus: string
  status: OrderStatus
  createdAt: string
}

export interface CheckoutInput {
  customer: { name: string; phone: string; email?: string }
  shippingAddress: { district: string; upazila: string; address: string; note?: string }
  items: { productId: string; quantity: number }[]
  paymentMethod: 'cod'
}

export interface ApiResponse<T> {
  success: boolean
  data: T
}
