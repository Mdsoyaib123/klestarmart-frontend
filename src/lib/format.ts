import { CURRENCY_SYMBOL } from '@/config/site'

const formatter = new Intl.NumberFormat('en-BD', { maximumFractionDigits: 0 })

export const formatPrice = (value: number) => `${CURRENCY_SYMBOL}${formatter.format(value)}`

export const discountPercent = (price: number, compareAt: number) =>
  Math.round((1 - price / compareAt) * 100)
