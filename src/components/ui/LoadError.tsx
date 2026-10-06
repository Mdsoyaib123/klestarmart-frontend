export default function LoadError({ onRetry }: { onRetry: () => void }) {
  return (
    <div role="alert" className="rounded-2xl border border-dashed border-line py-16 text-center">
      <p className="font-display text-xl font-semibold">We could not load this right now</p>
      <p className="mt-2 text-sm text-muted">Please check your connection and try again.</p>
      <button type="button" onClick={onRetry} className="mt-5 rounded-full bg-brand px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-dark">
        Try again
      </button>
    </div>
  )
}
