import { useNavigate } from 'react-router-dom'
import { HeaderMenuSkeleton } from '@/components/Skeleton/HeaderSkeleton.tsx'
import { useHeaderNav } from '@/hooks/useBlogData.ts'
import { paths } from '@/lib/paths.ts'
import type { HeaderNav, NavItem } from '@/types/index.ts'

const fNavIcon: Record<number, string> = {
  0: 'iconqianduan',
  1: 'icongongcheng',
  2: 'icon8_4houduankaifa',
  3: 'iconicon-06',
  4: 'iconganwu',
  5: 'iconsend1179291easyiconnet',
}

const sNavIcon: Record<number, Record<number, string>> = {
  101: {
    0: 'iconhtmlcss',
    1: 'iconjava-script',
    2: 'iconhtml5',
    3: 'iconreact',
    4: 'iconreact-native-2',
    5: 'iconvue',
  },
  102: {
    0: 'icongit1',
  },
  103: {
    0: 'iconnode',
  },
}

export function HeaderMenu() {
  const navigate = useNavigate()
  const { data, loading } = useHeaderNav()
  const navList = data ?? []

  const toCategory = (navId: number) => {
    navigate(paths.category(navId))
  }

  if (loading) {
    return <HeaderMenuSkeleton />
  }

  return (
    <ul className="ml-[25px] flex shrink-0">
      <li
        className="relative cursor-pointer overflow-hidden hover:overflow-visible"
        onClick={() => navigate(paths.home)}
      >
        <span className="flex items-center px-2.5 py-[15px] text-[15px] hover:text-[#09f]">
          <i className="iconfont iconshouye mr-[3px]" />
          首页
        </span>
      </li>
      {navList.map((item: HeaderNav, fIndex: number) => {
        const hasChildren = (item.sub_title?.length ?? 0) > 0
        return (
          <li
            key={item.nav_id}
            className="group relative cursor-pointer overflow-hidden hover:overflow-visible"
          >
            <span
              className="flex items-center px-2.5 py-[15px] text-[15px] hover:text-[#09f]"
              onClick={() => {
                if (!hasChildren) {
                  toCategory(item.nav_id)
                }
              }}
            >
              <i className={`iconfont ${fNavIcon[fIndex]} mr-[3px]`} />
              {item.title}
              {hasChildren && (
                <i className="iconfont icon-jiantouxia ml-[3px] transition duration-200 ease-in group-hover:origin-[50%_57%] group-hover:rotate-180" />
              )}
            </span>
            {hasChildren && (
              <ul className="invisible absolute top-[65px] left-1/2 z-[999] min-w-full -translate-x-1/2 rounded-[3px] border-t-[3px] border-[#09f] bg-white pb-[3px] opacity-0 shadow-[0_0_10px_rgba(0,0,0,0.2)] transition duration-200 ease-in before:absolute before:top-[-19px] before:left-1/2 before:h-0 before:w-0 before:-translate-x-1/2 before:border-8 before:border-transparent before:border-b-[#09f] before:content-[''] group-hover:visible group-hover:top-[51px] group-hover:opacity-100">
                {item.sub_title.map((sub: NavItem, sIndex: number) => (
                  <li
                    key={sub.nav_id}
                    className="hover:bg-[rgba(0,153,255,0.07)] hover:text-[#f60]"
                  >
                    <span
                      className="flex cursor-pointer px-2.5 py-[7px]"
                      onClick={() => toCategory(sub.nav_id)}
                    >
                      <i
                        className={`iconfont mt-[-1px] mr-[3px] ${sNavIcon[item.nav_id]?.[sIndex] ?? ''}`}
                      />
                      {sub.title}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </li>
        )
      })}
    </ul>
  )
}
