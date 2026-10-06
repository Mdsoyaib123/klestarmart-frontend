import { Heart, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { addItem } from '@/features/cart/cartSlice'
import { selectWishlistIds, toggleWishlist } from '@/features/wishlist/wishlistSlice'
import { openCart } from '@/features/ui/uiSlice'
import { discountPercent } from '@/lib/format'
import Price from '@/components/ui/Price'
import Rating from '@/components/ui/Rating'
import ProductImage from '@/components/product/ProductImage'
import type { Product } from '@/types/catalog'

export default function ProductCard({ product }: { product: Product }) {
  const dispatch = useAppDispatch()
  const wished = useAppSelector(selectWishlistIds).includes(product.id)
  const soldOut = product.stock === 0
  const badge = soldOut
    ? 'Sold out'
    : product.compareAtPrice
      ? `-${discountPercent(product.price, product.compareAtPrice)}%`
      : product.badge

  return (
    <article className="group">
      <div className="relative">
        <Link to={`/product/${product.slug}`} className="block rounded-2xl">
          <ProductImage
            name={product.name}
            category={product.category}
            imageUrl={product.imageUrl}
            className={`aspect-[4/5] rounded-2xl transition duration-300 group-hover:brightness-95 ${soldOut ? 'opacity-60' : ''}`}
          />
        </Link>

        {badge && (
          <span
            className={`pointer-events-none absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-medium ${
              soldOut ? 'bg-ink text-white' : product.compareAtPrice ? 'bg-accent text-white' : 'bg-white text-ink'
            }`}
          >
            {badge}
          </span>
        )}

        <button
          type="button"
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={wished}
          onClick={() => dispatch(toggleWishlist(product.id))}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 shadow-sm transition hover:bg-white"
        >
          <Heart className={`h-[18px] w-[18px] ${wished ? 'fill-accent text-accent' : 'text-ink'}`} />
        </button>

        {!soldOut && (
          <button
            type="button"
            onClick={() => {
              dispatch(addItem({ product }))
              dispatch(openCart())
            }}
            className="absolute inset-x-3 bottom-3 flex items-center justify-center gap-2 rounded-full bg-brand py-2.5 text-sm font-medium text-white shadow-md transition hover:bg-brand-dark md:translate-y-2 md:opacity-0 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100 md:group-hover:translate-y-0 md:group-hover:opacity-100"
          >
            <ShoppingBag className="h-4 w-4" />
            Add to bag
          </button>
        )}
      </div>

      <div className="mt-3 space-y-1">
        <p className="text-xs uppercase tracking-wide text-muted">{product.brand}</p>
        <Link to={`/product/${product.slug}`} className="block text-[15px] font-medium leading-snug hover:underline">
          {product.name}
        </Link>
        {product.reviewCount > 0 && <Rating value={product.rating} count={product.reviewCount} />}
        <Price price={product.price} compareAt={product.compareAtPrice} />
      </div>
    </article>
  )
}
