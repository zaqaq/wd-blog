import { get, post } from '@/api/client.ts'
import type { AdminUser, LoginResponse } from '@/types/index.ts'

export function login(username: string, password: string) {
  return post<LoginResponse>('/auth/login', { username, password })
}

export function logout() {
  return post<{ ok: true }>('/auth/logout')
}

export function fetchMe() {
  return get<AdminUser>('/auth/me')
}
