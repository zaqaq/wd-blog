import { useEffect, useState } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AdminUser } from '@/types/index.ts'

type AuthState = {
  token: string | null
  user: AdminUser | null
  setSession: (token: string, user: AdminUser) => void
  hydrateFromMe: (user: AdminUser) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setSession: (token, user) => set({ token, user }),
      hydrateFromMe: (user) => set({ user }),
      logout: () => set({ token: null, user: null }),
    }),
    { name: 'wd-blog-auth' },
  ),
)

export function useAuthHydrated() {
  const [hydrated, setHydrated] = useState(() =>
    useAuthStore.persist.hasHydrated(),
  )

  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) {
      setHydrated(true)
    }
    return useAuthStore.persist.onFinishHydration(() => setHydrated(true))
  }, [])

  return hydrated
}
