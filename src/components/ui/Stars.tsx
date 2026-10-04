import { Star } from 'lucide-react'

export default function Stars({ value, size = 'h-4 w-4' }: { value: number; size?: string }) {
  return (
    <span className="inline-flex" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((position) => {
        const fill = Math.max(0, Math.min(1, value - (position - 1)))
        return (
          <span key={position} className="relative inline-block">
            <Star className={`${size} fill-sand text-sand`} />
            <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star className={`${size} max-w-none fill-amber-500 text-amber-500`} />
            </span>
          </span>
        )
      })}
    </span>
  )
}
