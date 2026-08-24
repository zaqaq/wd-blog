import { post } from '@/api/client.ts'
import type {
  AdminNavItem,
  AdminNavListResponse,
  HeaderNav,
  SideBarResponse,
  SiteProfileResponse,
} from '@/types/index.ts'

export function fetchHeaderNav() {
  return post<HeaderNav[]>('/header-nav')
}

export function fetchSideBar() {
  return post<SideBarResponse>('/side-bar')
}

export function updateIntro(intro: string) {
  return post<SiteProfileResponse>('/update-intro', { intro })
}

export function updateNotice(notice: string) {
  return post<SiteProfileResponse>('/update-notice', { notice })
}

export function fetchAdminNavList() {
  return post<AdminNavListResponse>('/nav-admin-list')
}

export function addNav(input: {
  parent_id?: number
  nav_id: number
  title: string
}) {
  return post<AdminNavItem>('/nav-add', input)
}

export function updateNav(
  id: number,
  input: {
    title?: string
    parent_id?: number
    nav_id?: number
  },
) {
  return post<AdminNavItem>('/nav-update', { id, ...input })
}

export function deleteNav(id: number) {
  return post<{ ok: true }>('/nav-delete', { id })
}
