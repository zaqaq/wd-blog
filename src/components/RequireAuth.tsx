import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { fetchMe } from '@/api/auth.ts'
import { paths } from '@/lib/paths.ts'
import { useAuthHydrated, useAuthStore } from '@/stores/authStore.ts'

export function RequireAuth() {
  const location = useLocation()
  const hydrated = useAuthHydrated()
  const token = useAuthStore((state) => state.token)
  const hydrateFromMe = useAuthStore((state) => state.hydrateFromMe)
  const logout = useAuthStore((state) => state.logout)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!hydrated || !token) {
      setReady(false)
      return
    }

    let cancelled = false
    setReady(false)
    void fetchMe()
      .then((user) => {
        if (!cancelled) {
          hydrateFromMe(user)
          setReady(true)
        }
      })
      .catch(() => {
        if (!cancelled) {
          logout()
        }
      })

    return () => {
      cancelled = true
    }
  }, [hydrated, hydrateFromMe, logout, token])

  if (!hydrated) {
    return <p className="p-8 text-[#999]">加载中…</p>
  }

  if (!token) {
    return (
      <Navigate
        to={paths.adminLogin}
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    )
  }

  if (!ready) {
    return <p className="p-8 text-[#999]">加载中…</p>
  }

  return <Outlet />
}
