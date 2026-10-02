import { useState } from 'react'
import { SITE_NAME } from '@/config/site'

// Expects the 2066x761 logo (white on brand blue) at public/logo.png; cropped to the wordmark and URL line.
export default function Logo({ className = 'h-11' }: { className?: string }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return <span className="font-display text-xl font-semibold text-brand">{SITE_NAME}</span>
  }

  return (
    <span className={`relative block aspect-[341/100] overflow-hidden rounded-lg bg-brand ${className}`}>
      <img
        src="/logo.png"
        alt={SITE_NAME}
        onError={() => setFailed(true)}
        className="absolute max-w-none"
        style={{ width: '137.7%', left: '-19%', top: '-28.4%' }}
      />
    </span>
  )
}
