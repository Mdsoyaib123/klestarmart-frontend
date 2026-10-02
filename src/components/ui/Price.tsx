import { formatPrice } from '@/lib/format'

interface Props {
  price: number
  compareAt?: number
  large?: boolean
}

export default function Price({ price, compareAt, large = false }: Props) {
  return (
    <div className="flex items-baseline gap-2">
      <span className={`font-semibold ${large ? 'text-2xl' : 'text-base'}`}>{formatPrice(price)}</span>
      {compareAt && <span className={`text-muted line-through ${large ? 'text-base' : 'text-sm'}`}>{formatPrice(compareAt)}</span>}
    </div>
  )
}
