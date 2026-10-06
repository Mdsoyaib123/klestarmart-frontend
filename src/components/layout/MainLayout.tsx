import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useAppDispatch } from '@/app/hooks'
import { useGetProductsQuery } from '@/features/catalog/catalogApi'
import { syncWithCatalog } from '@/features/cart/cartSlice'
import { useSiteSettings } from '@/features/settings/settingsApi'
import CartDrawer from '@/components/layout/CartDrawer'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'

export default function MainLayout() {
  const { pathname } = useLocation()
  const dispatch = useAppDispatch()
  const { data: products } = useGetProductsQuery()
  const { siteName, seo } = useSiteSettings()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  // Site name and description are managed in the dashboard (product pages set their own title).
  useEffect(() => {
    if (!pathname.startsWith('/product/')) document.title = siteName
    if (seo.metaDescription) document.querySelector('meta[name="description"]')?.setAttribute('content', seo.metaDescription)
  }, [pathname, siteName, seo.metaDescription])

  // Keep saved cart prices and stock in line with the current catalog.
  useEffect(() => {
    if (products) dispatch(syncWithCatalog(products))
  }, [products, dispatch])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  )
}
