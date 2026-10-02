import { Banknote, ChevronLeft, ChevronRight, RotateCcw, Truck } from 'lucide-react'
import { createElement, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useGetCategoriesQuery, useGetProductsQuery } from '@/features/catalog/catalogApi'
import { FREE_SHIPPING_THRESHOLD, TAGLINE } from '@/config/site'
import { categoryIcon, categoryTone } from '@/lib/category'
import { discountPercent, formatPrice } from '@/lib/format'
import Container from '@/components/ui/Container'
import Price from '@/components/ui/Price'
import ProductImage from '@/components/product/ProductImage'
import type { Category } from '@/types/catalog'

interface Slide {
  id: string
  dark?: boolean
  background: string
  eyebrow: string
  title: string
  text: string
  cta: { label: string; to: string }
  secondary?: { label: string; to: string }
  visual: ReactNode
}

const AUTOPLAY_MS = 6000

// Entrance animation that replays each time a slide becomes active.
const reveal = (active: boolean, delay: number, extra = '') => ({
  className: `${active ? 'animate-rise' : 'opacity-0'} ${extra}`,
  style: { animationDelay: `${delay}ms` } as CSSProperties,
})

function CollageTile({ category, className }: { category: Category; className: string }) {
  return (
    <Link
      to={`/category/${category.slug}`}
      className={`group absolute flex aspect-[4/5] flex-col items-center justify-center gap-3 rounded-3xl shadow-xl shadow-black/10 ring-4 ring-white/70 transition duration-300 hover:-translate-y-2 hover:rotate-0 ${categoryTone(category.slug)} ${className}`}
    >
      <span className="grid h-16 w-16 place-items-center rounded-full bg-white/60 transition group-hover:scale-110">
        {createElement(categoryIcon(category.slug), { className: 'h-8 w-8', strokeWidth: 1.3 })}
      </span>
      <span className="rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-ink">{category.name}</span>
    </Link>
  )
}

