import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArticleFeed } from '@/components/ArticleFeed.tsx'
import { CategoryDes } from '@/components/CategoryDes/index.tsx'
import { useCategoryList } from '@/hooks/useBlogData.ts'
import { parsePositiveInt } from '@/lib/number.ts'
import { paths } from '@/lib/paths.ts'

export default function CategoryPage() {
  const navigate = useNavigate()
  const { navId = '' } = useParams()
  const [searchParams] = useSearchParams()
  const pageNum = parsePositiveInt(searchParams.get('pageNum') ?? undefined)
  const { data, loading, error, retry } = useCategoryList(navId, pageNum)

  return (
    <div>
      <div className="flex justify-center">
        <div className="relative mt-2.5 mb-5 w-[800px]">
          <div className="w-full rounded-[15px] bg-[#ececec] px-[25px] py-10 pb-5 font-serif text-base font-bold text-[saddlebrown]">
            <CategoryDes type={navId} />
          </div>
          <div className="absolute top-[-50px] left-[65px] h-[70px] w-[5px] bg-[brown] after:absolute after:bottom-[-15px] after:left-[-10px] after:h-[25px] after:w-[25px] after:rounded-full after:bg-[brown] after:content-['']" />
          <div className="absolute top-[-50px] right-[65px] h-[70px] w-[5px] bg-[brown] after:absolute after:bottom-[-15px] after:left-[-10px] after:h-[25px] after:w-[25px] after:rounded-full after:bg-[brown] after:content-['']" />
        </div>
      </div>
      <ArticleFeed
        loading={loading}
        error={error}
        retry={retry}
        articleList={data?.articleList ?? []}
        total={data?.totalNum ?? 0}
        pageNum={pageNum}
        onPageChange={(num) => navigate(paths.category(navId, num))}
      />
    </div>
  )
}
