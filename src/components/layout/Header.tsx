import { Flame, Heart, LayoutGrid, LogIn, Search, ShoppingBag, UserRound } from 'lucide-react'
import { createElement, useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'
import { useGetCategoriesQuery, useGetProductsQuery } from '@/features/catalog/catalogApi'
import { selectCartCount } from '@/features/cart/cartSlice'
import { selectWishlistIds } from '@/features/wishlist/wishlistSlice'
import { useGetMeQuery } from '@/features/account/accountApi'
import { useSiteSettings } from '@/features/settings/settingsApi'
import { categoryIcon } from '@/lib/category'
import { formatPrice } from '@/lib/format'
import Container from '@/components/ui/Container'
import Logo from '@/components/ui/Logo'

const iconButton =
  'relative grid h-11 w-11 place-items-center rounded-full border border-line bg-white transition hover:border-brand hover:text-brand'
const badge = 'absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full px-1 text-[11px] font-semibold text-white'

export default function Header() {
  const navigate = useNavigate()
  const { pathname, search } = useLocation()
  const { data: categories = [] } = useGetCategoriesQuery()
  const { data: products = [] } = useGetProductsQuery()
  const { siteName, announcement } = useSiteSettings()
  const { data: me } = useGetMeQuery()
  const cartCount = useAppSelector(selectCartCount)
  const wishlistCount = useAppSelector(selectWishlistIds).length
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)

  const term = query.trim().toLowerCase()
  const suggestions =
    term.length >= 2 ? products.filter((product) => `${product.name} ${product.brand}`.toLowerCase().includes(term)).slice(0, 5) : []

  const onSearch = (event: FormEvent) => {
    event.preventDefault()
    const value = query.trim()
    navigate(value ? `/shop?q=${encodeURIComponent(value)}` : '/shop')
    setFocused(false)
  }

  const onDeals = pathname === '/shop' && search.includes('deals=1')
  const onAll = pathname === '/shop' && !onDeals

  const chip = (active: boolean, tone = 'bg-cream text-ink hover:bg-sand') =>
    `inline-flex shrink-0 items-center gap-2 rounded-full py-1.5 pl-1.5 pr-4 text-sm font-medium transition ${
      active ? 'bg-brand text-white shadow-sm' : tone
    }`
  const chipIcon = (active: boolean) =>
    `grid h-7 w-7 place-items-center rounded-full ${active ? 'bg-white/20' : 'bg-white text-brand'}`

  return (
    <>
      {announcement.enabled && announcement.text && (
        <div className="bg-brand px-4 py-2 text-center text-xs text-white">{announcement.text}</div>
      )}

      <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
        <Container>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3 py-3 md:flex-nowrap md:gap-x-6">
            <Link to="/" aria-label={`${siteName} home`} className="order-1 shrink-0">
              <Logo className="h-10 sm:h-11" />
            </Link>

            <form
              onSubmit={onSearch}
              role="search"
              className="relative order-3 w-full md:order-2 md:mx-auto md:max-w-xl md:flex-1"
              onFocus={() => setFocused(true)}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false)
              }}
            >
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search for products or brands"
                aria-label="Search products"
                className="h-12 w-full rounded-full border border-transparent bg-cream pl-5 pr-14 text-sm outline-none transition placeholder:text-muted focus:border-brand focus:bg-white"
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute right-1.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-brand text-white transition hover:bg-brand-dark"
              >
                <Search className="h-4 w-4" />
              </button>

              {focused && suggestions.length > 0 && (
                <ul className="absolute inset-x-0 top-full z-10 mt-2 overflow-hidden rounded-2xl border border-line bg-white shadow-lg">
                  {suggestions.map((product) => (
                    <li key={product.id}>
                      <Link
                        to={`/product/${product.slug}`}
                        onClick={() => {
                          setQuery('')
                          setFocused(false)
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

            <div className="order-2 ml-auto flex items-center gap-2 md:order-3 md:ml-0">
              <Link to="/wishlist" aria-label="Wishlist" className={iconButton}>
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && <span className={`${badge} bg-accent`}>{wishlistCount}</span>}
              </Link>
              <Link to="/cart" aria-label={`View shopping bag, ${cartCount} items`} className={iconButton}>
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && <span className={`${badge} bg-brand`}>{cartCount}</span>}
              </Link>
              {me ? (
                <Link
                  to="/account"
                  className="ml-1 inline-flex h-11 max-w-40 items-center gap-2 rounded-full border border-line bg-white px-4 text-sm font-semibold transition hover:border-brand hover:text-brand"
                >
                  <UserRound className="h-4 w-4 shrink-0" />
                  <span className="truncate">{me.name.split(' ')[0]}</span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="ml-1 inline-flex h-11 items-center gap-2 rounded-full bg-brand px-4 text-sm font-semibold text-white transition hover:bg-brand-dark sm:px-5"
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>
              )}
            </div>
          </div>

          <nav aria-label="Categories" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-3 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
            <Link to="/shop" aria-current={onAll ? 'page' : undefined} className={chip(onAll)}>
              <span className={chipIcon(onAll)}>
                <LayoutGrid className="h-4 w-4" />
              </span>
              All products
            </Link>

            {categories.map((category) => {
              const active = pathname === `/category/${category.slug}`
              return (
                <Link key={category.slug} to={`/category/${category.slug}`} aria-current={active ? 'page' : undefined} className={chip(active)}>
                  <span className={chipIcon(active)}>{createElement(categoryIcon(category.slug), { className: 'h-4 w-4' })}</span>
                  {category.name}
                </Link>
              )
            })}

            <Link to="/shop?deals=1" aria-current={onDeals ? 'page' : undefined} className={chip(onDeals, 'bg-accent-soft text-accent hover:bg-[#ffe1cc]')}>
              <span className={`grid h-7 w-7 place-items-center rounded-full ${onDeals ? 'bg-white/20' : 'bg-white text-accent'}`}>
                <Flame className="h-4 w-4" />
              </span>
              Sale
            </Link>
          </nav>
        </Container>
      </header>
    </>
  )
}
