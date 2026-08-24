import { Bone } from '@/components/Skeleton/Bone.tsx'

function CommentItemSkeleton({ reply }: { reply?: boolean }) {
  return (
    <div className={reply ? 'ml-8 border-l-2 border-[#e6ecf2] pl-4' : undefined}>
      <div className="mb-2 flex items-center gap-2">
        <Bone className="h-4 w-16" />
        <Bone className="h-3 w-24" />
      </div>
      <div className="mb-2 space-y-2">
        <Bone className="h-3.5 w-full" />
        <Bone className="h-3.5 w-4/5" />
      </div>
      <Bone className="h-3 w-8" />
    </div>
  )
}

export function CommentListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-0" aria-busy aria-label="评论加载中">
      {Array.from({ length: count }, (_, index) => (
        <article
          key={index}
          className="border-b border-[#f0f0f0] py-4 last:border-b-0"
        >
          <CommentItemSkeleton />
          {index === 0 && (
            <div className="mt-3 space-y-3">
              <CommentItemSkeleton reply />
            </div>
          )}
        </article>
      ))}
    </div>
  )
}
