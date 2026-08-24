import { useCallback, useEffect, useState } from 'react'
import {
  addComment,
  deleteComment,
  fetchCommentList,
} from '@/api/comment.ts'
import { getErrorMessage } from '@/lib/error.ts'
import {
  getStoredNickname,
  getVisitorId,
  setStoredNickname,
} from '@/lib/visitor.ts'
import type {
  Comment,
  CommentAddResponse,
  CommentReply,
} from '@/types/index.ts'

const PAGE_SIZE = 20

export type ReplyTarget = {
  id: number
  nickname: string
}

function toCommentReply(result: CommentAddResponse): CommentReply {
  return {
    id: result.id,
    nickname: result.nickname,
    content: result.content,
    reply_to_nickname: result.reply_to_nickname,
    created_at:
      typeof result.created_at === 'string'
        ? result.created_at
        : new Date(result.created_at).toISOString(),
  }
}

function appendReply(
  list: Comment[],
  replyToId: number,
  reply: CommentReply,
): Comment[] {
  return list.map((comment) => {
    const matchesRoot = comment.id === replyToId
    const matchesNested = comment.replies.some((item) => item.id === replyToId)
    if (!matchesRoot && !matchesNested) {
      return comment
    }
    return {
      ...comment,
      replies: [...comment.replies, reply],
    }
  })
}

function removeCommentFromList(
  list: Comment[],
  commentId: number,
): { nextList: Comment[]; removedCount: number; removedRoot: boolean } {
  const rootIndex = list.findIndex((item) => item.id === commentId)
  if (rootIndex >= 0) {
    const root = list[rootIndex]
    return {
      nextList: [...list.slice(0, rootIndex), ...list.slice(rootIndex + 1)],
      removedCount: 1 + root.replies.length,
      removedRoot: true,
    }
  }

  let removedCount = 0
  const nextList = list.map((comment) => {
    const before = comment.replies.length
    const replies = comment.replies.filter((reply) => reply.id !== commentId)
    if (replies.length !== before) {
      removedCount = 1
      return { ...comment, replies }
    }
    return comment
  })

  return { nextList, removedCount, removedRoot: false }
}

export function useArticleComments(articleId: number) {
  const [pageNum, setPageNum] = useState(1)
  const [totalNum, setTotalNum] = useState(0)
  const [commentList, setCommentList] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [replyTo, setReplyTo] = useState<ReplyTarget | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    void fetchCommentList(articleId, pageNum, PAGE_SIZE)
      .then((res) => {
        if (!cancelled) {
          setTotalNum(res.totalNum)
          setCommentList(res.commentList)
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(getErrorMessage(err))
          setCommentList([])
          setTotalNum(0)
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [articleId, pageNum, refreshKey])

  const refresh = useCallback(() => {
    setRefreshKey((value) => value + 1)
  }, [])

  const submitComment = useCallback(
    async (nickname: string, content: string) => {
      setSubmitting(true)
      const currentReplyTo = replyTo
      try {
        const result = await addComment({
          article_id: articleId,
          nickname,
          content,
          visitor_id: getVisitorId(),
          ...(currentReplyTo ? { parent_id: currentReplyTo.id } : {}),
          website_url: '',
        })
        setStoredNickname(nickname)
        setReplyTo(null)

        if (result.status === 'published' && result.id > 0) {
          const item = toCommentReply(result)
          if (!currentReplyTo) {
            setCommentList((prev) => [{ ...item, replies: [] }, ...prev])
            setTotalNum((value) => value + 1)
          } else {
            setCommentList((prev) => appendReply(prev, currentReplyTo.id, item))
          }
        }

        return result
      } finally {
        setSubmitting(false)
      }
    },
    [articleId, replyTo],
  )

  const removeComment = useCallback(async (commentId: number) => {
    setDeletingId(commentId)
    try {
      await deleteComment(commentId)
      let removedCount = 0
      let removedRoot = false
      setCommentList((prev) => {
        const result = removeCommentFromList(prev, commentId)
        removedCount = result.removedCount
        removedRoot = result.removedRoot
        return result.nextList
      })
      if (removedRoot) {
        setTotalNum((value) => Math.max(0, value - 1))
      }
      setReplyTo((current) => (current?.id === commentId ? null : current))
      return removedCount
    } finally {
      setDeletingId(null)
    }
  }, [])

  return {
    pageNum,
    pageSize: PAGE_SIZE,
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
    defaultNickname: getStoredNickname(),
  }
}

export function isPublishedComment(
  result: CommentAddResponse,
): result is CommentAddResponse & { status: 'published' } {
  return result.status === 'published'
}
