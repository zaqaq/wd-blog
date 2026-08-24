import { memo } from 'react'
import { Link } from 'react-router-dom'
import { ErrorState } from '@/components/ErrorState.tsx'
import { BlogIntroCard } from '@/components/SideBar/BlogIntroCard.tsx'
import { SideWidget } from '@/components/SideBar/SideWidget.tsx'
import { SideBarSkeleton } from '@/components/Skeleton/SideBarSkeleton.tsx'
import { useOpenArticle } from '@/hooks/useOpenArticle.ts'
import { useSideBar } from '@/hooks/useBlogData.ts'
import { formatDate } from '@/lib/datetime.ts'
import { paths } from '@/lib/paths.ts'
import type { HotTag, SideBarArticle } from '@/types/index.ts'
import articleThumb from '@/assets/images/article-placeholder.svg'

const rankColors = ['bg-[#fd8c84]', 'bg-[#7fd75a]', 'bg-[#09f]']

const tagPalettes = [
  { border: '#fecaca', bg: '#fef2f2', text: '#dc2626' },
  { border: '#fed7aa', bg: '#fff7ed', text: '#d97706' },
  { border: '#fde68a', bg: '#fefce8', text: '#b45309' },
  { border: '#bbf7d0', bg: '#f0fdf4', text: '#15803d' },
  { border: '#bfdbfe', bg: '#eff6ff', text: '#1d4ed8' },
] as const

function SideBarView() {
  const { data, loading, error, retry } = useSideBar()
  const { open } = useOpenArticle()
  const updateList = data?.updateList ?? []
  const rankList = data?.rankList ?? []
  const hotsTagList = data?.hotsTagList ?? []

  return (
    <aside className="w-[275px] shrink-0">
      {!loading && !error && data && (
        <BlogIntroCard intro={data.intro} notice={data.notice} />
      )}

      {loading ? (
        <SideBarSkeleton />
      ) : error ? (
        <ErrorState message={error} onRetry={retry} />
      ) : (
        <>
          {updateList.length > 0 && (
            <SideWidget
              icon="iconzuijingengxin_huaban"
              iconClass="text-[#4dd820]"
              title="最近更新"
            >
              <ul className="px-[15px] py-2">
                {updateList.map((item: SideBarArticle) => (
                  <li
                    key={item.id}
                    className="flex border-b border-solid border-[#eee] py-[5px] first:pt-0 last:border-b-0 last:pb-0"
                  >
                    <span
                      className="block h-[75px] w-[75px] shrink-0 cursor-pointer overflow-hidden bg-[#eef1f6]"
                      onClick={() => open(item.id)}
                    >
                      <img
                        src={articleThumb}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </span>
                    <div className="ml-2.5 min-w-0 flex-1">
                      <span
                        className="mb-[5px] line-clamp-2 cursor-pointer overflow-hidden text-ellipsis text-[#666] hover:text-[#f90]"
                        onClick={() => open(item.id)}
                      >
                        {item.title}
                      </span>
                      <div className="flex">
                        <p className="relative mr-5 flex text-xs text-[#666] after:absolute after:top-[5px] after:right-[-10px] after:h-2.5 after:w-px after:bg-[#e6ecf2] after:content-['']">
                          {item.publish_date
                            ? formatDate(item.publish_date)
                            : ''}
                        </p>
                        <p className="flex text-xs text-[#666]">
                          <i className="iconfont icon-yueduliang mt-[-3px] mr-[3px]" />
                          {item.read_count}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </SideWidget>
          )}

          {rankList.length > 0 && (
            <SideWidget
              icon="iconpaihang"
              iconClass="text-[#ffa500]"
              title="点击排行"
            >
              <ul className="px-[15px] py-2">
                {rankList.map((item: SideBarArticle, index: number) => (
                  <li key={item.id} className="relative mb-[5px] last:mb-0">
                    <span
                      className={`absolute top-1.5 left-0 h-5 w-5 rounded-[3px] text-center text-[13px] leading-[18px] text-white italic ${rankColors[index] ?? 'bg-[#ccc]'}`}
                    >
                      {index + 1}
                    </span>
                    <p
                      className="h-[30px] cursor-pointer truncate pl-[25px] leading-[30px] text-[#666] hover:text-[#f90]"
                      onClick={() => open(item.id)}
                    >
                      {item.title}
                    </p>
                  </li>
                ))}
              </ul>
            </SideWidget>
          )}

          {hotsTagList.length > 0 && (
            <SideWidget
              icon="iconlabeltag"
              iconClass="text-[#f92e2e]"
              title="热门标签"
            >
              <div className="px-[15px] pt-2">
                {hotsTagList.map((item: HotTag, index: number) => {
                  const palette = tagPalettes[index % tagPalettes.length]
                  return (
                    <Link
                      key={`${item.nav_id}-${item.tag}`}
                      to={paths.category(item.nav_id)}
                      style={{
                        borderColor: palette.border,
                        backgroundColor: palette.bg,
                        color: palette.text,
                      }}
                      className="mb-2 mr-0.5 inline-block border px-[15px] py-[5px] text-[13px] leading-[19px] transition hover:opacity-80"
                    >
                      {item.tag}
                    </Link>
                  )
                })}
              </div>
            </SideWidget>
          )}
        </>
      )}
    </aside>
  )
}

export const SideBar = memo(SideBarView)
