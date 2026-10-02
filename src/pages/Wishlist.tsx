import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'
import { useGetProductsQuery } from '@/features/catalog/catalogApi'
import { selectWishlistIds } from '@/features/wishlist/wishlistSlice'
import Container from '@/components/ui/Container'
import { ProductGrid, ProductGridSkeleton } from '@/components/product/ProductGrid'

export default function Wishlist() {
  const ids = useAppSelector(selectWishlistIds)
  const { data: products = [], isLoading } = useGetProductsQuery()
  const saved = products.filter((product) => ids.includes(product.id))

  return (
    <Container className="py-8 sm:py-12">
      <h1 className="mb-8 font-display text-3xl font-semibold sm:text-4xl">Wishlist</h1>

      {isLoading ? (
        <ProductGridSkeleton count={4} />
      ) : saved.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center">
          <Heart className="h-12 w-12 text-muted" strokeWidth={1.2} />
          <p className="mt-4 font-medium">Nothing saved yet</p>
          <p className="mt-1 text-sm text-muted">Tap the heart on any product to keep it here.</p>
          <Link to="/shop" className="mt-6 rounded-full bg-brand px-8 py-3 font-medium text-white hover:bg-brand-dark">
            Discover products
          </Link>
        </div>
      ) : (
        <ProductGrid products={saved} />
      )}
    </Container>
  )
}
