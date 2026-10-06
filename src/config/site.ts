import type { SiteSettings } from '@/types/site'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5050/api'
export const CURRENCY_SYMBOL = '৳'

// Used until the settings load from the API, and if the API cannot be reached.
// Admins change the live values from the dashboard's Settings page.
export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'KlestarMart',
  tagline: 'ভালো জিনিস, Better লাইফ',
  logoUrl: '',
  announcement: { enabled: true, text: 'Free delivery on orders over ৳3,000 · Cash on delivery available' },
  contact: { email: 'support@klestarmart.com', phone: '', address: '' },
  social: { facebook: '', instagram: '', youtube: '' },
  shipping: {
    dhaka: { fee: 60, minDays: 1, maxDays: 2 },
    outside: { fee: 120, minDays: 3, maxDays: 5 },
    freeShippingThreshold: 3000,
    insideDhakaDistricts: ['Dhaka'],
  },
  returnDays: 30,
  seo: { metaDescription: '' },
}
