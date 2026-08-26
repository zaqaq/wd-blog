export function splitTableActions<T>(items: readonly T[], maxInline = 3) {
  if (items.length <= maxInline) {
    return { inline: [...items], rest: [] as T[] }
  }
  const keep = Math.max(maxInline - 1, 1)
  return {
    inline: items.slice(0, keep),
    rest: items.slice(keep),
  }
}
