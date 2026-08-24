import { useNavigate } from 'react-router-dom'
import { logout as logoutRequest } from '@/api/auth.ts'
import visitor from '@/assets/images/visitor.png'
import { HeaderUserSkeleton } from '@/components/Skeleton/HeaderSkeleton.tsx'
import { paths } from '@/lib/paths.ts'
import { useAuthHydrated, useAuthStore } from '@/stores/authStore.ts'

export function HeaderUserInfo() {
  const navigate = useNavigate()
  const hydrated = useAuthHydrated()
  const user = useAuthStore((state) => state.user)
  const token = useAuthStore((state) => state.token)
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = async () => {
    try {
      await logoutRequest()
    } catch {
      // JWT 无状态，本地清掉即可
    }
    logout()
    void navigate(paths.home)
  }

  if (!hydrated) {
    return <HeaderUserSkeleton />
  }

  if (!token || !user) {
    return (
      <div className="ml-[30px] flex w-[160px] shrink-0 items-center">
        <p className="text-[17px] font-medium leading-[30px]">喵，欢迎来访</p>
        <img
          src={visitor}
          alt=""
          width={30}
          height={30}
          className="ml-2.5 rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="ml-[20px] flex shrink-0 items-center gap-3 text-[15px]">
      <p className="max-w-[88px] truncate font-medium" title={user.username}>
        {user.username}
      </p>
      <button
        type="button"
        className="cursor-pointer text-[#888] hover:text-[#333]"
        onClick={() => void handleLogout()}
      >
        退出
      </button>
      <img
        src={visitor}
        alt=""
        width={30}
        height={30}
        className="rounded-full"
      />
    </div>
  )
}
