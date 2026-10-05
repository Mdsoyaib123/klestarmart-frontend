import { formatPrice } from '@/lib/format'

interface Props {
  subtotal: number
  shipping?: number
  // Shown in place of the delivery fee while it is not known yet.
  shippingPending?: string
}

export default function OrderSummary({ subtotal, shipping, shippingPending = 'Calculated at checkout' }: Props) {
  return (
    <dl className="space-y-3 text-sm">
      <div className="flex justify-between">
        <dt className="text-muted">Subtotal</dt>
        <dd>{formatPrice(subtotal)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-muted">Delivery</dt>
        <dd className={shipping === undefined ? 'text-muted' : ''}>
          {shipping === undefined ? shippingPending : shipping === 0 ? 'Free' : formatPrice(shipping)}
        </dd>
      </div>
      <div className="flex justify-between border-t border-line pt-4 text-base font-semibold">
        <dt>{shipping === undefined ? 'Estimated total' : 'Total'}</dt>
        <dd>{formatPrice(subtotal + (shipping ?? 0))}</dd>
      </div>
    </dl>
  )
}
