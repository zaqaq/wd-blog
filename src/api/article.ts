import { post } from '@/api/client.ts'
import type {
  AdminArticleDetail,
  AdminArticleListResponse,
  ArticleDetailResponse,
  ArticleListResponse,
  PraiseToggleResponse,
  PublishArticleInput,
  PublishArticleResponse,
  UpdateReadResponse,
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
  return post<PublishArticleResponse>('/article-publish', input)
}

export function fetchAdminArticleList(
  pageNum: number,
  pageSize = 10,
  key?: string,
) {
  return post<AdminArticleListResponse>('/article-admin-list', {
    pageNum,
    pageSize,
    ...(key ? { key } : {}),
  })
}

export function fetchAdminArticleDetail(id: number) {
  return post<AdminArticleDetail>('/article-admin-detail', { id })
}

export function updateArticle(id: number, input: PublishArticleInput) {
  return post<PublishArticleResponse>('/article-update', { id, ...input })
}

export function deleteArticle(id: number) {
  return post<{ ok: true }>('/article-delete', { id })
}
