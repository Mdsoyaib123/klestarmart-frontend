import { Check } from 'lucide-react'
import { useRef, useState, type KeyboardEvent } from 'react'
import { deliveryRates, useSiteSettings } from '@/features/settings/settingsApi'
import { formatPrice } from '@/lib/format'
import type { Category, Product } from '@/types/catalog'

const tabs = [
  { id: 'description', label: 'Description' },
  { id: 'specs', label: 'Specifications' },
  { id: 'delivery', label: 'Delivery & returns' },
] as const

type TabId = (typeof tabs)[number]['id']

export default function ProductTabs({ product, category }: { product: Product; category?: Category }) {
  const [tab, setTab] = useState<TabId>('description')
  const settings = useSiteSettings()
  const buttons = useRef<(HTMLButtonElement | null)[]>([])

  // Arrow keys, Home and End move between tabs, as in the WAI-ARIA tabs pattern.
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = tabs.findIndex((item) => item.id === tab)
    const target =
      event.key === 'ArrowRight' ? (index + 1) % tabs.length
        : event.key === 'ArrowLeft' ? (index - 1 + tabs.length) % tabs.length
          : event.key === 'Home' ? 0
            : event.key === 'End' ? tabs.length - 1
              : null
    if (target === null) return
    event.preventDefault()
    setTab(tabs[target].id)
    buttons.current[target]?.focus()
  }

  const rows: [string, string][] = [
    ['Brand', product.brand],
    ['SKU', product.sku],
    ['Category', category?.name ?? product.category],
    ...product.specs,
  ]

  return (
    <section aria-label="Product information" className="mt-16 rounded-3xl border border-line bg-white">
      <div role="tablist" aria-label="Product information" onKeyDown={onKeyDown} className="flex gap-1 overflow-x-auto overflow-y-hidden border-b border-line px-3 [scrollbar-width:none] sm:px-6">
        {tabs.map((item, index) => (
          <button
            key={item.id}
            ref={(node) => {
              buttons.current[index] = node
            }}
            type="button"
            role="tab"
            id={`tab-${item.id}`}
            aria-selected={tab === item.id}
            aria-controls="product-tabpanel"
            tabIndex={tab === item.id ? 0 : -1}
            onClick={() => setTab(item.id)}
            className={`-mb-px shrink-0 border-b-2 px-4 py-4 text-sm font-semibold transition ${tab === item.id ? 'border-brand text-brand' : 'border-transparent text-muted hover:text-ink'}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div role="tabpanel" id="product-tabpanel" aria-labelledby={`tab-${tab}`} tabIndex={0} className="p-6 sm:p-8">
        {tab === 'description' && (
          <div className="grid gap-8 md:grid-cols-[1.4fr_1fr]">
            <div>
              <h2 className="font-display text-xl font-semibold">About this product</h2>
              <p className="mt-3 leading-relaxed text-muted">{product.description}</p>
              <p className="mt-3 leading-relaxed text-muted">
                Sold and shipped by {settings.siteName}. Every order is checked before dispatch and packed carefully so it reaches you in perfect condition.
              </p>
            </div>
            {category && (
              <div className="rounded-2xl bg-cream p-5">
                <p className="mb-3 text-sm font-semibold">Why you will like it</p>
                <ul className="space-y-2.5 text-sm text-muted">
                  {category.highlights.map((item) => (
                    <li key={item} className="flex gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {tab === 'specs' && (
          <dl className="overflow-hidden rounded-2xl border border-line text-sm">
            {rows.map(([label, value], index) => (
              <div key={label} className={`grid grid-cols-[1fr_2fr] gap-4 px-5 py-3.5 ${index % 2 === 0 ? 'bg-cream/60' : 'bg-white'}`}>
                <dt className="font-medium">{label}</dt>
                <dd className="text-muted">{value}</dd>
              </div>
            ))}
          </dl>
        )}

        {tab === 'delivery' && (
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="font-display text-xl font-semibold">Delivery</h2>
              <ul className="mt-4 space-y-3 text-sm">
                {deliveryRates(settings).map((rate) => (
                  <li key={rate.label} className="flex justify-between gap-4 rounded-xl bg-cream px-4 py-3">
                    <span>
                      <span className="font-medium">{rate.label}</span>
                      <span className="block text-muted">Arrives in {rate.eta}</span>
                    </span>
                    <span className="font-semibold">{formatPrice(rate.fee)}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm text-muted">
                Delivery is free on orders over {formatPrice(settings.shipping.freeShippingThreshold)}. Pay in cash when your order arrives.
              </p>
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold">Returns</h2>
              <ul className="mt-4 space-y-2.5 text-sm text-muted">
                {[
                  `Return unused items in their original packaging within ${settings.returnDays} days.`,
                  'Faulty or wrong items are replaced or refunded at no cost to you.',
                  'Refunds are issued once the returned item has been checked.',
                ].map((line) => (
                  <li key={line} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" /> {line}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
