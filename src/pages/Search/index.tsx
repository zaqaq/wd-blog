import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArticleFeed } from '@/components/ArticleFeed.tsx'
import { useSearchList } from '@/hooks/useBlogData.ts'
import { parsePositiveInt } from '@/lib/number.ts'
import { paths } from '@/lib/paths.ts'
import searchNull from '@/assets/images/search-null.png'

export default function SearchPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const keyword = (searchParams.get('s') ?? '').trim()
  const pageNum = parsePositiveInt(searchParams.get('pageNum') ?? undefined)
  const { data, loading, error, retry } = useSearchList(keyword, pageNum)
  const articleList = data?.articleList ?? []

  return (
    <div>
      {!keyword ? (
        <div className="flex h-[320px] items-center justify-center bg-white text-[#666]">
          请输入搜索关键词
        </div>
      ) : (
        <ArticleFeed
          loading={loading}
          error={error}
          retry={retry}
          articleList={articleList}
          total={data?.totalNum ?? 0}
          pageNum={pageNum}
          onPageChange={(num) => navigate(paths.search(keyword, num))}
          heading={
            <div className="mb-px bg-white p-[15px] text-base">
              共<span className="text-[#09f]"> {data?.totalNum} </span>条关于 "
              <span className="text-[#09f]">{keyword}</span>" 的文章
            </div>
          }
          empty={
            <div className="mt-[100px] flex h-[380px] w-full flex-col items-center justify-center">
              <img src={searchNull} width={150} height={150} alt="" />
              <p>抱歉，没有找到符合条件的文章</p>
            </div>
          }
        />
      )}
    </div>
  )
}
