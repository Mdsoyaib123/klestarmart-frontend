import { ShoppingBag, Trash2, X } from 'lucide-react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import {
  removeItem,
  selectCartCount,
  selectCartItems,
  selectCartSubtotal,
  setQuantity,
} from '@/features/cart/cartSlice'
import { closeCart, selectCartOpen } from '@/features/ui/uiSlice'
import { FREE_SHIPPING_THRESHOLD } from '@/config/site'
import { formatPrice } from '@/lib/format'
import ProductImage from '@/components/product/ProductImage'
import QuantityStepper from '@/components/ui/QuantityStepper'

export default function CartDrawer() {
  const dispatch = useAppDispatch()
  const open = useAppSelector(selectCartOpen)
  const items = useAppSelector(selectCartItems)
  const count = useAppSelector(selectCartCount)
  const subtotal = useAppSelector(selectCartSubtotal)
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && dispatch(closeCart())
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, dispatch])

  const close = () => dispatch(closeCart())

  return (
    <div className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`}>
      <div className={`absolute inset-0 bg-ink/40 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`} onClick={close} />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        aria-hidden={!open}
        inert={!open}
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-paper shadow-xl transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-display text-lg font-semibold">Your bag ({count})</h2>
          <button type="button" aria-label="Close bag" onClick={close} className="grid h-9 w-9 place-items-center rounded-full hover:bg-cream">
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
            <ShoppingBag className="h-10 w-10 text-muted" strokeWidth={1.2} />
            <p className="font-medium">Your bag is empty</p>
            <p className="text-sm text-muted">Find something you love and it will show up here.</p>
            <Link to="/shop" onClick={close} className="mt-2 rounded-full bg-brand px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-dark">
              Start shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="border-b border-line px-5 py-3 text-sm">
              {remaining > 0 ? (
                <p>
                  You are <strong>{formatPrice(remaining)}</strong> away from free delivery
                </p>
              ) : (
                <p className="font-medium text-brand">You have unlocked free delivery</p>
              )}
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-sand">
                <div
                  className="h-full rounded-full bg-brand transition-all"
                  style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
                />
              </div>
            </div>

            <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 py-4">
                  <Link to={`/product/${item.id}`} onClick={close} className="w-20 shrink-0">
                    <ProductImage name={item.name} category={item.category} imageUrl={item.imageUrl} className="aspect-[4/5] rounded-xl" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs uppercase tracking-wide text-muted">{item.brand}</p>
                        <Link to={`/product/${item.id}`} onClick={close} className="line-clamp-2 text-sm font-medium hover:underline">
                          {item.name}
                        </Link>
                      </div>
                      <button type="button" aria-label={`Remove ${item.name}`} onClick={() => dispatch(removeItem(item.id))} className="h-fit text-muted hover:text-accent">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <QuantityStepper compact value={item.quantity} max={item.stock} onChange={(quantity) => dispatch(setQuantity({ id: item.id, quantity }))} />
                      <span className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="space-y-3 border-t border-line p-5">
              <div className="flex justify-between font-medium">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <p className="text-xs text-muted">Delivery and taxes are calculated at checkout.</p>
              <Link to="/checkout" onClick={close} className="block rounded-full bg-brand py-3 text-center font-medium text-white transition hover:bg-brand-dark">
                Checkout
              </Link>
              <Link to="/cart" onClick={close} className="block text-center text-sm font-medium underline-offset-4 hover:underline">
                View full bag
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
