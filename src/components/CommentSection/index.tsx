import { useLayoutEffect, useState, type MouseEvent } from 'react'
import { CommentForm } from '@/components/CommentSection/CommentForm.tsx'
import { CommentList } from '@/components/CommentSection/CommentList.tsx'
import { ErrorState } from '@/components/ErrorState.tsx'
import { useModal } from '@/components/Modal/index.tsx'
import { CommentListSkeleton } from '@/components/Skeleton/CommentListSkeleton.tsx'
import {
  isPublishedComment,
  useArticleComments,
} from '@/hooks/useArticleComments.ts'
import { getErrorMessage } from '@/lib/error.ts'
import { useAuthHydrated, useAuthStore } from '@/stores/authStore.ts'

type CommentSectionProps = {
  articleId: number
  commentCount: number
  onCommentCountChange?: (count: number) => void
}

export function CommentSection({
  articleId,
  commentCount,
  onCommentCountChange,
}: CommentSectionProps) {
  const modal = useModal()
  const hydrated = useAuthHydrated()
  const token = useAuthStore((state) => state.token)
  const canDelete = hydrated && Boolean(token)
  const {
    pageNum,
    pageSize,
    totalNum,
    commentList,
    loading,
    error,
    submitting,
    deletingId,
    replyTo,
    setPageNum,
    setReplyTo,
    submitComment,
    removeComment,
    refresh,
    defaultNickname,
  } = useArticleComments(articleId)
  const [scrollToId, setScrollToId] = useState<number | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  useLayoutEffect(() => {
    if (scrollToId == null) {
      return
    }

    document
      .getElementById(`comment-${scrollToId}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    setScrollToId(null)
  }, [scrollToId])

  const handleSubmit = async (nickname: string, content: string) => {
    const result = await submitComment(nickname, content)
    if (isPublishedComment(result) && onCommentCountChange) {
      onCommentCountChange(commentCount + 1)
    }
    if (result.status === 'pending') {
      return { pending: true }
    }
    if (result.status === 'published' && result.id > 0) {
      setScrollToId(result.id)
      return { commentId: result.id }
    }
  }

  const handleDelete = async (
    commentId: number,
    origin?: MouseEvent | HTMLElement,
  ) => {
    const confirmed = await modal.error({
      title: '删除评论',
      content: '确定删除这条评论吗？删除主评会一并删除其下回复。',
      confirmText: '删除',
      showCancel: true,
      maskClosable: false,
      origin: origin ?? 'center',
    })
    if (!confirmed) {
      return
    }
    setDeleteError(null)
    try {
      const removedCount = await removeComment(commentId)
      if (removedCount > 0 && onCommentCountChange) {
        onCommentCountChange(Math.max(0, commentCount - removedCount))
      }
    } catch (err: unknown) {
      setDeleteError(getErrorMessage(err))
    }
  }

  return (
    <section className="mt-5 border-t border-[#e6ecf2] px-[15px] pb-8 pt-6">
      <h2 className="mb-4 text-lg font-bold text-[#333]">
        <i className="iconfont icon-pinglun mr-1 text-[#09f]" />
        评论
        <span className="ml-2 text-sm font-normal text-[#999]">
          共 {commentCount} 条
        </span>
      </h2>

      <div className="mb-6">
        <CommentForm
          defaultNickname={defaultNickname}
          replyTo={replyTo}
          submitting={submitting}
          onCancelReply={() => setReplyTo(null)}
          onSubmit={handleSubmit}
        />
      </div>

      {deleteError && (
        <p className="mb-3 text-sm text-[#e74c3c]">{deleteError}</p>
      )}

      {loading ? (
        <CommentListSkeleton />
      ) : error ? (
        <ErrorState message={error} onRetry={refresh} />
      ) : (
        <CommentList
          comments={commentList}
          totalNum={totalNum}
          pageNum={pageNum}
          pageSize={pageSize}
          canDelete={canDelete}
          deletingId={deletingId}
          onPageChange={setPageNum}
          onReply={(id, nickname) => setReplyTo({ id, nickname })}
          onDelete={canDelete ? handleDelete : undefined}
        />
      )}
    </section>
  )
}
