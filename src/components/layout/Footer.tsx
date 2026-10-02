import { ArrowUp, Banknote, Mail, RotateCcw, ShieldCheck, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useGetCategoriesQuery } from '@/features/catalog/catalogApi'
import { DELIVERY_RATES, FREE_SHIPPING_THRESHOLD, SITE_NAME, TAGLINE } from '@/config/site'
import { formatPrice } from '@/lib/format'
import Container from '@/components/ui/Container'
import Logo from '@/components/ui/Logo'

const year = new Date().getFullYear()

const perks = [
  { icon: Truck, title: 'Fast delivery', text: `Free over ${formatPrice(FREE_SHIPPING_THRESHOLD)}` },
  { icon: Banknote, title: 'Cash on delivery', text: 'Pay when it arrives' },
  { icon: RotateCcw, title: 'Easy returns', text: '30 days, no questions asked' },
  { icon: ShieldCheck, title: 'Secure checkout', text: 'Your details stay protected' },
]

const linkClass = 'text-white/70 transition hover:text-white'
const headingClass = 'mb-4 text-sm font-semibold uppercase tracking-wider text-white'

export default function Footer() {
  const { data: categories = [] } = useGetCategoriesQuery()

  return (
    <footer className="mt-24">
      <div className="border-y border-line bg-cream">
        <Container className="grid gap-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {perks.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-center gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-brand shadow-sm">
                <Icon className="h-5 w-5" strokeWidth={1.7} />
              </span>
              <div>
                <p className="font-semibold">{title}</p>
                <p className="text-sm text-muted">{text}</p>
              </div>
            </div>
          ))}
        </Container>
      </div>

      <div className="bg-ink text-white">
        <Container>
          <div className="grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.3fr]">
            <div className="max-w-sm">
              <Logo className="h-12" />
              <p className="mt-5 font-medium text-white">{TAGLINE}</p>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                Everyday clothing, beauty, electronics and home essentials, chosen with care and delivered to your door across Bangladesh.
              </p>
              <a href="mailto:support@klestarmart.com" className={`mt-5 inline-flex items-center gap-2 text-sm ${linkClass}`}>
                <Mail className="h-4 w-4" />
                support@klestarmart.com
              </a>
            </div>

            <nav aria-label="Shop">
              <p className={headingClass}>Shop</p>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link to="/shop" className={linkClass}>All products</Link>
                </li>
                {categories.map((category) => (
                  <li key={category.slug}>
                    <Link to={`/category/${category.slug}`} className={linkClass}>
                      {category.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link to="/shop?deals=1" className="font-medium text-orange-300 transition hover:text-orange-200">
                    Sale
                  </Link>
                </li>
              </ul>
            </nav>

            <nav aria-label="Your account">
              <p className={headingClass}>My account</p>
              <ul className="space-y-3 text-sm">
                <li><Link to="/cart" className={linkClass}>Shopping bag</Link></li>
                <li><Link to="/wishlist" className={linkClass}>Wishlist</Link></li>
                <li><Link to="/checkout" className={linkClass}>Checkout</Link></li>
              </ul>
            </nav>

            <div>
              <p className={headingClass}>Delivery &amp; payment</p>
              <ul className="space-y-3 text-sm text-white/70">
                {Object.values(DELIVERY_RATES).map((rate) => (
                  <li key={rate.label} className="flex justify-between gap-4">
                    <span>
                      {rate.label}
                      <span className="block text-xs text-white/50">{rate.eta}</span>
                    </span>
                    <span className="font-medium text-white">{formatPrice(rate.fee)}</span>
                  </li>
                ))}
                <li className="border-t border-white/10 pt-3">Free delivery over {formatPrice(FREE_SHIPPING_THRESHOLD)}</li>
                <li>Pay by cash on delivery</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-6 text-sm text-white/60 sm:flex-row">
            <p>
              &copy; {year} {SITE_NAME}. All rights reserved.
            </p>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 transition hover:bg-white/10 hover:text-white"
            >
              Back to top <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </Container>
      </div>
    </footer>
  )
}
