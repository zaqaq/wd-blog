import { post, postForm } from '@/api/client.ts'
import type {
  AdminArticleDetail,
  AdminArticleListResponse,
  ArticleDetailResponse,
  ArticleListResponse,
  ArticleStatus,
  ArticleWriteResponse,
  PraiseToggleResponse,
  PublishArticleInput,
  SaveArticleInput,
  UpdateReadResponse,
  UploadImageResponse,
} from '@/types/index.ts'

export function fetchArticleList(pageNum: number, pageSize?: number) {
  return post<ArticleListResponse>('/article-list', {
    pageNum,
    ...(pageSize ? { pageSize } : {}),
  })
}

export function fetchArticleDetails(
  id: string | number,
  visitorId?: string,
) {
  return post<ArticleDetailResponse>('/article-details', {
    id,
    ...(visitorId ? { visitor_id: visitorId } : {}),
  })
}

export function fetchCategoryList(navId: string, pageNum: number) {
  return post<ArticleListResponse>('/category-list', { navId, pageNum })
}

export function fetchTagList(tag: string, pageNum: number) {
  return post<ArticleListResponse>('/tag-list', { tag, pageNum })
}

export function fetchSearchList(key: string, pageNum: number) {
  return post<ArticleListResponse>('/search-list', { key, pageNum })
}

export function updateRead(id: number) {
  return post<UpdateReadResponse>('/update-read', { id })
}

export function toggleArticlePraise(articleId: number, visitorId: string) {
  return post<PraiseToggleResponse>('/article-praise/toggle', {
    article_id: articleId,
    visitor_id: visitorId,
  })
}

export function publishArticle(input: PublishArticleInput) {
  return post<ArticleWriteResponse>('/article-publish', input)
}

export function saveArticle(input: SaveArticleInput) {
  return post<ArticleWriteResponse>('/article-save', input)
}

export function setArticleStatus(
  id: number,
  status: ArticleStatus,
  scheduledAt?: string | null,
) {
  return post<ArticleWriteResponse>('/article-set-status', {
    id,
    status,
    ...(scheduledAt !== undefined ? { scheduled_at: scheduledAt } : {}),
  })
}

export function uploadImage(file: File) {
  const body = new FormData()
  body.append('file', file)
  return postForm<UploadImageResponse>('/upload-image', body)
}

export function fetchAdminArticleList(
  pageNum: number,
  pageSize = 10,
  key?: string,
  status?: ArticleStatus,
) {
  return post<AdminArticleListResponse>('/article-admin-list', {
    pageNum,
    pageSize,
    ...(key ? { key } : {}),
    ...(status ? { status } : {}),
  })
}

export function fetchAdminArticleDetail(id: number) {
  return post<AdminArticleDetail>('/article-admin-detail', { id })
}

export function updateArticle(id: number, input: PublishArticleInput) {
  const { id: _id, scheduled_at: _scheduledAt, ...fields } = input
  return post<ArticleWriteResponse>('/article-update', { id, ...fields })
}

export function deleteArticle(id: number) {
  return post<{ ok: true }>('/article-delete', { id })
}
