import { Bone } from '@/components/Skeleton/Bone.tsx'

export function AdminArticlesSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <section
      className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg bg-white shadow-[0_1px_3px_rgba(16,24,40,0.06)]"
      aria-busy
      aria-label="加载中"
    >
      <div className="shrink-0 bg-[#f7f9fc]">
        <div className="flex w-full items-center px-5 py-3.5 text-sm text-[#667085]">
          <span className="flex-1 font-medium">标题</span>
          <span className="w-28 px-3 font-medium">分类</span>
          <span className="w-24 px-3 font-medium">标签</span>
          <span className="w-20 px-3 font-medium">阅读</span>
          <span className="w-44 px-3 font-medium">发布时间</span>
          <span className="w-40 px-5 font-medium">操作</span>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden">
        {Array.from({ length: rows }, (_, index) => (
          <div
            key={index}
            className="flex w-full items-center border-b border-[#f0f2f5] px-5 py-4"
          >
            <div className="min-w-0 flex-1 space-y-2 pr-3">
              <Bone className="h-4 w-3/5" />
              <Bone className="h-3 w-4/5" />
            </div>
            <div className="w-28 px-3">
              <Bone className="h-4 w-16" />
            </div>
            <div className="w-24 px-3">
              <Bone className="h-5 w-12" />
            </div>
            <div className="w-20 px-3">
              <Bone className="h-4 w-8" />
            </div>
            <div className="w-44 px-3">
              <Bone className="h-4 w-28" />
            </div>
            <div className="flex w-40 gap-3 px-5">
              <Bone className="h-4 w-8" />
              <Bone className="h-4 w-8" />
              <Bone className="h-4 w-8" />
            </div>
          </div>
        ))}
      </div>
      <div className="flex shrink-0 justify-end gap-2 px-5 py-4 shadow-[0_-2px_8px_rgba(16,24,40,0.05)]">
        <Bone className="h-8 w-16" />
        <Bone className="h-8 w-8" />
        <Bone className="h-8 w-8" />
        <Bone className="h-8 w-8" />
        <Bone className="h-8 w-16" />
      </div>
    </section>
  )
}
