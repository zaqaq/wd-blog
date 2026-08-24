import { CommentThread } from '@/components/CommentSection/CommentItem.tsx'
import { Pager } from '@/components/Pager/index.tsx'
import type { Comment } from '@/types/index.ts'
import type { MouseEvent } from 'react'

type CommentListProps = {
  comments: Comment[]
  totalNum: number
  pageNum: number
  pageSize: number
  canDelete?: boolean
  deletingId?: number | null
  onPageChange: (page: number) => void
  onReply: (id: number, nickname: string) => void
  onDelete?: (id: number, origin?: MouseEvent | HTMLElement) => void
}

export function CommentList({
  comments,
  totalNum,
  pageNum,
  pageSize,
  canDelete,
  deletingId,
  onPageChange,
  onReply,
  onDelete,
}: CommentListProps) {
  if (comments.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-[#999]">
        还没有评论，来做第一个留言的人吧
      </p>
    )
  }

  return (
    <>
      <div>
        {comments.map((comment) => (
          <CommentThread
            key={comment.id}
            comment={comment}
            canDelete={canDelete}
            deletingId={deletingId}
            onReply={onReply}
            onDelete={onDelete}
          />
        ))}
      </div>
      <Pager
        total={totalNum}
        pageNum={pageNum}
        pageSize={pageSize}
        onPageChange={onPageChange}
        className="justify-center border-t border-[#f0f0f0] py-4"
      />
    </>
  )
}
