export const PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50, 100] as const
export const DEFAULT_PAGE_SIZE = 20

export function parsePageSize(value: string | null | undefined) {
  const parsed = Number(value)
  return (PAGE_SIZE_OPTIONS as readonly number[]).includes(parsed)
    ? parsed
    : DEFAULT_PAGE_SIZE
}
