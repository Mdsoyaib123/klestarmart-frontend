import { Banknote, Check, ChevronRight, Heart, RotateCcw, Share2, ShieldCheck, ShoppingBag, Truck, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { useGetCategoriesQuery, useGetProductByIdQuery, useGetProductsQuery } from '@/features/catalog/catalogApi'
import { addItem } from '@/features/cart/cartSlice'
import { selectRecentIds, viewProduct } from '@/features/recent/recentSlice'
import { openCart } from '@/features/ui/uiSlice'
import { selectWishlistIds, toggleWishlist } from '@/features/wishlist/wishlistSlice'
import { deliveryRates, useSiteSettings } from '@/features/settings/settingsApi'
import { discountPercent, formatPrice, formatShortDate } from '@/lib/format'
import Container from '@/components/ui/Container'
import Price from '@/components/ui/Price'
import QuantityStepper from '@/components/ui/QuantityStepper'
import Stars from '@/components/ui/Stars'
import ProductGallery from '@/components/product/ProductGallery'
import ProductTabs from '@/components/product/ProductTabs'
import ReviewsSection from '@/components/product/ReviewsSection'
import { ProductGrid } from '@/components/product/ProductGrid'
import NotFound from '@/pages/NotFound'
import LoadError from '@/components/ui/LoadError'
import type { Product } from '@/types/catalog'

// Uses the current date on each render so the estimate stays right if the tab is left open overnight.
const arrival = ([from, to]: readonly [number, number]) => {
  const day = (offset: number) => {
    const date = new Date()
    date.setDate(date.getDate() + offset)
    return formatShortDate(date)
  }
  return `${day(from)} - ${day(to)}`
}

function ProductView({ product }: { product: Product }) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { data: categories = [] } = useGetCategoriesQuery()
  const { data: all = [] } = useGetProductsQuery()
  const wished = useAppSelector(selectWishlistIds).includes(product.id)
  const recentIds = useAppSelector(selectRecentIds)
  const settings = useSiteSettings()
  const trust = [
    { icon: ShieldCheck, label: '100% authentic' },
    ...(settings.returnDays > 0 ? [{ icon: RotateCcw, label: `${settings.returnDays}-day returns` }] : []),
    { icon: Banknote, label: 'Cash on delivery' },
  ]
  const [quantity, setQuantity] = useState(1)
  const [copied, setCopied] = useState(false)

  const category = categories.find((item) => item.slug === product.category)
  const related = all.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4)
  const recent = recentIds
    .filter((id) => id !== product.id)
    .map((id) => all.find((item) => item.id === id))
    .filter((item): item is Product => Boolean(item))
    .slice(0, 4)

  const soldOut = product.stock === 0
  const lowStock = !soldOut && product.stock <= 5
  const badge = product.compareAtPrice ? `${discountPercent(product.price, product.compareAtPrice)}% off` : (product.badge ?? undefined)

  useEffect(() => {
    dispatch(viewProduct(product.id))
    const previous = document.title
    document.title = `${product.name} | ${settings.siteName}`
    return () => {
      document.title = previous
    }
  }, [dispatch, product.id, product.name, settings.siteName])

  const addToBag = () => {
    dispatch(addItem({ product, quantity }))
    dispatch(openCart())
  }

  const buyNow = () => {
    dispatch(addItem({ product, quantity, replace: true }))
    navigate('/checkout')
  }

  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, url })
      } else {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 2000)
      }
    } catch {
      // The visitor dismissed the share sheet.
    }
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    sku: product.sku,
    description: product.description,
    brand: { '@type': 'Brand', name: product.brand },
    // Search engines reject a rating with no reviews behind it.
    ...(product.reviewCount > 0 ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: product.rating, reviewCount: product.reviewCount } } : {}),
    offers: {
      '@type': 'Offer',
      priceCurrency: 'BDT',
      price: product.price,
      availability: soldOut ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
    },
  }

  return (
    <Container className="py-8 pb-28 sm:py-10 md:pb-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />

      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1 text-sm text-muted">
        <Link to="/" className="hover:text-ink">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link to={`/category/${product.category}`} className="hover:text-ink">{category?.name ?? 'Shop'}</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2 lg:gap-14">
        <ProductGallery name={product.name} category={product.category} images={product.images ?? (product.imageUrl ? [product.imageUrl] : undefined)} badge={badge} />

        <div>
          <Link
            to={`/category/${product.category}?brand=${encodeURIComponent(product.brand)}`}
            className="text-sm font-semibold uppercase tracking-wide text-brand hover:underline"
          >
            {product.brand}
          </Link>
          <h1 className="mt-1 font-display text-3xl font-semibold leading-tight sm:text-4xl">{product.name}</h1>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <a href="#reviews" className="flex items-center gap-2 hover:underline">
              <Stars value={product.rating} />
              <span className="font-medium">{product.rating.toFixed(1)}</span>
              <span className="text-muted">({product.reviewCount.toLocaleString()} reviews)</span>
            </a>
            <span className="text-muted">SKU: {product.sku}</span>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Price price={product.price} compareAt={product.compareAtPrice} large />
            {product.compareAtPrice ? (
              <span className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent">
                You save {formatPrice(product.compareAtPrice - product.price)}
              </span>
            ) : null}
          </div>

          <p className="mt-5 leading-relaxed text-muted">{product.description}</p>

          <p className={`mt-6 flex items-center gap-2 text-sm font-medium ${soldOut || lowStock ? 'text-accent' : 'text-success'}`}>
            {!soldOut && <Check className="h-4 w-4" />}
            {soldOut ? 'Currently sold out' : lowStock ? `Only ${product.stock} left in stock, order soon` : 'In stock and ready to ship'}
          </p>

          <div className="mt-6 flex items-end justify-between gap-4">
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted">Quantity</p>
              <QuantityStepper value={quantity} max={Math.max(product.stock, 1)} onChange={setQuantity} />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
                aria-pressed={wished}
                title={wished ? 'Remove from wishlist' : 'Add to wishlist'}
                onClick={() => dispatch(toggleWishlist(product.id))}
                className="grid h-11 w-11 place-items-center rounded-full border border-line bg-white text-ink transition hover:border-brand hover:text-brand"
              >
                <Heart className={`h-5 w-5 ${wished ? 'fill-accent text-accent' : ''}`} />
              </button>
              <button
                type="button"
                aria-label="Share this product"
                title="Share this product"
                onClick={share}
                className="grid h-11 w-11 place-items-center rounded-full border border-line bg-white text-ink transition hover:border-brand hover:text-brand"
              >
                {copied ? <Check className="h-5 w-5 text-success" /> : <Share2 className="h-5 w-5" />}
              </button>
            </div>
          </div>
          {copied && <p role="status" className="mt-2 text-xs text-success">Link copied to clipboard</p>}

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={soldOut}
              onClick={addToBag}
              className="flex h-12 min-w-0 items-center justify-center gap-2 rounded-full bg-brand px-3 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-sand disabled:text-muted sm:px-5 sm:text-base"
            >
              <ShoppingBag className="h-4 w-4 shrink-0" />
              <span className="truncate">{soldOut ? 'Sold out' : 'Add to bag'}</span>
            </button>
            <button
              type="button"
              disabled={soldOut}
              onClick={buyNow}
              className="flex h-12 min-w-0 items-center justify-center gap-2 rounded-full border border-brand bg-white px-3 text-sm font-semibold text-brand transition hover:bg-brand-soft disabled:cursor-not-allowed disabled:border-sand disabled:text-muted sm:px-5 sm:text-base"
            >
              <Zap className="h-4 w-4 shrink-0" />
              <span className="truncate">Buy it now</span>
            </button>
          </div>

          <div className="mt-6 rounded-2xl border border-line bg-white p-5">
            <p className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Truck className="h-5 w-5 text-brand" /> Delivery
            </p>
            <ul className="space-y-3 text-sm">
              {deliveryRates(settings).map((rate) => (
                <li key={rate.label} className="flex justify-between gap-4">
                  <span>
                    <span className="font-medium">{rate.label}</span>
                    <span className="block text-muted">Get it {arrival(rate.days)}</span>
                  </span>
                  <span className="font-medium">{formatPrice(rate.fee)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 border-t border-line pt-3 text-xs text-muted">
              Free delivery on orders over {formatPrice(settings.shipping.freeShippingThreshold)}. Pay with cash on delivery.
            </p>
          </div>

          <ul className={`mt-5 grid gap-3 text-center text-xs font-medium ${trust.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
            {trust.map(({ icon: Icon, label }) => (
              <li key={label} className="flex flex-col items-center gap-2 rounded-2xl bg-cream px-2 py-3">
                <Icon className="h-5 w-5 text-brand" strokeWidth={1.7} />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <ProductTabs product={product} category={category} />
      <ReviewsSection product={product} />

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-7 font-display text-2xl font-semibold sm:text-3xl">You may also like</h2>
          <ProductGrid products={related} />
        </section>
      )}

      {recent.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-7 font-display text-2xl font-semibold sm:text-3xl">Recently viewed</h2>
          <ProductGrid products={recent} />
        </section>
      )}

      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-4 border-t border-line bg-white/95 p-3 backdrop-blur md:hidden">
        <div className="min-w-0 flex-1">
          <Price price={product.price} compareAt={product.compareAtPrice} />
        </div>
        <button
          type="button"
          disabled={soldOut}
          onClick={addToBag}
          className="h-11 rounded-full bg-brand px-8 font-semibold text-white disabled:cursor-not-allowed disabled:bg-sand disabled:text-muted"
        >
          {soldOut ? 'Sold out' : 'Add to bag'}
        </button>
      </div>
    </Container>
  )
}

export default function ProductDetail() {
  const { id = '' } = useParams()
  // `currentData` belongs to this id only; `data` would keep showing the previous product while the next one loads.
  const { currentData: product, isFetching, error, refetch } = useGetProductByIdQuery(id)

  if (isFetching && !product) {
    return (
      <Container className="grid animate-pulse gap-10 py-12 md:grid-cols-2">
        <div className="aspect-square rounded-3xl bg-sand/70" />
        <div className="space-y-4">
          <div className="h-4 w-1/4 rounded bg-sand/70" />
          <div className="h-9 w-3/4 rounded bg-sand/70" />
          <div className="h-6 w-1/3 rounded bg-sand/70" />
          <div className="h-24 rounded bg-sand/70" />
        </div>
      </Container>
    )
  }

  // Only a 404 means the product does not exist; anything else is a connection problem.
  if (!product && error && 'status' in error && error.status !== 404) {
    return (
      <Container className="py-12">
        <LoadError onRetry={refetch} />
      </Container>
    )
  }
  if (!product) return <NotFound />

  return <ProductView key={product.id} product={product} />
}
