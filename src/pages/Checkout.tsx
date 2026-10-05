import { Banknote, ChevronLeft, CreditCard, Lock, MapPin, RotateCcw, Truck } from 'lucide-react'
import { useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'
import { DELIVERY_RATES, FREE_SHIPPING_THRESHOLD } from '@/config/site'
import { regionForDistrict, selectCartCount, selectCartItems, selectCartSubtotal, shippingFor } from '@/features/cart/cartSlice'
import { districts, type District } from '@/data/bdLocations'
import { formatPrice } from '@/lib/format'
import Container from '@/components/ui/Container'
import SelectField from '@/components/ui/SelectField'
import ProductImage from '@/components/product/ProductImage'
import OrderSummary from '@/components/cart/OrderSummary'

const inputClass = 'h-11 w-full rounded-xl border border-line bg-white px-4 text-sm outline-none transition placeholder:text-muted/70 focus:border-brand'

// Districts grouped by division, both sorted alphabetically, for the district dropdown.
const divisions = Object.entries(
  districts.reduce<Record<string, District[]>>((groups, district) => {
    groups[district.division] = [...(groups[district.division] ?? []), district]
    return groups
  }, {}),
)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([division, list]) => [division, [...list].sort((a, b) => a.name.localeCompare(b.name))] as const)

function Field({
  label,
  name,
  type = 'text',
  autoComplete,
  className = '',
  placeholder,
  pattern,
  title,
  inputMode,
  maxLength,
  hint,
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
  inputMode?: 'text' | 'tel' | 'email' | 'numeric'
  maxLength?: number
  hint?: string
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
        inputMode={inputMode}
        maxLength={maxLength}
        required={required}
        className={inputClass}
      />
      {hint && <span className="mt-1.5 block text-xs text-muted">{hint}</span>}
    </label>
  )
}

function Step({ number, title, description, children }: { number: number; title: string; description: string; children: ReactNode }) {
  return (
    <section aria-labelledby={`step-${number}`} className="rounded-3xl border border-line bg-white p-5 sm:p-7">
      <div className="mb-6 flex items-start gap-3.5">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand text-sm font-semibold text-white">{number}</span>
        <div>
          <h2 id={`step-${number}`} className="font-display text-xl font-semibold leading-8">
            {title}
          </h2>
          <p className="text-sm text-muted">{description}</p>
        </div>
      </div>
      {children}
    </section>
  )
}

