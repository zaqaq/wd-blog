import { post } from '@/api/client.ts'
import type { AdminTag, AdminTagListResponse } from '@/types/index.ts'

export function fetchAdminTagList() {
  return post<AdminTagListResponse>('/tag-admin-list')
}

export function addTag(name: string) {
  return post<AdminTag>('/tag-add', { name })
}

export function updateTag(id: number, name: string) {
  return post<AdminTag>('/tag-update', { id, name })
}

export function deleteTag(id: number) {
  return post<{ ok: true }>('/tag-delete', { id })
}