export default function HeroCarousel() {
  const { data: categories = [] } = useGetCategoriesQuery()
  const { data: products = [] } = useGetProductsQuery()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchStart = useRef<number | null>(null)

  const deals = products.filter((product) => product.compareAtPrice && product.stock > 0)
  const biggestDiscount = Math.max(0, ...deals.map((product) => discountPercent(product.price, product.compareAtPrice ?? product.price)))

  const slideBuilders: ((active: boolean) => Slide)[] = [
    (active) => ({
      id: 'welcome',
      background: 'bg-gradient-to-br from-cream to-[#d9e4fb]',
      eyebrow: 'New season, new arrivals',
      title: 'Good things for everyday living.',
      text: 'Clothing, beauty, electronics and home essentials, picked for quality and priced fairly.',
      cta: { label: 'Shop all products', to: '/shop' },
      secondary: { label: 'See the sale', to: '/shop?deals=1' },
      visual: (
        <div {...reveal(active, 150, 'relative mx-auto h-72 w-full max-w-md sm:h-96')}>
          {categories[1] && <CollageTile category={categories[1]} className="left-0 top-10 w-[40%] -rotate-6" />}
          {categories[2] && <CollageTile category={categories[2]} className="right-0 top-12 w-[40%] rotate-6" />}
          {categories[0] && <CollageTile category={categories[0]} className="left-1/2 top-0 z-10 w-[42%] -translate-x-1/2" />}
          {products.length > 0 && (
            <span className="absolute bottom-0 left-2 z-20 rounded-full bg-white px-4 py-2 text-sm font-medium shadow-lg">
              {products.length}+ products to explore
            </span>
          )}
        </div>
      ),
    }),
    ...(deals.length > 0
      ? [
          (active: boolean): Slide => ({
            id: 'sale',
            dark: true,
            background: 'bg-gradient-to-br from-[#0a2a8c] to-[#1a47c4]',
            eyebrow: 'Limited time offers',
            title: `Save up to ${biggestDiscount}% on selected favourites.`,
            text: 'Prices are already reduced. Stock is limited, so grab yours before it is gone.',
            cta: { label: 'Shop the sale', to: '/shop?deals=1' },
            visual: (
              <div {...reveal(active, 150, 'relative mx-auto h-72 w-full max-w-md sm:h-96')}>
                {deals.slice(0, 2).map((product, position) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    className={`absolute w-[52%] rounded-3xl bg-paper p-3 text-ink shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-2 hover:rotate-0 ${position === 0 ? 'left-0 top-10 -rotate-4' : 'right-0 top-0 rotate-4'}`}
                  >
                    <ProductImage name={product.name} category={product.category} imageUrl={product.imageUrl} className="aspect-square rounded-2xl" />
                    <p className="mt-3 line-clamp-1 text-sm font-medium">{product.name}</p>
                    <Price price={product.price} compareAt={product.compareAtPrice} />
                  </Link>
                ))}
                <div className="absolute -top-1 left-1/2 z-10 grid h-24 w-24 -translate-x-1/2 rotate-12 place-items-center rounded-full bg-accent text-center leading-tight text-white shadow-lg">
                  <span className="text-xs">
                    Up to
                    <br />
                    <b className="text-2xl">{biggestDiscount}%</b>
                    <br />
                    off
                  </span>
                </div>
              </div>
            ),
          }),
        ]
      : []),
    (active) => ({
      id: 'delivery',
      background: 'bg-gradient-to-br from-accent-soft to-[#ffddc7]',
      eyebrow: 'Shop with confidence',
      title: 'Pay when it arrives at your door.',
      text: 'Order from anywhere in Bangladesh with cash on delivery, and return it if it is not right.',
      cta: { label: 'Start shopping', to: '/shop' },
      visual: (
        <div {...reveal(active, 150, 'mx-auto w-full max-w-md')}>
          <p className="mb-4 inline-block -rotate-2 rounded-full bg-brand px-4 py-1.5 text-sm font-medium text-white shadow-md">{TAGLINE}</p>
          <ul className="space-y-3">
            {[
              { icon: Banknote, title: 'Cash on delivery', text: 'No advance payment needed' },
              { icon: Truck, title: 'Free delivery', text: `On orders over ${formatPrice(FREE_SHIPPING_THRESHOLD)}` },
              { icon: RotateCcw, title: 'Easy returns', text: '30 days, no questions asked' },
            ].map(({ icon: Icon, title, text }, position) => (
              <li
                key={title}
                className={`flex items-center gap-4 rounded-2xl bg-paper p-4 shadow-lg shadow-black/5 ${position === 1 ? 'sm:translate-x-8' : ''}`}
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand-soft text-brand">
                  <Icon className="h-6 w-6" strokeWidth={1.5} />
                </span>
                <div>
                  <p className="font-semibold">{title}</p>
                  <p className="text-sm text-muted">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ),
    }),
  ]

  const count = slideBuilders.length
  const current = index % count
  const go = (target: number) => setIndex((target + count) % count)
  const slides = slideBuilders.map((build, position) => build(position === current))
  const dark = slides[current].dark

  const arrowButton = 'grid h-10 w-10 place-items-center rounded-full border border-current/30 transition hover:bg-current/10'

  return (
    <Container className="pt-5">
      <section
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured offers"
        className="relative overflow-hidden rounded-[2rem]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={(event) => setPaused(event.target.matches(':focus-visible'))}
        onBlur={() => setPaused(false)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft') go(current - 1)
          if (event.key === 'ArrowRight') go(current + 1)
        }}
        onTouchStart={(event) => {
          touchStart.current = event.touches[0].clientX
        }}
        onTouchEnd={(event) => {
          if (touchStart.current === null) return
          const delta = event.changedTouches[0].clientX - touchStart.current
          touchStart.current = null
          if (Math.abs(delta) > 50) go(delta < 0 ? current + 1 : current - 1)
        }}
      >
        <div className="grid">
          {slides.map((slide, position) => {
            const active = position === current
            return (
              <div
                key={slide.id}
                role="group"
                aria-roledescription="slide"
                aria-label={`${position + 1} of ${count}`}
                aria-hidden={!active}
                inert={!active}
                className={`relative col-start-1 row-start-1 overflow-hidden transition-opacity duration-700 ${slide.background} ${slide.dark ? 'text-white' : 'text-ink'} ${active ? 'z-10 opacity-100' : 'pointer-events-none z-0 opacity-0'}`}
              >
                <span className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-current/5" />
                <span className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-current/5" />

                <div className="relative grid items-center gap-10 px-7 pb-28 pt-10 sm:px-10 md:grid-cols-2 md:px-14 md:pb-24 md:pt-14">
                  <div>
                    <p {...reveal(active, 0, 'mb-5 inline-flex items-center gap-2 rounded-full border border-current/20 px-3.5 py-1.5 text-xs font-medium')}>
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                      {slide.eyebrow}
                    </p>
                    <h1 {...reveal(active, 90, 'font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.4rem]')}>
                      {slide.title}
                    </h1>
                    <p {...reveal(active, 180, `mt-5 max-w-md text-lg leading-relaxed ${slide.dark ? 'text-white/80' : 'text-muted'}`)}>{slide.text}</p>
                    <div {...reveal(active, 270, 'mt-8 flex flex-wrap gap-3')}>
                      <Link
                        to={slide.cta.to}
                        className={`rounded-full px-7 py-3 font-medium shadow-sm transition hover:-translate-y-0.5 ${slide.dark ? 'bg-white text-brand hover:bg-brand-soft' : 'bg-brand text-white hover:bg-brand-dark'}`}
                      >
                        {slide.cta.label}
                      </Link>
                      {slide.secondary && (
                        <Link
                          to={slide.secondary.to}
                          className={`rounded-full border px-7 py-3 font-medium transition ${slide.dark ? 'border-white/40 hover:bg-white/10' : 'border-ink/20 hover:bg-white/70'}`}
                        >
                          {slide.secondary.label}
                        </Link>
                      )}
                    </div>
                  </div>
                  {slide.visual}
                </div>
              </div>
            )
          })}
        </div>

        <div className={`absolute inset-x-0 bottom-0 z-20 flex items-center justify-between gap-4 px-7 pb-6 sm:px-10 md:px-14 md:pb-7 ${dark ? 'text-white' : 'text-ink'}`}>
          <div className="flex items-center gap-2" role="tablist" aria-label="Choose slide">
            {slides.map((slide, position) => (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={position === current}
                aria-label={`Go to slide ${position + 1}`}
                onClick={() => go(position)}
                className="flex h-6 w-10 items-center sm:w-14"
              >
                <span className="relative block h-1 w-full overflow-hidden rounded-full bg-current/25">
                  {position === current && (
                    <span
                      key={`${current}-bar`}
                      onAnimationEnd={() => go(current + 1)}
                      style={{ '--duration': `${AUTOPLAY_MS}ms`, animationPlayState: paused ? 'paused' : 'running' } as CSSProperties}
                      className="absolute inset-0 origin-left animate-progress rounded-full bg-current motion-reduce:animate-none"
                    />
                  )}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm tabular-nums opacity-70">
              {String(current + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
            </span>
            <button type="button" aria-label="Previous slide" onClick={() => go(current - 1)} className={arrowButton}>
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button type="button" aria-label="Next slide" onClick={() => go(current + 1)} className={arrowButton}>
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>
    </Container>
  )
}
