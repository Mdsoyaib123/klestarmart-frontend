import { Heart, Menu, Search, ShoppingBag, X } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { useGetCategoriesQuery, useGetProductsQuery } from '@/features/catalog/catalogApi'
import { selectCartCount } from '@/features/cart/cartSlice'
import { selectWishlistIds } from '@/features/wishlist/wishlistSlice'
import { openCart } from '@/features/ui/uiSlice'
import { FREE_SHIPPING_THRESHOLD, SITE_NAME } from '@/config/site'
import { formatPrice } from '@/lib/format'
import Container from '@/components/ui/Container'
import Logo from '@/components/ui/Logo'

const iconButton = 'relative grid h-10 w-10 place-items-center rounded-full transition hover:bg-cream'

export default function Header() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { data: categories = [] } = useGetCategoriesQuery()
  const { data: products = [] } = useGetProductsQuery()
  const cartCount = useAppSelector(selectCartCount)
  const wishlistCount = useAppSelector(selectWishlistIds).length
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)

  const term = query.trim().toLowerCase()
  const suggestions =
    term.length >= 2 ? products.filter((product) => `${product.name} ${product.brand}`.toLowerCase().includes(term)).slice(0, 5) : []

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setMenuOpen(false)
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  const onSearch = (event: FormEvent) => {
    event.preventDefault()
    const term = query.trim()
    navigate(term ? `/shop?q=${encodeURIComponent(term)}` : '/shop')
    setFocused(false)
    setMenuOpen(false)
  }

  const navLink = ({ isActive }: { isActive: boolean }) =>
    `border-b-2 py-3 text-sm font-medium transition ${isActive ? 'border-brand text-brand' : 'border-transparent text-muted hover:text-ink'}`

  const searchForm = (
    <form
      onSubmit={onSearch}
      role="search"
      className="relative w-full"
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false)
      }}
    >
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search for products or brands"
        aria-label="Search products"
        className="h-11 w-full rounded-full border border-line bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-muted focus:border-brand"
      />
      {focused && suggestions.length > 0 && (
        <ul className="absolute inset-x-0 top-full z-10 mt-2 overflow-hidden rounded-2xl border border-line bg-white shadow-lg">
          {suggestions.map((product) => (
            <li key={product.id}>
              <Link
                to={`/product/${product.id}`}
                onClick={() => {
                  setQuery('')
                  setFocused(false)
                  setMenuOpen(false)
                }}
                className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm hover:bg-cream"
              >
                <span className="truncate">{product.name}</span>
                <span className="shrink-0 font-medium">{formatPrice(product.price)}</span>
              </Link>
            </li>
          ))}
          <li>
            <button type="submit" className="w-full border-t border-line px-4 py-2.5 text-left text-sm font-medium text-brand hover:bg-cream">
              See all results for &ldquo;{query.trim()}&rdquo;
            </button>
          </li>
        </ul>
      )}
    </form>
  )

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
      <div className="bg-brand py-2 text-center text-xs text-white">
        Free delivery on orders over {formatPrice(FREE_SHIPPING_THRESHOLD)} &nbsp;&middot;&nbsp; Cash on delivery available
      </div>

      <Container>
        <div className="flex h-16 items-center gap-4">
          <button type="button" aria-label="Open menu" className={`${iconButton} -ml-2 lg:hidden`} onClick={() => setMenuOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>

          <Link to="/" aria-label={`${SITE_NAME} home`} className="shrink-0">
            <Logo className="h-11" />
          </Link>

          <div className="mx-auto hidden w-full max-w-md md:block">{searchForm}</div>

          <div className="ml-auto flex items-center gap-1 md:ml-0">
            <Link to="/wishlist" aria-label="Wishlist" className={iconButton}>
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-semibold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <button type="button" aria-label={`Open bag, ${cartCount} items`} className={iconButton} onClick={() => dispatch(openCart())}>
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-brand px-1 text-[10px] font-semibold text-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <nav aria-label="Categories" className="hidden items-center gap-7 lg:flex">
          <NavLink to="/shop" end className={navLink}>
            All products
          </NavLink>
          {categories.map((category) => (
            <NavLink key={category.slug} to={`/category/${category.slug}`} className={navLink}>
              {category.name}
            </NavLink>
          ))}
          <NavLink to="/shop?deals=1" className="py-3 text-sm font-medium text-accent hover:underline">
            Sale
          </NavLink>
        </nav>
      </Container>

      <div className={`fixed inset-0 z-50 lg:hidden ${menuOpen ? '' : 'pointer-events-none'}`}>
        <div className={`absolute inset-0 bg-ink/40 transition-opacity ${menuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setMenuOpen(false)} />
        <aside
          aria-hidden={!menuOpen}
          inert={!menuOpen}
          className={`absolute inset-y-0 left-0 flex w-[85%] max-w-sm flex-col bg-paper p-5 shadow-xl transition-transform duration-300 ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="mb-5 flex items-center justify-between">
            <Logo className="h-9" />
            <button type="button" aria-label="Close menu" className={iconButton} onClick={() => setMenuOpen(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>
          {searchForm}
          <nav aria-label="Categories" onClick={() => setMenuOpen(false)} className="mt-6 flex flex-col divide-y divide-line">
            <Link to="/shop" className="py-3.5 font-medium">All products</Link>
            {categories.map((category) => (
              <Link key={category.slug} to={`/category/${category.slug}`} className="py-3.5 font-medium">
                {category.name}
              </Link>
            ))}
            <Link to="/shop?deals=1" className="py-3.5 font-medium text-accent">Sale</Link>
          </nav>
        </aside>
      </div>
    </header>
  )
}