export default function Checkout() {
  const items = useAppSelector(selectCartItems)
  const count = useAppSelector(selectCartCount)
  const subtotal = useAppSelector(selectCartSubtotal)
  const [districtName, setDistrictName] = useState('')
  const [upazila, setUpazila] = useState('')
  const [submissionNotice, setSubmissionNotice] = useState(false)

  const district = districts.find((item) => item.name === districtName)
  const region = district ? regionForDistrict(district.name) : undefined
  const rate = region ? DELIVERY_RATES[region] : undefined
  const freeDelivery = subtotal >= FREE_SHIPPING_THRESHOLD
  const shipping = region || freeDelivery ? shippingFor(subtotal, region) : undefined
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal

  const chooseDistrict = (value: string) => {
    setDistrictName(value)
    // Upazila names repeat across districts, so the previous choice never carries over.
    setUpazila('')
  }

  const placeOrder = (event: FormEvent) => {
    event.preventDefault()
    setSubmissionNotice(true)
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
      <Link to="/cart" className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-ink">
        <ChevronLeft className="h-4 w-4" /> Back to bag
      </Link>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">Checkout</h1>
        <p className="flex items-center gap-1.5 text-sm text-muted">
          <Lock className="h-4 w-4" /> Guest checkout, no account needed
        </p>
      </div>
      <p role="note" className="mb-8 rounded-2xl border border-accent/20 bg-accent-soft px-5 py-4 text-sm text-ink">
        Preview only: checkout is not connected. Do not enter real personal details. No order or information will be sent or saved.
      </p>

      <form onSubmit={placeOrder} className="grid gap-8 lg:grid-cols-[1fr_400px] lg:gap-10">
        <div className="space-y-6">
          <Step number={1} title="Contact" description="We will call this number to confirm your order.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Mobile number"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="01XXXXXXXXX"
                pattern="01[3-9][0-9]{8}"
                maxLength={11}
                title="Enter an 11-digit Bangladesh mobile number, for example 01712345678"
                hint="11 digits, starting with 01"
              />
              <Field label="Email" name="email" type="email" autoComplete="email" placeholder="you@example.com" hint="For your order receipt" required={false} />
            </div>
          </Step>

          <Step number={2} title="Delivery address" description="Where should we bring your order?">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" name="fullName" autoComplete="name" placeholder="Recipient's name" className="sm:col-span-2" />

              <SelectField label="District" name="district" value={districtName} onChange={chooseDistrict} autoComplete="address-level2">
                <option value="" disabled>
                  Select your district
                </option>
                {divisions.map(([division, list]) => (
                  <optgroup key={division} label={`${division} Division`}>
                    {list.map((item) => (
                      <option key={item.name} value={item.name}>
                        {item.name} ({item.bn})
                      </option>
                    ))}
                  </optgroup>
                ))}
              </SelectField>

              <SelectField
                label="Upazila / Area"
                name="upazila"
                value={upazila}
                onChange={setUpazila}
                disabled={!district}
                autoComplete="address-level3"
                hint={district ? `${district.upazilas.length} areas in ${district.name}` : 'Choose a district first'}
              >
                <option value="" disabled>
                  {district ? 'Select your upazila' : 'Select a district first'}
                </option>
                {district?.upazilas.map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.name} ({item.bn})
                  </option>
                ))}
              </SelectField>

              <Field
                label="House, road and area"
                name="address"
                autoComplete="street-address"
                placeholder="House 12, Road 5, Dhanmondi"
                className="sm:col-span-2"
              />

              <div aria-live="polite" className="sm:col-span-2">
                {rate ? (
                  <div className="flex items-center gap-4 rounded-2xl border border-brand/30 bg-brand-soft/60 p-4 text-sm">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-brand">
                      <Truck className="h-5 w-5" />
                    </span>
                    <span className="flex-1">
                      <span className="block font-medium">{rate.label} delivery</span>
                      <span className="text-muted">
                        Arrives in {rate.eta}
                        {upazila && ` to ${upazila}, ${district?.name}`}
                      </span>
                    </span>
                    <span className="font-semibold">{freeDelivery ? 'Free' : formatPrice(rate.fee)}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 rounded-2xl border border-dashed border-line p-4 text-sm text-muted">
                    <MapPin className="h-5 w-5 shrink-0" />
                    <span>
                      Choose your district to see the delivery charge. {DELIVERY_RATES.dhaka.label} {formatPrice(DELIVERY_RATES.dhaka.fee)},{' '}
                      {DELIVERY_RATES.outside.label.toLowerCase()} {formatPrice(DELIVERY_RATES.outside.fee)}.
                    </span>
                  </div>
                )}
              </div>

              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-sm font-medium">
                  Delivery note <span className="font-normal text-muted">(optional)</span>
                </span>
                <textarea
                  name="note"
                  rows={2}
                  maxLength={300}
                  placeholder="Nearby landmark or a good time to deliver"
                  className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none transition placeholder:text-muted/70 focus:border-brand"
                />
              </label>
            </div>
          </Step>

          <Step number={3} title="Payment" description="Choose how you would like to pay.">
            <div className="space-y-3">
              <label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-brand bg-brand-soft/50 p-4 text-sm">
                <input type="radio" name="payment" value="cod" defaultChecked className="accent-brand" />
                <Banknote className="h-5 w-5 shrink-0 text-brand" />
                <span>
                  <span className="block font-medium">Cash on delivery</span>
                  <span className="text-muted">Pay in cash when your order arrives.</span>
                </span>
              </label>
              <label className="flex items-center gap-4 rounded-2xl border border-line p-4 text-sm opacity-60">
                <input type="radio" name="payment" value="online" disabled />
                <CreditCard className="h-5 w-5 shrink-0" />
                <span>
                  <span className="block font-medium">Card or mobile wallet</span>
                  <span className="text-muted">Coming soon.</span>
                </span>
              </label>
            </div>
          </Step>
        </div>

        <aside className="h-fit rounded-3xl bg-cream p-6 lg:sticky lg:top-36">
          <div className="mb-5 flex items-baseline justify-between gap-3">
            <h2 className="font-display text-xl font-semibold">Order summary</h2>
            <Link to="/cart" className="text-sm font-medium text-brand hover:underline">
              Edit bag ({count})
            </Link>
          </div>

          <ul className="-mr-2 mb-5 max-h-72 space-y-4 overflow-y-auto pr-2 pt-2">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-3">
                <div className="relative w-14 shrink-0">
                  <ProductImage name={item.name} category={item.category} imageUrl={item.imageUrl} className="aspect-[4/5] rounded-lg" />
                  <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[10px] font-semibold text-white">{item.quantity}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">{item.name}</p>
                  <p className="text-xs text-muted">{item.brand}</p>
                </div>
                <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
              </li>
            ))}
          </ul>

          {remaining > 0 ? (
            <p className="mb-5 rounded-xl bg-white px-4 py-3 text-xs text-muted">
              Add <strong className="text-ink">{formatPrice(remaining)}</strong> more to get free delivery.
            </p>
          ) : (
            <p className="mb-5 rounded-xl bg-white px-4 py-3 text-xs font-medium text-success">Your order qualifies for free delivery.</p>
          )}

          <OrderSummary subtotal={subtotal} shipping={shipping} shippingPending="Select your district" />

          <button type="submit" className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3.5 font-semibold text-white transition hover:bg-brand-dark">
            <Lock className="h-4 w-4" />
            Place order{shipping !== undefined && ` · ${formatPrice(subtotal + shipping)}`}
          </button>

          {submissionNotice && (
            <p role="status" className="mt-4 rounded-xl bg-brand-soft px-4 py-3 text-sm font-medium text-brand">
              No order was placed. The checkout service is not connected, and your bag is unchanged.
            </p>
          )}

          <ul className="mt-5 space-y-2 border-t border-line pt-5 text-xs text-muted">
            <li className="flex items-center gap-2">
              <Banknote className="h-4 w-4 text-brand" /> Pay in cash when it arrives
            </li>
            <li className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-brand" /> 30-day easy returns
            </li>
          </ul>
        </aside>
      </form>
    </Container>
  )
}
