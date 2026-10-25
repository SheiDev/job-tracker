export const STAGES = [
  'To contact',
  'Contact started',
  'Interviews',
  'Test',
  'References',
  'Waiting for decision',
] as const

export const OUTCOMES = ['Offer', 'Rejected', 'Withdrawn'] as const

export const ACTIVITY_TYPES = ['Email', 'Call', 'Interview', 'Test', 'Other'] as const

export type Stage = (typeof STAGES)[number]
export type Outcome = (typeof OUTCOMES)[number]
export type ActivityType = (typeof ACTIVITY_TYPES)[number]

export function isDateOnly(value: unknown): boolean {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  )
}

export function isHttpUrl(value: unknown): boolean {
  if (typeof value !== 'string' || value === '') return false
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}
