import { Package, Shirt, Smartphone, Sofa, Sparkles, Watch, type LucideIcon } from 'lucide-react'

const icons: Record<string, LucideIcon> = {
  clothing: Shirt,
  beauty: Sparkles,
  electronics: Smartphone,
  'home-living': Sofa,
  accessories: Watch,
}

const tones = [
  'bg-[#fdeadb] text-[#b0662a]',
  'bg-[#dff3ea] text-[#237a5a]',
  'bg-[#dcf0f7] text-[#1b7596]',
  'bg-[#faf0cf] text-[#96700f]',
  'bg-[#f8e3e8] text-[#a1435e]',
]

// Unknown (newly added) categories fall back to a generic icon and a stable tone.
export const categoryIcon = (slug: string): LucideIcon => icons[slug] ?? Package

export const categoryTone = (slug: string): string => {
  const hash = [...slug].reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return tones[hash % tones.length]
}
