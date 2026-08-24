import type { ReactNode } from 'react'
import { Bone } from '@/components/Skeleton/Bone.tsx'

function WidgetSkeleton({
  titleWidth,
  children,
}: {
  titleWidth: string
  children: ReactNode
}) {
  return (
    <div className="mb-[18px] rounded-[5px] bg-white shadow-[0_1px_2px_#c5c5c5]">
      <div className="relative border-b border-[#f1f1ef] px-[15px] py-2.5 after:absolute after:bottom-[-1px] after:left-0 after:h-0.5 after:w-[108px] after:bg-[#09f] after:content-['']">
        <Bone className={`h-5 ${titleWidth}`} />
      </div>
      {children}
    </div>
  )
}

export function SideBarSkeleton() {
  return (
    <div aria-busy aria-label="侧栏加载中">
      <div className="mb-[18px] rounded-[5px] bg-white px-[15px] pb-2.5 shadow-[0_1px_2px_#c5c5c5]">
        <Bone className="h-7 w-20 rounded-none" />
        <div className="mt-2.5 space-y-2">
          <Bone className="h-3.5 w-full" />
          <Bone className="h-3.5 w-5/6" />
          <Bone className="mt-2 h-3.5 w-12" />
          <Bone className="h-3.5 w-full" />
          <Bone className="h-3.5 w-4/5" />
        </div>
      </div>

      <WidgetSkeleton titleWidth="w-20">
        <ul className="space-y-2 px-[15px] py-2">
          {Array.from({ length: 3 }, (_, index) => (
            <li key={index} className="flex border-b border-[#eee] py-[5px] last:border-b-0">
              <Bone className="h-[75px] w-[75px] shrink-0 rounded-none" />
              <div className="ml-2.5 min-w-0 flex-1 space-y-2 pt-1">
                <Bone className="h-3.5 w-full" />
                <Bone className="h-3.5 w-4/5" />
                <div className="flex gap-4 pt-1">
                  <Bone className="h-3 w-14" />
                  <Bone className="h-3 w-10" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </WidgetSkeleton>

      <WidgetSkeleton titleWidth="w-20">
        <ul className="space-y-1 px-[15px] py-2">
          {Array.from({ length: 5 }, (_, index) => (
            <li key={index} className="flex h-[30px] items-center gap-2">
              <Bone className="h-5 w-5 rounded-[3px]" />
              <Bone className="h-3.5 flex-1" />
            </li>
          ))}
        </ul>
      </WidgetSkeleton>

      <WidgetSkeleton titleWidth="w-20">
        <div className="flex flex-wrap gap-2 px-[15px] py-3">
          {Array.from({ length: 6 }, (_, index) => (
            <Bone key={index} className="h-8 w-16" />
          ))}
        </div>
      </WidgetSkeleton>
    </div>
  )
}
