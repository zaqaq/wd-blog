export function toggleSelectedValues<T extends string | number>(
  current: readonly T[],
  next: T,
  max?: number,
) {
  const key = String(next)
  if (current.some((item) => String(item) === key)) {
    return current.filter((item) => String(item) !== key)
  }
  if (max != null && current.length >= max) {
    return [...current]
  }
  return [...current, next]
}

export function isSelectedValue<T extends string | number>(
  selected: T | readonly T[],
  option: T,
) {
  if (Array.isArray(selected)) {
    return selected.some((item) => String(item) === String(option))
  }
  return String(selected) === String(option)
}

export function visibleTagSlice<T>(
  values: readonly T[],
  maxTagCount?: number,
) {
  if (maxTagCount == null || maxTagCount < 0 || values.length <= maxTagCount) {
    return { visible: [...values], overflow: 0, rest: [] as T[] }
  }
  return {
    visible: values.slice(0, maxTagCount),
    overflow: values.length - maxTagCount,
    rest: values.slice(maxTagCount),
  }
}
