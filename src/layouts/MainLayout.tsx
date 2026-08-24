import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from '@/components/Header/index.tsx'
import { SideBar } from '@/components/SideBar/index.tsx'
import { useScrollRestoration } from '@/hooks/useScrollRestoration.ts'

export function MainLayout() {
  useScrollRestoration()

  return (
    <div className="min-h-svh bg-[#f5f7fa] text-[#333]">
      <Header />
      <div className="mx-auto mt-[54px] flex min-w-[1060px] max-w-[1200px] gap-5 pt-5 pb-[30px]">
        <main className="min-w-0 flex-1">
          <Suspense fallback={<p className="p-8 text-[#999]">加载中…</p>}>
            <Outlet />
          </Suspense>
        </main>
        <SideBar />
      </div>
    </div>
  )
}
