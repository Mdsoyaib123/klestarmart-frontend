import { CheckCircle2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { DELIVERY_RATES, FREE_SHIPPING_THRESHOLD, type DeliveryRegion } from '@/config/site'
import { clearCart, selectCartItems, selectCartSubtotal, shippingFor } from '@/features/cart/cartSlice'
import { formatPrice } from '@/lib/format'
import Container from '@/components/ui/Container'
import ProductImage from '@/components/product/ProductImage'
import OrderSummary from '@/components/cart/OrderSummary'

const inputClass = 'h-11 w-full rounded-xl border border-line bg-white px-4 text-sm outline-none transition focus:border-brand'

function Field({
  label,
  name,
  type = 'text',
  autoComplete,
  className = '',
  placeholder,
  pattern,
  title,
  required = true,
}: {
  label: string
  name: string
  type?: string
  autoComplete?: string
  className?: string
  placeholder?: string
  pattern?: string
  title?: string
  required?: boolean
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-medium">
        {label} {!required && <span className="font-normal text-muted">(optional)</span>}
      </span>
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        pattern={pattern}
        title={title}
        required={required}
        className={inputClass}
      />
    </label>
  )
}

export default function Checkout() {
  const dispatch = useAppDispatch()
  const items = useAppSelector(selectCartItems)
  const subtotal = useAppSelector(selectCartSubtotal)
  const [region, setRegion] = useState<DeliveryRegion>('dhaka')
  const shipping = shippingFor(subtotal, region)
  const [orderNumber, setOrderNumber] = useState<string | null>(null)

  const placeOrder = (event: FormEvent) => {
    event.preventDefault()
    // No order API yet: the order is only confirmed locally.
    setOrderNumber(`KM-${Date.now().toString().slice(-7)}`)
    dispatch(clearCart())
    window.scrollTo(0, 0)
  }

  if (orderNumber) {
    return (
      <Container className="flex flex-col items-center py-24 text-center">
        <CheckCircle2 className="h-14 w-14 text-brand" strokeWidth={1.3} />
        <h1 className="mt-5 font-display text-3xl font-semibold sm:text-4xl">Thank you for your order</h1>
        <p className="mt-3 max-w-md text-muted">
          Your order <strong className="text-ink">{orderNumber}</strong> has been placed. You will pay when it arrives at your door.
        </p>
        <Link to="/shop" className="mt-8 rounded-full bg-brand px-8 py-3 font-medium text-white hover:bg-brand-dark">
          Continue shopping
        </Link>
      </Container>
    )
  }

  if (items.length === 0) {
    return (
      <Container className="flex flex-col items-center py-24 text-center">
        <h1 className="font-display text-3xl font-semibold">Nothing to check out</h1>
        <p className="mt-2 text-muted">Add a few items to your bag first.</p>
        <Link to="/shop" className="mt-6 rounded-full bg-brand px-8 py-3 font-medium text-white hover:bg-brand-dark">
          Browse products
        </Link>
      </Container>
    )
  }

  return (
    <Container className="py-8 sm:py-12">
      <h1 className="mb-8 font-display text-3xl font-semibold sm:text-4xl">Checkout</h1>

      <form onSubmit={placeOrder} className="grid gap-10 lg:grid-cols-[1fr_400px]">
        <div className="space-y-10">
          <section>
            <h2 className="mb-4 font-display text-xl font-semibold">Contact</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Mobile number" name="phone" type="tel" autoComplete="tel" placeholder="01XXXXXXXXX" pattern="01[3-9][0-9]{8}" title="Enter an 11-digit Bangladesh mobile number, for example 01712345678" />
              <Field label="Email" name="email" type="email" autoComplete="email" required={false} />
            </div>
          </section>

          <section>
            <h2 className="mb-4 font-display text-xl font-semibold">Delivery address</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" name="fullName" autoComplete="name" className="sm:col-span-2" />
              <Field label="House, road and area" name="address" autoComplete="street-address" className="sm:col-span-2" placeholder="House 12, Road 5, Dhanmondi" />
              <Field label="District" name="district" autoComplete="address-level2" placeholder="Dhaka" />
              <Field label="Order note" name="note" required={false} placeholder="Landmark or delivery instructions" />
            </div>

            <fieldset className="mt-5">
              <legend className="mb-2 text-sm font-medium">Delivery area</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {(Object.keys(DELIVERY_RATES) as DeliveryRegion[]).map((key) => (
                  <label
                    key={key}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm transition ${region === key ? 'border-brand bg-brand-soft/60' : 'border-line bg-white hover:border-brand/50'}`}
                  >
                    <input type="radio" name="region" checked={region === key} onChange={() => setRegion(key)} className="accent-brand" />
                    <span className="flex-1">
                      <span className="block font-medium">{DELIVERY_RATES[key].label}</span>
                      <span className="text-muted">{DELIVERY_RATES[key].eta}</span>
                    </span>
                    <span className="font-semibold">{subtotal >= FREE_SHIPPING_THRESHOLD ? 'Free' : formatPrice(DELIVERY_RATES[key].fee)}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </section>

          <section>
            <h2 className="mb-4 font-display text-xl font-semibold">Payment</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 rounded-xl border border-brand bg-brand-soft/50 p-4 text-sm">
                <input type="radio" name="payment" defaultChecked className="accent-brand" />
                <span>
                  <span className="block font-medium">Cash on delivery</span>
                  <span className="text-muted">Pay when your order arrives.</span>
                </span>
              </label>
              <label className="flex items-center gap-3 rounded-xl border border-line p-4 text-sm opacity-60">
                <input type="radio" name="payment" disabled />
                <span>
                  <span className="block font-medium">Card or mobile wallet</span>
                  <span className="text-muted">Coming soon.</span>
                </span>
              </label>
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-3xl bg-cream p-6 lg:sticky lg:top-36">
          <h2 className="mb-5 font-display text-xl font-semibold">Your order</h2>
          <ul className="mb-5 space-y-4">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-3">
                <div className="relative w-14 shrink-0">
                  <ProductImage name={item.name} category={item.category} imageUrl={item.imageUrl} className="aspect-[4/5] rounded-lg" />
                  <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[10px] font-semibold text-white">{item.quantity}</span>
                </div>
                <p className="min-w-0 flex-1 truncate text-sm">{item.name}</p>
                <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
              </li>
            ))}
          </ul>
          <OrderSummary subtotal={subtotal} shipping={shipping} />
          <button type="submit" className="mt-6 w-full rounded-full bg-brand py-3 font-medium text-white transition hover:bg-brand-dark">
            Place order
          </button>
        </aside>
      </form>
    </Container>
  )
}
