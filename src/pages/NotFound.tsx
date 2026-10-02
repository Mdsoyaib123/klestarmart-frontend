import { Link } from 'react-router-dom'
import Container from '@/components/ui/Container'

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center py-28 text-center">
      <p className="font-display text-6xl font-semibold text-brand">404</p>
      <h1 className="mt-4 font-display text-2xl font-semibold">We could not find that page</h1>
      <p className="mt-2 text-muted">The link may be broken, or the page may have moved.</p>
      <Link to="/" className="mt-6 rounded-full bg-brand px-8 py-3 font-medium text-white hover:bg-brand-dark">
        Back to home
      </Link>
    </Container>
  )
}
