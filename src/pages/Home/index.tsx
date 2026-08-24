import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArticleFeed } from '@/components/ArticleFeed.tsx'
import { parsePageSize } from '@/components/Pager/index.tsx'
import { useArticleList } from '@/hooks/useBlogData.ts'
import { isPositiveIntString, parsePositiveInt } from '@/lib/number.ts'
import { paths } from '@/lib/paths.ts'

export default function HomePage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const pageNum = parsePositiveInt(id)
  const pageSize = parsePageSize(searchParams.get('pageSize'))
  const redirectHome = id != null && (!isPositiveIntString(id) || pageNum === 1)
  const { data, loading, error, retry } = useArticleList(
    pageNum,
    pageSize,
    !redirectHome,
  )

  if (redirectHome) {
    return <Navigate to={paths.page(1, pageSize)} replace />
  }

  return (
    <ArticleFeed
      loading={loading}
      error={error}
      retry={retry}
      articleList={data?.articleList ?? []}
      total={data?.totalNum ?? 0}
      pageNum={pageNum}
      pageSize={pageSize}
      onPageChange={(num) => navigate(paths.page(num, pageSize))}
      onPageSizeChange={(size) => navigate(paths.page(1, size))}
    />
  )
}
