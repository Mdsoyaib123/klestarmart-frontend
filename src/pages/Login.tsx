import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import Container from '@/components/ui/Container'

const inputClass = 'h-12 w-full rounded-xl border border-line bg-white px-4 text-sm outline-none transition focus:border-brand'

export default function Login() {
  const [notice, setNotice] = useState(false)

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    // There is no auth API yet, so signing in is not wired up.
    setNotice(true)
  }

  return (
    <Container className="py-12 sm:py-20">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-line bg-white p-7 shadow-sm sm:p-10">
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">Welcome back</h1>
        <p className="mt-2 text-sm text-muted">Log in to track your orders and check out faster.</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Mobile number or email</span>
            <input name="identifier" autoComplete="username" required className={inputClass} placeholder="01XXXXXXXXX" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Password</span>
            <input name="password" type="password" autoComplete="current-password" required className={inputClass} />
          </label>
          <button type="submit" className="h-12 w-full rounded-full bg-brand font-semibold text-white transition hover:bg-brand-dark">
            Login
          </button>
        </form>

        {notice && (
          <p role="status" className="mt-5 rounded-xl bg-accent-soft px-4 py-3 text-sm text-accent">
            Customer accounts are not available yet. You can still shop and check out as a guest.
          </p>
        )}

        <p className="mt-6 text-center text-sm text-muted">
          New to KlestarMart? <Link to="/register" className="font-semibold text-brand hover:underline">Create an account</Link>
        </p>
        <Link to="/shop" className="mt-6 block text-center text-sm font-medium text-brand hover:underline">
          Continue shopping
        </Link>
      </div>
    </Container>
  )
}
