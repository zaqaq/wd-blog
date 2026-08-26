import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArticleFeed } from '@/components/ArticleFeed.tsx'
import { useTagList } from '@/hooks/useBlogData.ts'
import { parsePositiveInt } from '@/lib/number.ts'
import { paths } from '@/lib/paths.ts'

export default function TagPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const tag = (searchParams.get('tag') ?? '').trim()
  const pageNum = parsePositiveInt(searchParams.get('pageNum') ?? undefined)
  const { data, loading, error, retry } = useTagList(tag, pageNum)

  return (
    <div>
      {!tag ? (
        <div className="flex h-[320px] items-center justify-center bg-white text-[#666]">
          请选择标签
        </div>
      ) : (
        <ArticleFeed
          loading={loading}
          error={error}
          retry={retry}
          articleList={data?.articleList ?? []}
          total={data?.totalNum ?? 0}
          pageNum={pageNum}
          onPageChange={(num) => navigate(paths.tag(tag, num))}
          heading={
            <div className="mb-px bg-white p-[15px] text-base">
              标签 "
              <span className="text-[#09f]">{tag}</span>" 共
              <span className="text-[#09f]"> {data?.totalNum ?? 0} </span>
              篇文章
            </div>
          }
        />
      )}
    </div>
  )
}
