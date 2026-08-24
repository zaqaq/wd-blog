import type { ReactNode } from 'react'
import { Bone } from '@/components/Skeleton/Bone.tsx'

function Place({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="invisible" aria-hidden>
        {children}
      </span>
      <Bone className="absolute inset-x-0 top-1/2 h-[0.62em] -translate-y-1/2" />
    </span>
  )
}

const metaItems = [
  { icon: 'icon-riqi', text: '2024-01-01' },
  { icon: 'icon-pinglun', text: '0条评论' },
  { icon: 'icon-yueduliang', text: '0次阅读' },
  { icon: 'icon-dianzan', text: '0人点赞' },
] as const

export function ArticleDetailSkeleton() {
  return (
    <div aria-busy aria-label="加载中">
      <div className="px-[15px] pt-3">
        <span className="inline-flex items-center text-sm text-[#666]">
          <Place>
            <i className="iconfont iconarrow-left mr-1 text-[16px]" />
            返回
          </Place>
        </span>
      </div>

      <div className="px-[15px] pb-[15px]">
        <h1 className="pt-2 text-center text-[30px] font-bold">
          <Place className="w-1/2">标题占位</Place>
        </h1>
        <div className="flex justify-center overflow-hidden border-b border-[#F3F3F3] py-2.5">
          <div className="flex text-[#999]">
            {metaItems.map((item) => (
              <p
                key={item.icon}
                className="relative mr-5 after:absolute after:top-2 after:right-[-10px] after:h-2.5 after:w-px after:bg-[#e6ecf2] after:content-['']"
              >
                <Place>
                  <i className={`iconfont ${item.icon} mr-[3px] align-[-1px]`} />
                  {item.text}
                </Place>
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="min-h-[520px] overflow-hidden pb-[15px]">
        <div className="mb-[15px] ml-[15px] rounded-r-[5px] border-l-8 border-[rgba(102,128,153,0.075)] bg-[rgba(102,128,153,0.05)] p-2.5">
          <Bone className="mb-2 h-[1em] w-full bg-[#dfe6ee]" />
          <Bone className="h-[1em] w-4/5 bg-[#dfe6ee]" />
        </div>
        <div className="space-y-[6px] px-[15px] leading-[1.5]">
          <Bone className="h-[1em] w-full" />
          <Bone className="h-[1em] w-full" />
          <Bone className="h-[1em] w-[92%]" />
          <Bone className="h-[1em] w-full" />
          <Bone className="h-[1em] w-[85%]" />
          <Bone className="h-[1em] w-[90%]" />
          <Bone className="h-[1em] w-3/4" />
          <Bone className="h-[1em] w-full" />
          <Bone className="h-[1em] w-2/3" />
        </div>
      </div>

      <div className="flex min-h-[45px] items-center justify-between overflow-hidden border-t border-[#ccc] px-[15px] py-3">
        <Place>上一篇: 占位文章标题占位</Place>
        <Place className="ml-auto">下一篇: 占位文章标题占位</Place>
      </div>

      <div className="mt-5 flex flex-col items-center border-t border-[#e6ecf2] px-[15px] py-8">
        <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-full">
          <i className="iconfont icon-dianzan invisible text-[20px]" />
          <Bone className="absolute inset-0 rounded-full" />
        </span>
        <p className="mt-3 text-sm text-[#666]">
          <Place>觉得不错就点个赞吧 0 人觉得不错</Place>
        </p>
      </div>
    </div>
  )
}

export function ArticleDetailHydrateFallback() {
  return (
    <div className="overflow-hidden bg-white">
      <ArticleDetailSkeleton />
    </div>
  )
}
