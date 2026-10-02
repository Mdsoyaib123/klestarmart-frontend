import ProductCard from '@/components/product/ProductCard'
import type { Product } from '@/types/catalog'

const gridClass = 'grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-3 lg:grid-cols-4'

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className={gridClass}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className={gridClass} aria-busy="true" aria-label="Loading products">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="animate-pulse">
          <div className="aspect-[4/5] rounded-2xl bg-sand/70" />
          <div className="mt-3 space-y-2">
            <div className="h-3 w-1/3 rounded bg-sand/70" />
            <div className="h-4 w-3/4 rounded bg-sand/70" />
            <div className="h-4 w-1/4 rounded bg-sand/70" />
          </div>
        </div>
      ))}
    </div>
  )
}
