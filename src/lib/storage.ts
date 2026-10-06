// Reads a JSON array from localStorage, ignoring missing, corrupt or wrongly shaped values.
export const loadArray = <T,>(key: string, isItem: (value: unknown) => value is T): T[] => {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(key) ?? '[]')
    return Array.isArray(parsed) ? parsed.filter(isItem) : []
  } catch {
    return []
  }
}

export const isString = (value: unknown): value is string => typeof value === 'string'

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null
