import { HeaderMenu } from '@/components/Header/Menu.tsx'
import { HeaderSearch } from '@/components/Header/Search.tsx'
import { HeaderTitle } from '@/components/Header/Title.tsx'
import { HeaderUserInfo } from '@/components/Header/UserInfo.tsx'

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-[1001] bg-white shadow-[0_1px_3px_rgba(18,18,18,0.1)]">
      <div className="mx-auto flex h-[54px] max-w-[1305px] items-center px-4">
        <HeaderTitle />
        <HeaderMenu />
        <HeaderSearch />
        <HeaderUserInfo />
      </div>
    </header>
  )
}
