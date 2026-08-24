import { NavLink } from 'react-router-dom'
import { HeaderUserInfo } from '@/components/Header/UserInfo.tsx'
import { HeaderTitle } from '@/components/Header/Title.tsx'
import { paths } from '@/lib/paths.ts'

const navClass = ({ isActive }: { isActive: boolean }) =>
  `text-[16px] font-semibold tracking-wide transition ${
    isActive ? 'text-[#09f]' : 'text-[#1f2937] hover:text-[#09f]'
  }`

export function AdminHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-[1001] bg-white">
      <div className="mx-auto flex h-[54px] max-w-[1200px] items-center px-4">
        <HeaderTitle />
        <div className="ml-5 flex items-center gap-4 pl-1">
          <NavLink to={paths.adminArticles} className={navClass}>
            文章管理
          </NavLink>
          <NavLink to={paths.adminNav} className={navClass}>
            导航管理
          </NavLink>
          <NavLink to={paths.adminSiteSettings} className={navClass}>
            站点设置
          </NavLink>
        </div>
        <div className="ml-auto">
          <HeaderUserInfo />
        </div>
      </div>
    </header>
  )
}
