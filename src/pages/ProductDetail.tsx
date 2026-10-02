import { Check, ChevronRight, Heart, RotateCcw, ShoppingBag, Truck } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { useGetCategoriesQuery, useGetProductByIdQuery, useGetProductsQuery } from '@/features/catalog/catalogApi'
import { addItem } from '@/features/cart/cartSlice'
import { openCart } from '@/features/ui/uiSlice'
import { selectWishlistIds, toggleWishlist } from '@/features/wishlist/wishlistSlice'
import { discountPercent, formatPrice } from '@/lib/format'
import { FREE_SHIPPING_THRESHOLD } from '@/config/site'
import Container from '@/components/ui/Container'
import Price from '@/components/ui/Price'
import QuantityStepper from '@/components/ui/QuantityStepper'
import Rating from '@/components/ui/Rating'
import ProductImage from '@/components/product/ProductImage'
import { ProductGrid } from '@/components/product/ProductGrid'
import NotFound from '@/pages/NotFound'
import type { Product } from '@/types/catalog'

function ProductView({ product }: { product: Product }) {
  const dispatch = useAppDispatch()
  const { data: categories = [] } = useGetCategoriesQuery()
  const { data: all = [] } = useGetProductsQuery()
  const wished = useAppSelector(selectWishlistIds).includes(product.id)
  const [quantity, setQuantity] = useState(1)

  const category = categories.find((item) => item.slug === product.category)
  const related = all.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4)
  const soldOut = product.stock === 0

  const addToBag = () => {
    dispatch(addItem({ product, quantity }))
    dispatch(openCart())
  }

  return (
    <Container className="py-8 pb-28 sm:py-10 md:pb-10">
      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1 text-sm text-muted">
        <Link to="/" className="hover:text-ink">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link to={`/category/${product.category}`} className="hover:text-ink">{category?.name ?? 'Shop'}</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2 lg:gap-14">
        <ProductImage name={product.name} category={product.category} imageUrl={product.imageUrl} className="aspect-square rounded-3xl md:sticky md:top-36 md:self-start" />

        <div>
          <p className="text-sm uppercase tracking-wide text-muted">{product.brand}</p>
          <h1 className="mt-1 font-display text-3xl font-semibold leading-tight sm:text-4xl">{product.name}</h1>
          <div className="mt-3">
            <Rating value={product.rating} count={product.reviewCount} />
          </div>

          <div className="mt-5 flex items-center gap-3">
            <Price price={product.price} compareAt={product.compareAtPrice} large />
            {product.compareAtPrice && (
              <span className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent">
                Save {discountPercent(product.price, product.compareAtPrice)}%
              </span>
            )}
          </div>

          <p className="mt-5 leading-relaxed text-muted">{product.description}</p>

          <p className={`mt-6 flex items-center gap-2 text-sm font-medium ${soldOut || product.stock <= 5 ? 'text-accent' : 'text-success'}`}>
            {!soldOut && <Check className="h-4 w-4" />}
            {soldOut ? 'Currently sold out' : product.stock <= 5 ? `Only ${product.stock} left in stock` : 'In stock and ready to ship'}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <QuantityStepper value={quantity} max={Math.max(product.stock, 1)} onChange={setQuantity} />
            <button
              type="button"
              disabled={soldOut}
              onClick={addToBag}
              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-brand px-8 font-medium text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-sand disabled:text-muted sm:flex-none"
            >
              <ShoppingBag className="h-4 w-4" />
              {soldOut ? 'Sold out' : 'Add to bag'}
            </button>
            <button
              type="button"
              aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
              aria-pressed={wished}
              onClick={() => dispatch(toggleWishlist(product.id))}
              className="grid h-11 w-11 place-items-center rounded-full border border-line bg-white transition hover:border-ink"
            >
              <Heart className={`h-5 w-5 ${wished ? 'fill-accent text-accent' : ''}`} />
            </button>
          </div>

          <ul className="mt-8 space-y-3 border-t border-line pt-6 text-sm">
            <li className="flex items-center gap-3"><Truck className="h-5 w-5 text-brand" /> Free delivery on orders over {formatPrice(FREE_SHIPPING_THRESHOLD)}</li>
            <li className="flex items-center gap-3"><RotateCcw className="h-5 w-5 text-brand" /> 30-day easy returns</li>
          </ul>

          {category && (
            <div className="mt-6 rounded-2xl bg-cream p-5">
              <p className="mb-3 text-sm font-semibold">Details</p>
              <ul className="space-y-2 text-sm text-muted">
                {category.highlights.map((item) => (
                  <li key={item} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" /> {item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-7 font-display text-2xl font-semibold sm:text-3xl">You may also like</h2>
          <ProductGrid products={related} />
        </section>
      )}

      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-4 border-t border-line bg-paper/95 p-3 backdrop-blur md:hidden">
        <div className="min-w-0 flex-1">
          <Price price={product.price} compareAt={product.compareAtPrice} />
        </div>
        <button
          type="button"
          disabled={soldOut}
          onClick={addToBag}
          className="h-11 rounded-full bg-brand px-8 font-medium text-white disabled:cursor-not-allowed disabled:bg-sand disabled:text-muted"
        >
          {soldOut ? 'Sold out' : 'Add to bag'}
        </button>
      </div>
    </Container>
  )
}

export default function ProductDetail() {
  const { id = '' } = useParams()
  const { data: product, isLoading } = useGetProductByIdQuery(id)

  if (isLoading) {
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

  if (!product) return <NotFound />

  return <ProductView key={product.id} product={product} />
}
