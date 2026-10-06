import { ShoppingBag, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import {
  removeItem,
  selectCartItems,
  selectCartSubtotal,
  setQuantity,
} from '@/features/cart/cartSlice'
import { formatPrice } from '@/lib/format'
import Container from '@/components/ui/Container'
import QuantityStepper from '@/components/ui/QuantityStepper'
import ProductImage from '@/components/product/ProductImage'
import OrderSummary from '@/components/cart/OrderSummary'

export default function Cart() {
  const dispatch = useAppDispatch()
  const items = useAppSelector(selectCartItems)
  const subtotal = useAppSelector(selectCartSubtotal)

  if (items.length === 0) {
    return (
      <Container className="flex flex-col items-center py-24 text-center">
        <ShoppingBag className="h-12 w-12 text-muted" strokeWidth={1.2} />
        <h1 className="mt-4 font-display text-3xl font-semibold">Your bag is empty</h1>
        <p className="mt-2 text-muted">Looks like you have not added anything yet.</p>
        <Link to="/shop" className="mt-6 rounded-full bg-brand px-8 py-3 font-medium text-white hover:bg-brand-dark">
          Continue shopping
        </Link>
      </Container>
    )
  }

  return (
    <Container className="py-8 sm:py-12">
      <h1 className="mb-8 font-display text-3xl font-semibold sm:text-4xl">Shopping bag</h1>

      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <ul className="divide-y divide-line border-y border-line">
          {items.map((item) => (
            <li key={item.id} className="flex gap-4 py-6 sm:gap-6">
              <Link to={`/product/${item.slug ?? item.id}`} className="w-24 shrink-0 sm:w-32">
                <ProductImage name={item.name} category={item.category} imageUrl={item.imageUrl} className="aspect-[4/5] rounded-2xl" />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted">{item.brand}</p>
                    <Link to={`/product/${item.slug ?? item.id}`} className="font-medium hover:underline">{item.name}</Link>
                    <p className="mt-1 text-sm text-muted">{formatPrice(item.price)} each</p>
                  </div>
                  <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                </div>
                <div className="mt-auto flex items-center justify-between pt-4">
                  <QuantityStepper value={item.quantity} max={item.stock} onChange={(quantity) => dispatch(setQuantity({ id: item.id, quantity }))} />
                  <button type="button" onClick={() => dispatch(removeItem(item.id))} className="flex items-center gap-1.5 text-sm text-muted hover:text-accent">
                    <Trash2 className="h-4 w-4" /> Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-3xl bg-cream p-6 lg:sticky lg:top-36">
          <h2 className="mb-5 font-display text-xl font-semibold">Order summary</h2>
          <OrderSummary subtotal={subtotal} />
          <Link to="/checkout" className="mt-6 block rounded-full bg-brand py-3 text-center font-medium text-white transition hover:bg-brand-dark">
            Proceed to checkout
          </Link>
          <Link to="/shop" className="mt-3 block text-center text-sm font-medium hover:underline">
            Continue shopping
          </Link>
        </aside>
      </div>
    </Container>
  )
}
