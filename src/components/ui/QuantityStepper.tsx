import { Minus, Plus } from 'lucide-react'

interface Props {
  value: number
  max: number
  onChange: (value: number) => void
  compact?: boolean
}

export default function QuantityStepper({ value, max, onChange, compact = false }: Props) {
  const size = compact ? 'h-8 w-8' : 'h-11 w-11'
  const button = `grid ${size} place-items-center text-muted transition hover:text-ink disabled:cursor-not-allowed disabled:opacity-40`

  return (
    <div className="inline-flex items-center rounded-full border border-line bg-white">
      <button type="button" aria-label="Decrease quantity" className={button} disabled={value <= 1} onClick={() => onChange(value - 1)}>
        <Minus className="h-4 w-4" />
      </button>
      <span className={`min-w-8 text-center text-sm font-medium tabular-nums ${compact ? '' : 'min-w-10'}`}>{value}</span>
      <button type="button" aria-label="Increase quantity" className={button} disabled={value >= max} onClick={() => onChange(value + 1)}>
        <Plus className="h-4 w-4" />
      </button>
    </div>
  )
}
