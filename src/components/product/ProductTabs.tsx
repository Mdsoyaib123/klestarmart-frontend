import { Check } from 'lucide-react'
import { useState } from 'react'
import { DELIVERY_RATES, FREE_SHIPPING_THRESHOLD } from '@/config/site'
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

  const rows: [string, string][] = [
    ['Brand', product.brand],
    ['SKU', product.sku],
    ['Category', category?.name ?? product.category],
    ...product.specs,
  ]

  return (
    <section aria-label="Product information" className="mt-16 rounded-3xl border border-line bg-white">
      <div role="tablist" className="flex gap-1 overflow-x-auto overflow-y-hidden border-b border-line px-3 [scrollbar-width:none] sm:px-6">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`tab-${item.id}`}
            aria-selected={tab === item.id}
            aria-controls={`panel-${item.id}`}
            onClick={() => setTab(item.id)}
            className={`-mb-px shrink-0 border-b-2 px-4 py-4 text-sm font-semibold transition ${tab === item.id ? 'border-brand text-brand' : 'border-transparent text-muted hover:text-ink'}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className="p-6 sm:p-8">
        {tab === 'description' && (
          <div className="grid gap-8 md:grid-cols-[1.4fr_1fr]">
            <div>
              <h2 className="font-display text-xl font-semibold">About this product</h2>
              <p className="mt-3 leading-relaxed text-muted">{product.description}</p>
              <p className="mt-3 leading-relaxed text-muted">
                Sold and shipped by KlestarMart. Every order is checked before dispatch and packed carefully so it reaches you in perfect condition.
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
                {Object.values(DELIVERY_RATES).map((rate) => (
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
                Delivery is free on orders over {formatPrice(FREE_SHIPPING_THRESHOLD)}. Pay in cash when your order arrives.
              </p>
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold">Returns</h2>
              <ul className="mt-4 space-y-2.5 text-sm text-muted">
                {[
                  'Return unused items in their original packaging within 30 days.',
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
