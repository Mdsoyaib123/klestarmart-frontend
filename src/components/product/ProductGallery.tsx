import { ZoomIn } from 'lucide-react'
import { useState, type PointerEvent } from 'react'
import ProductImage from '@/components/product/ProductImage'

interface Props {
  name: string
  category: string
  images?: string[]
  badge?: string
}

export default function ProductGallery({ name, category, images, badge }: Props) {
  const [active, setActive] = useState(0)
  const [zoomed, setZoomed] = useState(false)
  const [touchZoom, setTouchZoom] = useState(false)
  const [origin, setOrigin] = useState({ x: 50, y: 50 })
  const list: (string | undefined)[] = images?.length ? images : [undefined]
  const current = Math.min(active, list.length - 1)
  const currentImage = list[current]

  const updateOrigin = (event: PointerEvent<HTMLButtonElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - bounds.left) / bounds.width) * 100
    const y = ((event.clientY - bounds.top) / bounds.height) * 100
    setOrigin({ x, y })
  }

  return (
    <div className={`relative space-y-3 md:sticky md:top-40 md:self-start ${zoomed && !touchZoom ? 'md:z-30' : ''}`}>
      <div className="relative">
        {currentImage ? (
          <button
            type="button"
            onPointerEnter={(event) => {
              if (event.pointerType === 'mouse') {
                setTouchZoom(false)
                setZoomed(true)
                updateOrigin(event)
              }
            }}
            onPointerMove={(event) => {
              if (event.pointerType === 'mouse') {
                updateOrigin(event)
                setZoomed(true)
              }
            }}
            onPointerLeave={(event) => {
              if (event.pointerType === 'mouse') {
                setZoomed(false)
                setTouchZoom(false)
              }
            }}
            onPointerUp={(event) => {
              if (event.pointerType === 'touch') {
                setTouchZoom((value) => !value)
                setZoomed((value) => !value)
              }
            }}
            onFocus={() => {
              setTouchZoom(false)
              setZoomed(true)
            }}
            onBlur={() => setZoomed(false)}
            aria-label={`Hover over ${name} to see a magnified view; tap to zoom on touch screens`}
            className={`relative block aspect-[4/5] w-full overflow-hidden rounded-3xl bg-white ${zoomed ? 'cursor-crosshair' : 'cursor-zoom-in'}`}
          >
            <img
              src={currentImage}
              alt={name}
              draggable={false}
              className="h-full w-full select-none object-contain transition-transform duration-300 ease-out"
              style={{
                transform: touchZoom ? 'scale(1.8)' : 'scale(1)',
                transformOrigin: `${origin.x}% ${origin.y}%`,
              }}
            />
            {zoomed && !touchZoom && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute h-1/2 w-1/2 border border-white/90 bg-white/20 shadow-[0_0_0_9999px_rgba(14,26,58,0.08),0_2px_12px_rgba(14,26,58,0.14)] backdrop-blur-[1px] transition-[left,top] duration-75 ease-out"
                style={{
                  left: `${Math.max(0, Math.min(50, origin.x - 25))}%`,
                  top: `${Math.max(0, Math.min(50, origin.y - 25))}%`,
                }}
              >
                <span className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white bg-brand/70 shadow-sm" />
              </span>
            )}
            <span className="pointer-events-none absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-3.5 py-2 text-xs font-medium text-ink shadow-sm">
              <ZoomIn className="h-3.5 w-3.5" /> {touchZoom ? 'Tap to zoom out' : 'Hover to zoom'}
            </span>
          </button>
        ) : (
          <ProductImage name={name} category={category} className="aspect-[4/5] rounded-3xl" />
        )}
        {badge && <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">{badge}</span>}

        {currentImage && zoomed && !touchZoom && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-full top-0 z-30 ml-4 hidden aspect-[4/5] w-full animate-magnifier-in overflow-hidden rounded-3xl border border-white bg-white shadow-2xl ring-1 ring-ink/5 md:block"
            style={{
              backgroundImage: `url("${currentImage}")`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: '200% 200%',
              backgroundPosition: `${Math.max(0, Math.min(100, origin.x * 2 - 50))}% ${Math.max(0, Math.min(100, origin.y * 2 - 50))}%`,
            }}
          >
            <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-ink shadow-sm backdrop-blur">
              <ZoomIn className="h-3.5 w-3.5 text-brand" /> Detail view
            </span>
            <span className="absolute right-4 top-4 rounded-full bg-brand px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm">
              2&times;
            </span>
            <span className="absolute bottom-4 right-4 rounded-full bg-ink/75 px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur">
              Move pointer to explore
            </span>
          </div>
        )}
      </div>

      {list.length > 1 && (
        <div className="grid grid-cols-5 gap-3">
          {list.map((src, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Show image ${index + 1}`}
              aria-current={index === current}
              onClick={() => setActive(index)}
              className={`overflow-hidden rounded-xl border-2 transition ${index === current ? 'border-brand' : 'border-transparent opacity-70 hover:opacity-100'}`}
            >
              <ProductImage name={name} category={category} imageUrl={src} className="aspect-square" />
            </button>
          ))}
        </div>
      )}

    </div>
  )
}
