import { memo } from 'react'
import { Link } from 'react-router-dom'
import { ErrorState } from '@/components/ErrorState.tsx'
import { SideWidget } from '@/components/SideBar/SideWidget.tsx'
import { useOpenArticle } from '@/hooks/useOpenArticle.ts'
import { useSideBar } from '@/hooks/useBlogData.ts'
import { paths } from '@/lib/paths.ts'
import type { HotTag, SideBarArticle } from '@/types/index.ts'
import articleThumb from '@/assets/images/article-placeholder.svg'

const rankColors = ['bg-[#fd8c84]', 'bg-[#7fd75a]', 'bg-[#09f]']

function SideBarView() {
  const { data, error, retry } = useSideBar()
  const { open } = useOpenArticle()
  const updateList = data?.updateList ?? []
  const rankList = data?.rankList ?? []
  const hotsTagList = data?.hotsTagList ?? []

  return (
    <aside className="w-[275px] shrink-0">
      <div className="mb-[18px] rounded-[5px] bg-white px-[15px] pb-2.5 shadow-[0_1px_2px_#c5c5c5]">
        <h3 className="inline-block bg-[#09f] px-[15px] py-1 text-sm font-bold text-white">
          博主简介
        </h3>
        <div className="mt-2.5 leading-6">
          <p className="border-b border-dotted border-[#e6ecf2] pb-[5px] text-[#666]">
            一个随"天气"变化而定的前端咸鱼，时倾盆大雨，时晴空万里，飞向远方 ~
          </p>
          <div className="pt-[5px]">
            <span>公告:</span>
            <p className="text-[#666]">
              本博客仅为单页面，暂不支持SEO，后期有时间会陆续实现包括登录系统、管理中台等！
            </p>
          </div>
          <div className="pt-[5px]">
            <span>博客技术实现:</span>
            <ul className="list-disc pl-[30px] text-[#666]">
              <li>
                <p>前端：React.js + Typescript + Tailwind CSS</p>
              </li>
              <li>后台：Node.js(Koa) + Sequelize</li>
              <li>数据库：Mysql</li>
            </ul>
          </div>
        </div>
      </div>

      {error ? (
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
                          {item.publish_date}
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
                  <li
                    key={item.id}
                    className="relative mb-[5px] last:mb-0"
                  >
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
                {hotsTagList.map((item: HotTag) => (
                  <Link
                    key={`${item.nav_id}-${item.tag}`}
                    to={paths.category(item.nav_id)}
                    className="mb-2 mr-0.5 inline-block border border-[#f0f0f0] px-[15px] py-[5px] text-[13px] leading-[19px] text-[#666]"
                  >
                    {item.tag}
                  </Link>
                ))}
              </div>
            </SideWidget>
          )}
        </>
      )}
    </aside>
  )
}

export const SideBar = memo(SideBarView)
