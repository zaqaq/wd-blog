import { post } from '@/api/client.ts'
import type { HeaderNav, SideBarResponse } from '@/types/index.ts'

export function fetchHeaderNav() {
  return post<HeaderNav[]>('/header-nav')
}

export function fetchSideBar() {
  return post<SideBarResponse>('/side-bar')
}
