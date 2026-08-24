import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { fetchMe } from '@/api/auth.ts'
import { AdminArticlesSkeleton } from '@/components/Skeleton/AdminArticlesSkeleton.tsx'
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
    return (
      <div className="mx-auto box-border flex h-svh max-w-[1200px] flex-col px-4 pt-[78px] pb-6">
        <AdminArticlesSkeleton />
      </div>
    )
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
    return (
      <div className="mx-auto box-border flex h-svh max-w-[1200px] flex-col px-4 pt-[78px] pb-6">
        <AdminArticlesSkeleton />
      </div>
    )
  }

  return <Outlet />
}
