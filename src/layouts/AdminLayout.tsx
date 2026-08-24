import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { AdminHeader } from '@/components/Header/AdminHeader.tsx'
import { AdminArticlesSkeleton } from '@/components/Skeleton/AdminArticlesSkeleton.tsx'

export function AdminLayout() {
  return (
    <div className="h-svh overflow-hidden bg-[#eef1f6] text-[#333]">
      <AdminHeader />
      <div className="mx-auto box-border flex h-full max-w-[1200px] flex-col px-4 pt-[78px] pb-6">
        <Suspense fallback={<AdminArticlesSkeleton />}>
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
            <Outlet />
          </div>
        </Suspense>
      </div>
    </div>
  )
}
