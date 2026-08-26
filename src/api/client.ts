import axios, { isAxiosError, type AxiosResponse } from 'axios'
import { unwrapApiBody } from '@/lib/apiEnvelope.ts'
import { paths } from '@/lib/paths.ts'
import { useAuthStore } from '@/stores/authStore.ts'

const http = axios.create({
  baseURL: '/api',
  timeout: 60000,
  withCredentials: true,
})

http.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

http.interceptors.response.use(
  (response: AxiosResponse) => unwrapApiBody(response.data),
  (error: unknown) => {
    if (isAxiosError(error) && error.response?.status === 401) {
      const requestUrl = error.config?.url ?? ''
      if (!requestUrl.includes('/auth/login')) {
        useAuthStore.getState().logout()
        if (!window.location.pathname.startsWith(paths.adminLogin)) {
          const from = `${window.location.pathname}${window.location.search}`
          const loginUrl = `${paths.adminLogin}?from=${encodeURIComponent(from)}`
          window.location.assign(loginUrl)
        }
      }
    }
    return Promise.reject(error)
  },
)

export function get<T>(url: string): Promise<T> {
  return http.get(url) as Promise<T>
}

export function post<T>(url: string, data?: unknown): Promise<T> {
  return http.post(url, data) as Promise<T>
}

export function postForm<T>(url: string, data: FormData): Promise<T> {
  return http.post(url, data) as Promise<T>
}
