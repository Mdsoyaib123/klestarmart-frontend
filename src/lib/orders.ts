import type { OrderStatus } from '@/types/site'

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Order placed',
  confirmed: 'Confirmed',
  processing: 'Being packed',
  shipped: 'On the way',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  returned: 'Returned',
}

export const ORDER_STATUS_TONES: Record<OrderStatus, string> = {
  pending: 'bg-cream text-ink',
  confirmed: 'bg-brand-soft text-brand',
  processing: 'bg-brand-soft text-brand',
  shipped: 'bg-brand-soft text-brand',
  delivered: 'bg-[#dff3ea] text-success',
  cancelled: 'bg-accent-soft text-accent',
  returned: 'bg-accent-soft text-accent',
}
