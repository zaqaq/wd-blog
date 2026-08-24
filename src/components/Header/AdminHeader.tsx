import { Link } from 'react-router-dom'
import { HeaderUserInfo } from '@/components/Header/UserInfo.tsx'
import { HeaderTitle } from '@/components/Header/Title.tsx'
import { paths } from '@/lib/paths.ts'

export function AdminHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-[1001] bg-white">
      <div className="mx-auto flex h-[54px] max-w-[1200px] items-center px-4">
        <HeaderTitle />
        <div className="ml-5 flex items-center gap-3 pl-1">
          <Link
            to={paths.adminArticles}
            className="text-[16px] font-semibold tracking-wide text-[#1f2937]"
          >
            文章管理
          </Link>
        </div>
        <div className="ml-auto">
          <HeaderUserInfo />
        </div>
      </div>
    </header>
  )
}
