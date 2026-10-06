import { Check, ShieldCheck, Truck } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { errorMessage } from '@/api/baseApi'
import { useGetMeQuery, useRegisterMutation } from '@/features/account/accountApi'
import { useSiteSettings } from '@/features/settings/settingsApi'
import Container from '@/components/ui/Container'

const inputClass = 'h-12 w-full rounded-xl border border-line bg-white px-4 text-sm outline-none transition focus:border-brand'

const benefits = [
  { icon: Truck, text: 'Track your orders in one place' },
  { icon: ShieldCheck, text: 'A quicker, easier checkout' },
  { icon: Check, text: 'Keep your wishlist saved' },
]

export default function Register() {
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { data: me } = useGetMeQuery()
  const { siteName } = useSiteSettings()
  const [register, { isLoading }] = useRegisterMutation()

  if (me) return <Navigate to="/account" replace />

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const text = (name: string) => String(form.get(name) ?? '').trim()
    if (form.get('password') !== form.get('confirmPassword')) {
      setError('Your passwords do not match.')
      return
    }
    setError('')
    try {
      await register({ name: text('name'), phone: text('phone'), email: text('email') || undefined, password: String(form.get('password')) }).unwrap()
      navigate('/account', { replace: true })
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  return (
    <Container className="py-10 sm:py-16">
      <div className="mx-auto grid max-w-4xl overflow-hidden rounded-3xl border border-line bg-white shadow-sm md:grid-cols-[0.9fr_1.1fr]">
        <aside className="bg-brand p-7 text-white sm:p-9">
          <p className="text-sm font-semibold uppercase tracking-widest text-white/70">{siteName} account</p>
          <h1 className="mt-4 font-display text-3xl font-semibold leading-tight">Shopping, made a little easier.</h1>
          <p className="mt-3 text-sm leading-relaxed text-white/75">
            Create an account to keep your orders and favourites together. Ordered before as a guest? Use the same phone number to see those orders too.
          </p>
          <ul className="mt-8 space-y-4">
            {benefits.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm font-medium">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/15">
                  <Icon className="h-4 w-4" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </aside>

        <div className="p-7 sm:p-9">
          <h2 className="font-display text-2xl font-semibold">Create your account</h2>
          <p className="mt-2 text-sm text-muted">It only takes a minute.</p>

          <form onSubmit={onSubmit} className="mt-7 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Full name</span>
              <input name="name" autoComplete="name" required maxLength={80} className={inputClass} placeholder="Your name" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Mobile number</span>
              <input
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                pattern="01[3-9][0-9]{8}"
                title="Enter an 11-digit Bangladesh mobile number, for example 01712345678"
                className={inputClass}
                placeholder="01XXXXXXXXX"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Email <span className="font-normal text-muted">(optional)</span></span>
              <input name="email" type="email" autoComplete="email" className={inputClass} placeholder="you@example.com" />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">Password</span>
                <input name="password" type="password" autoComplete="new-password" required minLength={8} className={inputClass} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">Confirm password</span>
                <input name="confirmPassword" type="password" autoComplete="new-password" required minLength={8} className={inputClass} />
              </label>
            </div>
            {error && <p role="alert" className="rounded-xl bg-accent-soft px-4 py-3 text-sm text-accent">{error}</p>}
            <label className="flex items-start gap-2.5 pt-1 text-sm text-muted">
              <input type="checkbox" name="terms" required className="mt-0.5 accent-brand" />
              <span>I agree to the terms of service and privacy policy.</span>
            </label>
            <button type="submit" disabled={isLoading} className="h-12 w-full rounded-full bg-brand font-semibold text-white transition hover:bg-brand-dark disabled:opacity-70">
              {isLoading ? 'Creating your account…' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Already have an account? <Link to="/login" className="font-semibold text-brand hover:underline">Log in</Link>
          </p>
          <Link to="/shop" className="mt-3 block text-center text-sm text-muted hover:text-ink">Continue shopping as guest</Link>
        </div>
      </div>
    </Container>
  )
}
