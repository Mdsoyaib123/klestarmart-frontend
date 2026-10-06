import { CheckCircle2, Package, Phone } from 'lucide-react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useGetMeQuery } from '@/features/account/accountApi'
import { useSiteSettings } from '@/features/settings/settingsApi'
import { formatPrice } from '@/lib/format'
import Container from '@/components/ui/Container'
import ProductImage from '@/components/product/ProductImage'
import type { Order } from '@/types/site'

export default function OrderConfirmation() {
  const { orderNumber } = useParams()
  const order = (useLocation().state as { order?: Order } | null)?.order
  const { data: me } = useGetMeQuery()
  const { contact } = useSiteSettings()

  return (
    <Container className="py-12 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <CheckCircle2 className="mx-auto h-14 w-14 text-success" strokeWidth={1.5} />
          <h1 className="mt-4 font-display text-3xl font-semibold">Thank you for your order!</h1>
          <p className="mt-2 text-muted">
            Your order number is <strong className="text-ink">{orderNumber}</strong>.
          </p>
          <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-muted">
            <Phone className="h-4 w-4" /> We will call {order?.customer.phone ?? 'you'} shortly to confirm it.
          </p>
        </div>

        {order && (
          <div className="mt-10 rounded-3xl border border-line bg-white p-6 sm:p-8">
            <ul className="divide-y divide-line">
              {order.items.map((item) => (
                <li key={item.product} className="flex items-center gap-4 py-3">
                  <ProductImage name={item.name} category="" imageUrl={item.imageUrl} className="aspect-square w-14 shrink-0 rounded-xl" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{item.name}</p>
                    <p className="text-sm text-muted">
                      {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                  <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd>{formatPrice(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Delivery</dt>
                <dd>{order.shippingFee === 0 ? 'Free' : formatPrice(order.shippingFee)}</dd>
              </div>
              <div className="flex justify-between text-base font-semibold">
                <dt>Total to pay on delivery</dt>
                <dd>{formatPrice(order.total)}</dd>
              </div>
            </dl>
            <div className="mt-6 rounded-2xl bg-cream p-4 text-sm">
              <p className="font-medium">Delivering to</p>
              <p className="mt-1 text-muted">
                {order.customer.name}, {order.shippingAddress.address}, {order.shippingAddress.upazila}, {order.shippingAddress.district}
              </p>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {me ? (
            <Link to="/account" className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-6 py-3 text-sm font-medium hover:border-brand">
              <Package className="h-4 w-4" /> View my orders
            </Link>
          ) : (
            <Link to="/register" className="rounded-full border border-line bg-white px-6 py-3 text-sm font-medium hover:border-brand">
              Create an account to track orders
            </Link>
          )}
          <Link to="/shop" className="rounded-full bg-brand px-6 py-3 text-sm font-medium text-white hover:bg-brand-dark">
            Continue shopping
          </Link>
        </div>
        {contact.phone && <p className="mt-6 text-center text-sm text-muted">Questions? Call us on {contact.phone}.</p>}
      </div>
    </Container>
  )
}
