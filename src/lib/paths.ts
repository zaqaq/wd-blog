import { DEFAULT_PAGE_SIZE } from '@/components/Pager/index.tsx'

export const paths = {
  home: '/',
  adminLogin: '/admin/login',
  adminArticles: '/admin/articles',
  adminPublish: '/admin/publish',
  adminArticleEdit(id: number | string) {
    return `/admin/articles/${id}/edit`
  },
  page(pageNum: number, pageSize = DEFAULT_PAGE_SIZE) {
    const params = new URLSearchParams()
    if (pageSize !== DEFAULT_PAGE_SIZE) {
      params.set('pageSize', String(pageSize))
    }
    const query = params.toString()
    const base = pageNum <= 1 ? '/' : `/page/${pageNum}`
    return query ? `${base}?${query}` : base
  },
  article(id: number | string) {
    return `/article/${id}`
  },
  search(keyword: string, pageNum = 1) {
    const params = new URLSearchParams({ s: keyword })
    if (pageNum > 1) {
      params.set('pageNum', String(pageNum))
    }
    return `/search?${params.toString()}`
  },
  category(navId: string | number, pageNum = 1) {
    const base = `/category/${navId}`
    return pageNum > 1 ? `${base}?pageNum=${pageNum}` : base
  },
}
