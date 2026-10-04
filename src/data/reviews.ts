import type { Product, Review } from '@/types/catalog'

const BASE_DATE = new Date('2026-09-30T00:00:00Z').getTime()
const DAY_MS = 86_400_000

const names = [
  'Rahim U.', 'Nusrat J.', 'Tanvir A.', 'Farzana K.', 'Imran H.', 'Sumaiya R.', 'Mahfuz B.', 'Tasnim S.',
  'Arif M.', 'Lamia C.', 'Sabbir D.', 'Mim A.', 'Kamrul I.', 'Raisa T.', 'Shakil P.', 'Ayesha N.',
]

const titles: Record<number, string[]> = {
  5: ['Absolutely love it', 'Better than expected', 'Worth every taka', 'Highly recommended', 'Perfect'],
  4: ['Very good', 'Happy with this', 'Good value', 'Solid quality'],
  3: ['It is okay', 'Decent, not perfect'],
  2: ['Not quite what I expected'],
  1: ['Disappointed'],
}

const praise: Record<string, string[]> = {
  clothing: [
    'The fabric feels great and the fit is spot on.',
    'Comfortable all day and it still looks new after a few washes.',
    'Exactly the colour in the photos, and the stitching is neat.',
    'I ordered my usual size and it fits perfectly.',
  ],
  beauty: [
    'It feels gentle on my skin and works exactly as described.',
    'Absorbs quickly and I noticed a difference within two weeks.',
    'No irritation at all, and a little goes a long way.',
    'The texture and scent are lovely. I will reorder.',
  ],
  electronics: [
    'It works flawlessly and the build quality feels solid.',
    'Setup took a minute and the battery easily lasts the week.',
    'Great performance for the price, better than the brands I used before.',
    'Sound and build are both excellent. Very happy with it.',
  ],
  'home-living': [
    'It looks lovely at home and feels really well made.',
    'Better quality than I expected and it matches my room perfectly.',
    'Sturdy, well finished and easy to keep clean.',
    'Guests keep asking where I bought it.',
  ],
  accessories: [
    'It looks stylish and feels durable.',
    'The material is genuinely good and it goes with everything.',
    'Compact, well made and great as a gift too.',
    'Finish and details are better than the price suggests.',
  ],
}

const delivery = [
  'Delivery was quick and the packaging was neat.',
  'Arrived in two days, well packed.',
  'The seller confirmed my order quickly and it came on time.',
  'Cash on delivery made it easy to order with confidence.',
  'The rider called before arriving, which was a nice touch.',
  '',
  '',
]

const mixed = [
  'Good overall, but I expected slightly better quality for the price.',
  'Does the job. A few small things could be better.',
  'Average experience. It matches the photos but nothing special.',
]

const poor = ['It did not meet my expectations and I would not buy it again.', 'The quality was lower than I hoped for.']

const hash = (value: string) => {
  let h = 1779033703 ^ value.length
  for (const char of value) {
    h = Math.imul(h ^ char.charCodeAt(0), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return h >>> 0
}

// Small seeded generator so every product shows the same sample reviews on each visit.
const seeded = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

export const ratingDistribution = (rating: number, total: number) => {
  // Exponential weights whose mean is tuned to the product rating, so the breakdown always agrees with it.
  const mean = (k: number) => {
    const weights = [1, 2, 3, 4, 5].map((star) => Math.exp(k * star))
    return weights.reduce((sum, weight, index) => sum + weight * (index + 1), 0) / weights.reduce((a, b) => a + b, 0)
  }
  let low = -3
  let high = 6
  for (let step = 0; step < 40; step++) {
    const mid = (low + high) / 2
    if (mean(mid) < rating) low = mid
    else high = mid
  }
  const weights = [5, 4, 3, 2, 1].map((star) => Math.exp(((low + high) / 2) * star))
  const sum = weights.reduce((a, b) => a + b, 0)
  const counts = weights.map((weight) => Math.floor((weight / sum) * total))
  counts[0] += total - counts.reduce((a, b) => a + b, 0)
  return [5, 4, 3, 2, 1].map((star, index) => ({ star, count: counts[index] }))
}

export const generateReviews = (product: Product): Review[] => {
  const random = seeded(hash(product.id))
  const distribution = ratingDistribution(product.rating, product.reviewCount)
  const pick = <T,>(list: T[]) => list[Math.floor(random() * list.length)]

  const sampleRating = () => {
    let roll = random() * product.reviewCount
    for (const { star, count } of distribution) {
      roll -= count
      if (roll <= 0) return star
    }
    return 5
  }

  return Array.from({ length: Math.min(14, product.reviewCount) }, (_, index) => {
    const rating = sampleRating()
    const body =
      rating >= 4
        ? `${pick(praise[product.category] ?? ['Great quality for the price.'])} ${pick(delivery)}`.trim()
        : rating === 3
          ? pick(mixed)
          : pick(poor)

    return {
      id: `${product.id}-${index}`,
      productId: product.id,
      author: names[(hash(product.id) + index * 5) % names.length],
      rating,
      title: pick(titles[rating]),
      body,
      date: new Date(BASE_DATE - (index * 7 + Math.floor(random() * 6) + 1) * DAY_MS).toISOString(),
      verified: false,
      helpful: Math.floor(random() * 24),
    }
  })
}
