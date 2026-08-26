import type { AdminNavItem } from '@/types/index.ts'

export type NavFormState = {
  title: string
  parent_id: string
}

export function buildTreeRows(navList: AdminNavItem[]) {
  const tops = navList.filter((item) => item.parent_id === 0)
  const childrenByParent = new Map<number, AdminNavItem[]>()
  for (const item of navList) {
    if (item.parent_id === 0) {
      continue
    }
    const list = childrenByParent.get(item.parent_id) ?? []
    list.push(item)
    childrenByParent.set(item.parent_id, list)
  }

  const rows: Array<AdminNavItem & { depth: number }> = []
  for (const top of tops) {
    rows.push({ ...top, depth: 0 })
    for (const child of childrenByParent.get(top.nav_id) ?? []) {
      rows.push({ ...child, depth: 1 })
    }
  }

  const shown = new Set(rows.map((item) => item.id))
  for (const item of navList) {
    if (!shown.has(item.id)) {
      rows.push({ ...item, depth: item.parent_id === 0 ? 0 : 1 })
    }
  }
  return rows
}

export function nextNavId(navList: AdminNavItem[]) {
  if (navList.length === 0) {
    return 101
  }
  return Math.max(...navList.map((item) => item.nav_id)) + 1
}

export function validateNavForm(
  values: NavFormState,
  topNavs: AdminNavItem[],
  excludeId?: number,
) {
  const title = values.title.trim()
  const parentId = Number(values.parent_id)

  if (!title || title.length > 255) {
    return '标题长度为 1～255 字'
  }
  if (!Number.isInteger(parentId) || parentId < 0) {
    return '父级不合法'
  }
  if (
    parentId !== 0 &&
    !topNavs.some((item) => item.nav_id === parentId && item.id !== excludeId)
  ) {
    return '父级须为已有顶级导航'
  }
  return null
}
