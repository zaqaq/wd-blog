import { Bone } from '@/components/Skeleton/Bone.tsx'

function ArticleCardSkeleton() {
  return (
    <div className="mb-2.5 bg-white p-5">
      <div className="flex">
        <Bone className="mr-[30px] h-[155px] w-[230px] shrink-0 rounded-none" />
        <div className="min-w-0 flex-1">
          <div className="mb-[15px] flex items-center gap-2.5">
            <Bone className="h-5 w-12 rounded-sm" />
            <Bone className="h-5 w-3/5" />
          </div>
          <div className="mb-2.5 space-y-2">
            <Bone className="h-4 w-full" />
            <Bone className="h-4 w-full" />
            <Bone className="h-4 w-4/5" />
            <Bone className="h-4 w-2/3" />
          </div>
          <div className="mt-4 flex gap-5">
            <Bone className="h-3 w-20" />
            <Bone className="h-3 w-16" />
            <Bone className="h-3 w-16" />
            <Bone className="h-3 w-16" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function ArticleListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="border-b border-[#f5f7fa]" aria-busy aria-label="加载中">
      {Array.from({ length: count }, (_, index) => (
        <ArticleCardSkeleton key={index} />
      ))}
    </div>
  )
}
