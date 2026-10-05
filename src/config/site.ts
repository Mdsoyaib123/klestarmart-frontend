export const SITE_NAME = 'KlestarMart'
export const TAGLINE = 'ভালো জিনিস, Better লাইফ'
export const CURRENCY_SYMBOL = '৳'
export const FREE_SHIPPING_THRESHOLD = 3000

export const DELIVERY_RATES = {
  dhaka: { label: 'Inside Dhaka', fee: 60, eta: '1-2 days', days: [1, 2] },
  outside: { label: 'Outside Dhaka', fee: 120, eta: '3-5 days', days: [3, 5] },
} as const

export type DeliveryRegion = keyof typeof DELIVERY_RATES

// Districts charged the inside-Dhaka rate; every other district uses the outside rate.
export const INSIDE_DHAKA_DISTRICTS: readonly string[] = ['Dhaka']
