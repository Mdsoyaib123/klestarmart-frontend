import { useState } from 'react'
import { useSiteSettings } from '@/features/settings/settingsApi'

// Shows the logo uploaded in the dashboard; until one is set, the bundled public/logo.png
// (2066x761, white on brand blue) cropped to the wordmark; and the site name if neither loads.
export default function Logo({ className = 'h-11' }: { className?: string }) {
  const { siteName, logoUrl } = useSiteSettings()
  const [failed, setFailed] = useState<string | null>(null)
  const src = logoUrl || '/logo.png'

  if (failed === src) {
    return <span className="font-display text-xl font-semibold text-brand">{siteName}</span>
  }

  if (logoUrl) {
    return <img src={logoUrl} alt={siteName} onError={() => setFailed(src)} className={`w-auto object-contain ${className}`} />
  }

  return (
    <span className={`relative block aspect-[341/100] overflow-hidden rounded-lg bg-brand ${className}`}>
      <img
        src="/logo.png"
        alt={siteName}
        onError={() => setFailed(src)}
        className="absolute max-w-none"
        style={{ width: '137.7%', left: '-19%', top: '-28.4%' }}
      />
    </span>
  )
}
