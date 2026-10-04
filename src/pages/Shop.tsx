import { ChevronRight, SlidersHorizontal } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useGetCategoriesQuery, useGetProductsQuery } from '@/features/catalog/catalogApi'
import Container from '@/components/ui/Container'
import { ProductGrid, ProductGridSkeleton } from '@/components/product/ProductGrid'
import NotFound from '@/pages/NotFound'

const PAGE_SIZE = 12

const priceRanges = [
  { id: '0-1000', label: 'Under ৳1,000', min: 0, max: 1000 },
  { id: '1000-2500', label: '৳1,000 to ৳2,500', min: 1000, max: 2500 },
  { id: '2500-5000', label: '৳2,500 to ৳5,000', min: 2500, max: 5000 },
  { id: '5000-', label: '৳5,000 and above', min: 5000, max: Infinity },
]

const sorts = [
  { id: 'featured', label: 'Featured' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
  { id: 'rating', label: 'Top rated' },
]

export default function Shop() {
  const { slug } = useParams()
  const [params, setParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  const [pageState, setPageState] = useState({ key: '', count: PAGE_SIZE })
  const { data: categories = [], isSuccess: categoriesLoaded } = useGetCategoriesQuery()
  const { data: products = [], isLoading } = useGetProductsQuery()

  const q = params.get('q')?.trim() ?? ''
  const sort = params.get('sort') ?? 'featured'
  const price = params.get('price') ?? ''
  const inStock = params.get('stock') === '1'
  const deals = params.get('deals') === '1'
  const brandParam = params.get('brand') ?? ''
  const category = categories.find((item) => item.slug === slug)

  // The page size resets whenever the active filters change.
  const filterKey = [slug, q, sort, price, inStock, deals, brandParam].join('|')
  const visible = pageState.key === filterKey ? pageState.count : PAGE_SIZE

  const update = (key: string, value: string | null) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  const brandCounts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const product of products) {
      if (!slug || product.category === slug) counts.set(product.brand, (counts.get(product.brand) ?? 0) + 1)
    }
    return [...counts.entries()].sort(([a], [b]) => a.localeCompare(b))
  }, [products, slug])

  const toggleBrand = (brand: string) => {
    const current = brandParam.split(',').filter(Boolean)
    const next = current.includes(brand) ? current.filter((item) => item !== brand) : [...current, brand]
    update('brand', next.length ? next.join(',') : null)
  }

  const priceRange = priceRanges.find((item) => item.id === price)
  const searchTerm = q.toLowerCase()
  const results = products.filter(
    (product) =>
      (!slug || product.category === slug) &&
      (!searchTerm || `${product.name} ${product.brand}`.toLowerCase().includes(searchTerm)) &&
      (!brandParam || brandParam.split(',').includes(product.brand)) &&
      (!priceRange || (product.price >= priceRange.min && product.price < priceRange.max)) &&
      (!inStock || product.stock > 0) &&
      (!deals || product.compareAtPrice),
  )
  if (sort === 'price-asc') results.sort((a, b) => a.price - b.price)
  if (sort === 'price-desc') results.sort((a, b) => b.price - a.price)
  if (sort === 'rating') results.sort((a, b) => b.rating - a.rating)

  if (slug && categoriesLoaded && !category) return <NotFound />

  const title = category?.name ?? (deals ? 'Sale' : q ? `Results for "${q}"` : 'All products')
  const description = category?.description ?? (deals ? 'Reduced prices on selected favourites.' : 'Browse everything in the store.')
  const hasFilters = Boolean(price || inStock || brandParam || (deals && !category) || q)
  const activeBrands = brandParam.split(',').filter(Boolean)
  const optionClass = 'flex items-center gap-2.5 py-1.5 text-sm'

  const filters = (
    <div className="space-y-8">
      <div>
        <p className="mb-2 text-sm font-semibold">Category</p>
        <ul className="space-y-0.5 text-sm">
          <li>
            <Link to="/shop" className={`block py-1.5 ${!slug ? 'font-semibold text-brand' : 'text-muted hover:text-ink'}`}>
              All products
            </Link>
          </li>
          {categories.map((item) => (
            <li key={item.slug}>
              <Link to={`/category/${item.slug}`} className={`block py-1.5 ${slug === item.slug ? 'font-semibold text-brand' : 'text-muted hover:text-ink'}`}>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {brandCounts.length > 1 && (
        <fieldset>
          <legend className="mb-2 text-sm font-semibold">Brand</legend>
          {brandCounts.map(([brand, count]) => (
            <label key={brand} className={optionClass}>
              <input type="checkbox" checked={activeBrands.includes(brand)} onChange={() => toggleBrand(brand)} className="accent-brand" />
              <span className="flex-1">{brand}</span>
              <span className="text-xs text-muted">{count}</span>
            </label>
          ))}
        </fieldset>
      )}

      <fieldset>
        <legend className="mb-2 text-sm font-semibold">Price</legend>
        {priceRanges.map((range) => (
          <label key={range.id} className={optionClass}>
            <input type="radio" name="price" checked={price === range.id} onChange={() => update('price', range.id)} className="accent-brand" />
            {range.label}
          </label>
        ))}
      </fieldset>

      <div>
        <p className="mb-2 text-sm font-semibold">Availability</p>
        <label className={optionClass}>
          <input type="checkbox" checked={inStock} onChange={(event) => update('stock', event.target.checked ? '1' : null)} className="accent-brand" />
          In stock only
        </label>
        <label className={optionClass}>
          <input type="checkbox" checked={deals} onChange={(event) => update('deals', event.target.checked ? '1' : null)} className="accent-brand" />
          On sale
        </label>
      </div>

      {hasFilters && (
        <button type="button" onClick={() => setParams({}, { replace: true })} className="text-sm font-medium text-accent hover:underline">
          Clear all filters
        </button>
      )}
    </div>
  )

  return (
    <Container className="py-8 sm:py-10">
      <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-1 text-sm text-muted">
        <Link to="/" className="hover:text-ink">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-ink">{category ? category.name : 'Shop'}</span>
      </nav>

      <div className={`relative mb-8 overflow-hidden rounded-3xl ${category?.imageUrl ? 'isolate min-h-64 bg-brand text-white' : 'max-w-2xl'}`}>
        {category?.imageUrl && (
          <>
            <img src={category.imageUrl} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" />
            <span className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/90 via-ink/60 to-ink/10" />
          </>
        )}
        <div className={category?.imageUrl ? 'max-w-3xl p-6 sm:p-9' : ''}>
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">{title}</h1>
          <p className={`mt-2 ${category?.imageUrl ? 'text-white/80' : 'text-muted'}`}>{description}</p>
          {category && brandCounts.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium">Brands:</span>
              {brandCounts.map(([brand]) => {
                const active = activeBrands.includes(brand)
                return (
                  <button
                    key={brand}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggleBrand(brand)}
                    className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${active ? 'border-white bg-white text-brand' : 'border-white/50 bg-white/10 text-white hover:bg-white/20'}`}
                  >
                    {brand}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
        <aside className={`${showFilters ? 'block' : 'hidden'} rounded-2xl border border-line bg-white p-5 lg:block lg:border-0 lg:bg-transparent lg:p-0`}>
          {filters}
        </aside>

        <section>
          <div className="mb-6 flex items-center justify-between gap-3 border-b border-line pb-4">
            <p className="text-sm text-muted" aria-live="polite">
              {isLoading ? 'Loading...' : `${results.length} ${results.length === 1 ? 'product' : 'products'}`}
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowFilters((value) => !value)}
                aria-expanded={showFilters}
                className="flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-medium lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" /> Filters
              </button>
              <label className="flex items-center gap-2 text-sm">
                <span className="sr-only sm:not-sr-only text-muted">Sort by</span>
                <select
                  value={sort}
                  onChange={(event) => update('sort', event.target.value === 'featured' ? null : event.target.value)}
                  className="rounded-full border border-line bg-white px-4 py-2 text-sm outline-none focus:border-brand"
                >
                  {sorts.map((item) => (
                    <option key={item.id} value={item.id}>{item.label}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {isLoading ? (
            <ProductGridSkeleton count={PAGE_SIZE} />
          ) : results.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line py-20 text-center">
              <p className="font-display text-xl font-semibold">Nothing matches your search</p>
              <p className="mt-2 text-sm text-muted">Try removing a filter or searching for something else.</p>
              <button type="button" onClick={() => setParams({}, { replace: true })} className="mt-5 rounded-full bg-brand px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-dark">
                Reset filters
              </button>
            </div>
          ) : (
            <>
              <ProductGrid products={results.slice(0, visible)} />
              {visible < results.length && (
                <div className="mt-12 text-center">
                  <p className="mb-3 text-sm text-muted">Showing {Math.min(visible, results.length)} of {results.length}</p>
                  <button type="button" onClick={() => setPageState({ key: filterKey, count: visible + PAGE_SIZE })} className="rounded-full border border-ink/20 px-8 py-3 text-sm font-medium transition hover:bg-white">
                    Load more
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </Container>
  )
}
