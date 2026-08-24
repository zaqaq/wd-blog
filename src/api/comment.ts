import { post } from '@/api/client.ts'
import type {
  CommentAddResponse,
  CommentListResponse,
} from '@/types/index.ts'

export function fetchCommentList(
  articleId: number,
  pageNum: number,
  pageSize = 20,
  order: 'desc' | 'asc' = 'desc',
) {
  return post<CommentListResponse>('/comment-list', {
    article_id: articleId,
    pageNum,
    pageSize,
    order,
  })
}

export function addComment(input: {
  article_id: number
  nickname: string
  content: string
  visitor_id: string
  parent_id?: number
  website_url?: string
}) {
  return post<CommentAddResponse>('/comment-add', input)
}

export function deleteComment(id: number) {
  return post<{ ok: true }>('/comment-delete', { id })
}
