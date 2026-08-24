import type { HeaderNav } from '@/types/index.ts'

export function navLeaves(navList: HeaderNav[]) {
  return navList.flatMap((item) =>
    item.sub_title.length > 0 ? item.sub_title : [item],
  )
}

export function findNavTitle(navList: HeaderNav[], navId: number) {
  return (
    navLeaves(navList).find((item) => item.nav_id === navId)?.title ??
    String(navId)
  )
}
