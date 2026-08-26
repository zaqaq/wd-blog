import {
  fetchArticleDetails,
  fetchArticleList,
  fetchCategoryList,
  fetchSearchList,
  fetchTagList,
} from '@/api/article.ts'
import { fetchHeaderNav, fetchSideBar } from '@/api/nav.ts'
import { useAsyncResource } from '@/hooks/useAsyncResource.ts'
import { isPositiveIntString } from '@/lib/number.ts'
import { getVisitorId } from '@/lib/visitor.ts'

export function useArticleList(
  pageNum: number,
  pageSize: number,
  enabled = true,
) {
  return useAsyncResource(
    () => fetchArticleList(pageNum, pageSize),
    `article-list:${pageNum}:${pageSize}`,
    enabled,
  )
}

export function useCategoryList(navId: string, pageNum: number) {
  return useAsyncResource(
    () => fetchCategoryList(navId, pageNum),
    `category-list:${navId}:${pageNum}`,
  )
}

export function useSearchList(keyword: string, pageNum: number) {
  const enabled = keyword.length > 0
  return useAsyncResource(
    () => fetchSearchList(keyword, pageNum),
    `search-list:${keyword}:${pageNum}`,
    enabled,
  )
}

export function useTagList(tag: string, pageNum: number) {
  const enabled = tag.length > 0
  return useAsyncResource(
    () => fetchTagList(tag, pageNum),
    `tag-list:${tag}:${pageNum}`,
    enabled,
  )
}

export function useArticleDetails(id: string | undefined) {
  const valid = isPositiveIntString(id)
  return useAsyncResource(
    () => fetchArticleDetails(id ?? '', getVisitorId()),
    valid ? `article-details:${id}` : 'article-details:invalid',
    valid,
  )
}

export function useHeaderNav() {
  return useAsyncResource(() => fetchHeaderNav(), 'header-nav')
}

export function useSideBar() {
  return useAsyncResource(() => fetchSideBar(), 'side-bar')
}
