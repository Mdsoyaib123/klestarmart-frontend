import { formatPrice } from '@/lib/format'

export default function OrderSummary({ subtotal, shipping }: { subtotal: number; shipping?: number }) {
  return (
    <dl className="space-y-3 text-sm">
      <div className="flex justify-between">
        <dt className="text-muted">Subtotal</dt>
        <dd>{formatPrice(subtotal)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-muted">Delivery</dt>
        <dd className={shipping === undefined ? 'text-muted' : ''}>
          {shipping === undefined ? 'Calculated at checkout' : shipping === 0 ? 'Free' : formatPrice(shipping)}
        </dd>
      </div>
      <div className="flex justify-between border-t border-line pt-4 text-base font-semibold">
        <dt>{shipping === undefined ? 'Estimated total' : 'Total'}</dt>
        <dd>{formatPrice(subtotal + (shipping ?? 0))}</dd>
      </div>
    </dl>
  )
}
