export function parsePositiveInt(value: string | undefined, fallback = 1) {
  if (value == null || value === '') {
    return fallback
  }
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}

export function isPositiveIntString(value: string | undefined) {
  return value != null && /^\d+$/.test(value) && Number(value) > 0
}
