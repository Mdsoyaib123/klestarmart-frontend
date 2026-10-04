import { Star } from 'lucide-react'
import { useState } from 'react'

const labels = ['Poor', 'Fair', 'Good', 'Very good', 'Excellent']

export default function StarsInput({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  const [hover, setHover] = useState(0)
  const shown = hover || value

  return (
    <div className="flex items-center gap-3">
      <div role="radiogroup" aria-label="Your rating" className="flex" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHover(star)}
            className="p-0.5"
          >
            <Star className={`h-7 w-7 transition ${star <= shown ? 'fill-amber-500 text-amber-500' : 'text-sand'}`} />
          </button>
        ))}
      </div>
      <span className="text-sm text-muted">{shown ? labels[shown - 1] : 'Select a rating'}</span>
    </div>
  )
}
