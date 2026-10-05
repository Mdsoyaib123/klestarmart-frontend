import { ChevronDown } from 'lucide-react'
import type { ReactNode } from 'react'

interface Props {
  label: string
  name: string
  value: string
  onChange: (value: string) => void
  children: ReactNode
  disabled?: boolean
  hint?: string
  autoComplete?: string
  className?: string
}

export default function SelectField({ label, name, value, onChange, children, disabled = false, hint, autoComplete, className = '' }: Props) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      <span className="relative block">
        <select
          name={name}
          value={value}
          required
          disabled={disabled}
          autoComplete={autoComplete}
          onChange={(event) => onChange(event.target.value)}
          className={`h-11 w-full appearance-none rounded-xl border border-line bg-white pl-4 pr-10 text-sm outline-none transition focus:border-brand disabled:cursor-not-allowed disabled:bg-cream disabled:text-muted [&_option]:text-ink ${value ? 'text-ink' : 'text-muted'}`}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      </span>
      {hint && <span className="mt-1.5 block text-xs text-muted">{hint}</span>}
    </label>
  )
}
