import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useGetCategoriesQuery, useGetProductsQuery } from '@/features/catalog/catalogApi'
import { categoryIcon, categoryTone } from '@/lib/category'
import Container from '@/components/ui/Container'
import HeroCarousel from '@/components/home/HeroCarousel'
import { ProductGrid, ProductGridSkeleton } from '@/components/product/ProductGrid'
import type { Product } from '@/types/catalog'

function SectionHeading({ title, to, label = 'View all' }: { title: string; to: string; label?: string }) {
  return (
    <div className="mb-7 flex items-end justify-between gap-4">
      <h2 className="font-display text-2xl font-semibold sm:text-3xl">{title}</h2>
      <Link to={to} className="flex shrink-0 items-center gap-1 text-sm font-medium text-brand hover:underline">
        {label} <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  )
}

export default function Home() {
  const { data: categories = [] } = useGetCategoriesQuery()
  const { data: products = [], isLoading } = useGetProductsQuery()

  const bestsellers: Product[] = products
    .filter((product) => product.stock > 0)
    .sort((a, b) => b.rating * Math.log(b.reviewCount + 1) - a.rating * Math.log(a.reviewCount + 1))
    .slice(0, 8)
  const deals = products.filter((product) => product.compareAtPrice && product.stock > 0).slice(0, 4)

  return (
    <>
      <HeroCarousel />

      <Container className="pt-16">
        <SectionHeading title="Shop by category" to="/shop" label="All products" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((category) => {
            const Icon = categoryIcon(category.slug)
            const count = products.filter((product) => product.category === category.slug).length
            return (
              <Link
                key={category.slug}
                to={`/category/${category.slug}`}
                className="group rounded-2xl border border-line bg-white p-5 transition hover:border-brand hover:shadow-sm"
              >
                <span className={`mb-4 grid h-12 w-12 place-items-center rounded-full ${categoryTone(category.slug)}`}>
                  <Icon className="h-6 w-6" strokeWidth={1.4} />
                </span>
                <p className="font-medium">{category.name}</p>
                <p className="text-sm text-muted">{count ? `${count} products` : 'Explore'}</p>
              </Link>
            )
          })}
        </div>
      </Container>

      <Container className="pt-20">
        <SectionHeading title="Customer favourites" to="/shop" />
        {isLoading ? <ProductGridSkeleton /> : <ProductGrid products={bestsellers} />}
      </Container>

      {deals.length > 0 && (
        <section className="mt-20 bg-brand text-white">
          <Container className="py-14">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-widest text-white/70">Limited time</p>
                <h2 className="mt-1 font-display text-2xl font-semibold sm:text-3xl">Now on sale</h2>
              </div>
              <Link to="/shop?deals=1" className="flex items-center gap-1 text-sm font-medium hover:underline">
                Shop all deals <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="rounded-3xl bg-paper p-5 text-ink sm:p-8">
              <ProductGrid products={deals} />
            </div>
          </Container>
        </section>
      )}

      {categories.slice(0, 3).map((category) => {
        const items = products.filter((product) => product.category === category.slug).slice(0, 4)
        if (items.length === 0) return null
        return (
          <Container key={category.slug} className="pt-20">
            <SectionHeading title={category.name} to={`/category/${category.slug}`} />
            <ProductGrid products={items} />
          </Container>
        )
      })}
    </>
  )
}
