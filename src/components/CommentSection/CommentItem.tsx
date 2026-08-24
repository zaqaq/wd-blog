import type { MouseEvent } from 'react'
import { formatDateTime } from '@/lib/datetime.ts'
import type { Comment, CommentReply } from '@/types/index.ts'

type CommentBodyProps = {
  comment: CommentReply
  isReply?: boolean
  canDelete?: boolean
  deleting?: boolean
  onReply: (id: number, nickname: string) => void
  onDelete?: (id: number, origin?: MouseEvent | HTMLElement) => void
}

function CommentBody({
  comment,
  isReply,
  canDelete,
  deleting,
  onReply,
  onDelete,
}: CommentBodyProps) {
  return (
    <div
      id={`comment-${comment.id}`}
      className={isReply ? 'ml-8 border-l-2 border-[#e6ecf2] pl-4' : undefined}
    >
      <div className="mb-1 flex flex-wrap items-center gap-2">
        <span className="font-bold text-[#333]">{comment.nickname}</span>
        {comment.reply_to_nickname && (
          <span className="text-sm text-[#999]">
            回复{' '}
            <span className="text-[#09f]">@{comment.reply_to_nickname}</span>
          </span>
        )}
        <span className="text-xs text-[#999]">
          {formatDateTime(comment.created_at)}
        </span>
      </div>
      <p className="mb-2 whitespace-pre-wrap break-words text-[#555]">
        {comment.content}
      </p>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onReply(comment.id, comment.nickname)}
          className="cursor-pointer text-xs text-[#999] transition hover:text-[#09f]"
        >
          回复
        </button>
        {canDelete && (
          <button
            type="button"
            disabled={deleting}
            onClick={(event) => onDelete?.(comment.id, event)}
            className="cursor-pointer text-xs text-[#999] transition hover:text-[#e74c3c] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleting ? '删除中…' : '删除'}
          </button>
        )}
      </div>
    </div>
  )
}

type CommentThreadProps = {
  comment: Comment
  canDelete?: boolean
  deletingId?: number | null
  onReply: (id: number, nickname: string) => void
  onDelete?: (id: number, origin?: MouseEvent | HTMLElement) => void
}

export function CommentThread({
  comment,
  canDelete,
  deletingId,
  onReply,
  onDelete,
}: CommentThreadProps) {
  return (
    <article className="border-b border-[#f0f0f0] py-4 last:border-b-0">
      <CommentBody
        comment={comment}
        canDelete={canDelete}
        deleting={deletingId === comment.id}
        onReply={onReply}
        onDelete={onDelete}
      />
      {comment.replies.length > 0 && (
        <div className="mt-3 space-y-3">
          {comment.replies.map((reply) => (
            <CommentBody
              key={reply.id}
              comment={reply}
              isReply
              canDelete={canDelete}
              deleting={deletingId === reply.id}
              onReply={onReply}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </article>
  )
}
