import { Star } from 'lucide-react'

export default function Rating({ value, count }: { value: number; count?: number }) {
  return (
    <div className="flex items-center gap-1.5 text-sm" aria-label={`Rated ${value} out of 5`}>
      <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
      <span className="font-medium">{value.toFixed(1)}</span>
      {count !== undefined && <span className="text-muted">({count})</span>}
    </div>
  )
}
