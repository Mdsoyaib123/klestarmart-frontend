import { BadgeCheck, PenLine, ThumbsUp } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { useGetReviewsQuery } from '@/features/catalog/catalogApi'
import { addReview, selectUserReviews } from '@/features/reviews/reviewsSlice'
import { ratingDistribution } from '@/data/reviews'
import { formatDate } from '@/lib/format'
import Stars from '@/components/ui/Stars'
import StarsInput from '@/components/ui/StarsInput'
import type { Product, Review } from '@/types/catalog'

const PAGE_SIZE = 5

const sorts = [
  { id: 'recent', label: 'Most recent' },
  { id: 'helpful', label: 'Most helpful' },
  { id: 'highest', label: 'Highest rated' },
  { id: 'lowest', label: 'Lowest rated' },
]

const inputClass = 'w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none transition focus:border-brand'

export default function ReviewsSection({ product }: { product: Product }) {
  const dispatch = useAppDispatch()
  const { data: sample = [], isLoading } = useGetReviewsQuery(product.id)
  const stored = useAppSelector(selectUserReviews)
  const [star, setStar] = useState<number | null>(null)
  const [sort, setSort] = useState('recent')
  const [visible, setVisible] = useState(PAGE_SIZE)
  const [voted, setVoted] = useState<string[]>([])
  const [formOpen, setFormOpen] = useState(false)
  const [posted, setPosted] = useState(false)
  const [rating, setRating] = useState(0)
  const [error, setError] = useState('')

  const mine = stored.filter((review) => review.productId === product.id)
  const distribution = ratingDistribution(product.rating, product.reviewCount).map((row) => ({
    ...row,
    count: row.count + mine.filter((review) => review.rating === row.star).length,
  }))
  const total = distribution.reduce((sum, row) => sum + row.count, 0)
  const average = distribution.reduce((sum, row) => sum + row.star * row.count, 0) / total
  const recommend = Math.round(((distribution[0].count + distribution[1].count) / total) * 100)

  const helpfulCount = (review: Review) => review.helpful + (voted.includes(review.id) ? 1 : 0)
  const shown = [...mine, ...sample].filter((review) => star === null || review.rating === star)
  shown.sort((a, b) => {
    if (sort === 'helpful') return helpfulCount(b) - helpfulCount(a)
    if (sort === 'highest') return b.rating - a.rating
    if (sort === 'lowest') return a.rating - b.rating
    return b.date.localeCompare(a.date)
  })

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!rating) {
      setError('Please choose a star rating.')
      return
    }
    const data = new FormData(event.currentTarget)
    dispatch(
      addReview({
        id: `me-${Date.now()}`,
        productId: product.id,
        author: String(data.get('name') ?? '').trim() || 'Customer',
        rating,
        title: String(data.get('title') ?? '').trim(),
        body: String(data.get('body') ?? '').trim(),
        date: new Date().toISOString(),
        verified: false,
        helpful: 0,
      }),
    )
    setRating(0)
    setError('')
    setFormOpen(false)
    setPosted(true)
    setStar(null)
    setSort('recent')
  }

  return (
    <section id="reviews" aria-labelledby="reviews-heading" className="mt-16 scroll-mt-40">
      <h2 id="reviews-heading" className="font-display text-2xl font-semibold sm:text-3xl">
        Customer reviews
      </h2>
      <p role="note" className="mt-2 text-sm text-muted">
        Preview only: ratings and review text are sample content, not verified customer feedback.
      </p>

      <div className="mt-6 grid gap-8 rounded-3xl border border-line bg-white p-6 sm:p-8 md:grid-cols-[260px_1fr]">
        <div className="text-center md:text-left">
          <p className="font-display text-5xl font-semibold">{average.toFixed(1)}</p>
          <div className="mt-2 flex justify-center md:justify-start">
            <Stars value={average} size="h-5 w-5" />
          </div>
          <p className="mt-2 text-sm text-muted">Based on {total.toLocaleString()} reviews</p>
          <p className="mt-1 text-sm font-medium text-success">{recommend}% of buyers recommend this</p>
          <button
            type="button"
            onClick={() => {
              setFormOpen((open) => !open)
              setPosted(false)
            }}
            aria-expanded={formOpen}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
          >
            <PenLine className="h-4 w-4" /> Write a review
          </button>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold">Rating breakdown</p>
          <ul className="space-y-1.5">
            {distribution.map(({ star: value, count }) => {
              const active = star === value
              return (
                <li key={value}>
                  <button
                    type="button"
                    aria-pressed={active}
                    aria-label={`Show ${value} star reviews`}
                    onClick={() => {
                      setStar(active ? null : value)
                      setVisible(PAGE_SIZE)
                    }}
                    className={`flex w-full items-center gap-3 rounded-lg px-2 py-1 text-sm transition hover:bg-cream ${active ? 'bg-brand-soft' : ''}`}
                  >
                    <span className="w-12 text-left font-medium">{value} star</span>
                    <span className="h-2 flex-1 overflow-hidden rounded-full bg-sand">
                      <span className="block h-full rounded-full bg-amber-500" style={{ width: `${(count / total) * 100}%` }} />
                    </span>
                    <span className="w-10 text-right text-muted">{count}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      {posted && (
        <p role="status" className="mt-4 rounded-xl bg-brand-soft px-4 py-3 text-sm font-medium text-brand">
          Your review is saved in this browser preview only; it has not been published.
        </p>
      )}

      {formOpen && (
        <form onSubmit={onSubmit} className="mt-4 space-y-5 rounded-3xl border border-line bg-white p-6 sm:p-8">
          <h3 className="font-display text-xl font-semibold">Share your experience</h3>
          <div>
            <p className="mb-2 text-sm font-medium">Your rating</p>
            <StarsInput
              value={rating}
              onChange={(value) => {
                setRating(value)
                setError('')
              }}
            />
            {error && (
              <p role="alert" className="mt-2 text-sm text-accent">
                {error}
              </p>
            )}
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Your name</span>
              <input name="name" autoComplete="name" required maxLength={40} className={inputClass} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Review title</span>
              <input name="title" required maxLength={80} className={inputClass} placeholder="Sum it up in a few words" />
            </label>
          </div>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Your review</span>
            <textarea name="body" required minLength={10} maxLength={1000} rows={4} className={inputClass} placeholder="What did you like or dislike?" />
          </label>
          <div className="flex gap-3">
            <button type="submit" className="rounded-full bg-brand px-7 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark">
              Submit review
            </button>
            <button type="button" onClick={() => setFormOpen(false)} className="rounded-full border border-line px-6 py-2.5 text-sm font-medium hover:bg-cream">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
        <p className="text-sm text-muted" aria-live="polite">
          {star ? `${shown.length} review${shown.length === 1 ? '' : 's'} with ${star} star${star > 1 ? 's' : ''}` : 'Latest reviews'}
          {star && (
            <button type="button" onClick={() => setStar(null)} className="ml-3 font-medium text-brand hover:underline">
              Clear filter
            </button>
          )}
        </p>
        <label className="flex items-center gap-2 text-sm">
          <span className="text-muted">Sort by</span>
          <select value={sort} onChange={(event) => setSort(event.target.value)} className="rounded-full border border-line bg-white px-4 py-2 outline-none focus:border-brand">
            {sorts.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {isLoading ? (
        <div className="space-y-6 py-6" aria-busy="true">
          {[0, 1, 2].map((item) => (
            <div key={item} className="animate-pulse space-y-3">
              <div className="h-4 w-1/4 rounded bg-sand/70" />
              <div className="h-4 w-1/2 rounded bg-sand/70" />
              <div className="h-12 rounded bg-sand/70" />
            </div>
          ))}
        </div>
      ) : shown.length === 0 ? (
        <p className="py-12 text-center text-muted">No reviews match this filter yet.</p>
      ) : (
        <>
          <ul className="divide-y divide-line">
            {shown.slice(0, visible).map((review) => (
              <li key={review.id} className="py-6">
                <div className="flex items-start gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-soft font-semibold text-brand">
                    {review.author.charAt(0)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <p className="font-semibold">{review.author}</p>
                      {review.verified && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
                          <BadgeCheck className="h-4 w-4" /> Verified purchase
                        </span>
                      )}
                      <span className="text-xs text-muted">{formatDate(review.date)}</span>
                    </div>
                    <div className="mt-1.5 flex items-center gap-2">
                      <Stars value={review.rating} />
                      <span className="sr-only">{review.rating} out of 5 stars</span>
                      <p className="font-medium">{review.title}</p>
                    </div>
                    <p className="mt-2 leading-relaxed text-muted">{review.body}</p>
                    <button
                      type="button"
                      aria-pressed={voted.includes(review.id)}
                      disabled={review.id.startsWith('me-')}
                      onClick={() => setVoted((list) => (list.includes(review.id) ? list.filter((id) => id !== review.id) : [...list, review.id]))}
                      className={`mt-3 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${voted.includes(review.id) ? 'border-brand bg-brand-soft text-brand' : 'border-line hover:border-brand'}`}
                    >
                      <ThumbsUp className="h-3.5 w-3.5" /> Helpful ({helpfulCount(review)})
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {visible < shown.length && (
            <div className="text-center">
              <button
                type="button"
                onClick={() => setVisible((value) => value + PAGE_SIZE)}
                className="rounded-full border border-ink/20 px-8 py-3 text-sm font-medium transition hover:bg-white"
              >
                Load more reviews
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
}
