import { LogOut, Package } from 'lucide-react'
import { Link, Navigate } from 'react-router-dom'
import { useGetMeQuery, useGetMyOrdersQuery, useLogoutMutation } from '@/features/account/accountApi'
import { formatDate, formatPrice } from '@/lib/format'
import { ORDER_STATUS_LABELS, ORDER_STATUS_TONES } from '@/lib/orders'
import Container from '@/components/ui/Container'

export default function Account() {
  const { data: me, isLoading } = useGetMeQuery()
  const { data: orders = [], isLoading: ordersLoading } = useGetMyOrdersQuery(undefined, { skip: !me })
  const [logout, { isLoading: loggingOut }] = useLogoutMutation()

  if (isLoading) return <Container className="py-24 text-center text-muted">Loading…</Container>
  if (!me) return <Navigate to="/login" replace state={{ from: '/account' }} />

  return (
    <Container className="py-8 sm:py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">Hello, {me.name.split(' ')[0]}</h1>
          <p className="mt-1 text-sm text-muted">{[me.phone, me.email].filter(Boolean).join(' · ')}</p>
        </div>
        <button
          type="button"
          onClick={() => logout()}
          disabled={loggingOut}
          className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-2.5 text-sm font-medium hover:border-accent hover:text-accent"
        >
          <LogOut className="h-4 w-4" /> Log out
        </button>
      </div>

      <h2 className="mb-4 font-display text-xl font-semibold">My orders</h2>
      {ordersLoading ? (
        <p className="text-muted">Loading your orders…</p>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center rounded-3xl border border-dashed border-line py-16 text-center">
          <Package className="h-10 w-10 text-muted" strokeWidth={1.3} />
          <p className="mt-3 font-medium">No orders yet</p>
          <Link to="/shop" className="mt-5 rounded-full bg-brand px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-dark">
            Start shopping
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order.id} className="rounded-3xl border border-line bg-white p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">Order {order.orderNumber}</p>
                  <p className="text-sm text-muted">Placed {formatDate(order.createdAt)}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${ORDER_STATUS_TONES[order.status]}`}>{ORDER_STATUS_LABELS[order.status]}</span>
              </div>
              <ul className="mt-4 space-y-1 text-sm text-muted">
                {order.items.map((item) => (
                  <li key={item.product} className="flex justify-between gap-4">
                    <span className="truncate">
                      {item.quantity} × {item.name}
                    </span>
                    <span className="shrink-0">{formatPrice(item.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 flex justify-between border-t border-line pt-3 font-semibold">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </p>
            </li>
          ))}
        </ul>
      )}
    </Container>
  )
}
