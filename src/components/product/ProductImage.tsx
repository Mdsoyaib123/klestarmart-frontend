import { createElement, useState } from 'react'
import { categoryIcon, categoryTone } from '@/lib/category'

interface Props {
  name: string
  category: string
  imageUrl?: string
  className?: string
}

// Shows the product photo when available, otherwise a tinted placeholder keyed to the category.
export default function ProductImage({ name, category, imageUrl, className = '' }: Props) {
  const [failed, setFailed] = useState(false)

  return (
    <div className={`relative overflow-hidden ${categoryTone(category)} ${className}`}>
      {imageUrl && !failed ? (
        <img src={imageUrl} alt={name} loading="lazy" onError={() => setFailed(true)} className="h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 grid place-items-center" role="img" aria-label={name}>
          <span className="grid h-24 w-24 place-items-center rounded-full bg-white/55">
            {createElement(categoryIcon(category), { className: 'h-10 w-10', strokeWidth: 1.3 })}
          </span>
        </div>
      )}
    </div>
  )
}
