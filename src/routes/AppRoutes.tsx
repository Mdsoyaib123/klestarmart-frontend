import { Route, Routes } from 'react-router-dom'
import MainLayout from '@/components/layout/MainLayout'
import Cart from '@/pages/Cart'
import Checkout from '@/pages/Checkout'
import Home from '@/pages/Home'
import NotFound from '@/pages/NotFound'
import ProductDetail from '@/pages/ProductDetail'
import Shop from '@/pages/Shop'
import Wishlist from '@/pages/Wishlist'

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/category/:slug" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
