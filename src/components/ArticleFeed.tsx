import type { ReactNode } from 'react'
import { ArticleList } from '@/components/ArticleList/index.tsx'
import { Pager } from '@/components/Pager/index.tsx'
import { QueryStatus } from '@/components/QueryStatus.tsx'
import { ArticleListSkeleton } from '@/components/Skeleton/ArticleListSkeleton.tsx'
import { useRestoreListScroll } from '@/hooks/useRestoreListScroll.ts'
import type { Article } from '@/types/index.ts'

type ArticleFeedProps = {
  loading: boolean
  error: string | null
  retry: () => void
  articleList: Article[]
  total: number
  pageNum: number
  pageSize?: number
  onPageChange: (num: number) => void
  onPageSizeChange?: (size: number) => void
  heading?: ReactNode
  empty?: ReactNode
}

export function ArticleFeed({
  loading,
  error,
  retry,
  articleList,
  total,
  pageNum,
  pageSize,
  onPageChange,
  onPageSizeChange,
  heading,
  empty,
}: ArticleFeedProps) {
  useRestoreListScroll(!loading && !error)

  return (
    <QueryStatus
      loading={loading}
      error={error}
      retry={retry}
      fallback={<ArticleListSkeleton />}
    >
      {articleList.length === 0 && empty ? (
        empty
      ) : (
        <>
          {heading}
          <ArticleList articleList={articleList} />
          <Pager
            total={total}
            pageNum={pageNum}
            pageSize={pageSize}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        </>
      )}
    </QueryStatus>
  )
}
