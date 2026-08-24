import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { ArticleMeta } from '@/components/ArticleMeta.tsx'
import { MarkdownContent } from '@/components/MarkdownContent.tsx'
import { QueryStatus } from '@/components/QueryStatus.tsx'
import { useArticleDetails } from '@/hooks/useBlogData.ts'
import { useOpenArticle } from '@/hooks/useOpenArticle.ts'
import { paths } from '@/lib/paths.ts'
import type { ArticleNeighbor } from '@/types/index.ts'

function NeighborLink({
  label,
  neighbor,
  align,
  onOpen,
}: {
  label: string
  neighbor?: ArticleNeighbor
  align: 'left' | 'right'
  onOpen: (id: number) => void
}) {
  if (!neighbor?.flag || neighbor.id == null) {
    return null
  }

  const articleId = neighbor.id
  return (
    <div className={align === 'right' ? 'ml-auto' : undefined}>
      {label}:{' '}
      <span
        className="ml-[5px] cursor-pointer"
        onClick={() => onOpen(articleId)}
      >
        {neighbor.title}
      </span>
    </div>
  )
}

export default function ArticleDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { data, loading, error, retry } = useArticleDetails(id)
  const { open } = useOpenArticle()
  const articleDetail = data?.articleDetail

  const goBack = () => {
    if (location.key !== 'default') {
      navigate(-1)
      return
    }
    navigate(paths.home)
  }

  return (
    <div className="overflow-hidden bg-white">
      <div className="px-[15px] pt-3">
        <button
          type="button"
          onClick={goBack}
          className="inline-flex items-center text-sm text-[#666] transition hover:text-[#09f]"
        >
          <i className="iconfont iconarrow-left mr-1 text-[16px]" />
          返回
        </button>
      </div>

      <QueryStatus loading={loading} error={error} retry={retry}>
        {articleDetail ? (
          <>
            <div className="px-[15px] pb-[15px]">
              <h1 className="pt-2 text-center text-[30px] font-bold">
                {articleDetail.title}
              </h1>
              <div className="flex justify-center overflow-hidden border-b border-[#F3F3F3] py-2.5">
                <ArticleMeta
                  article={articleDetail}
                  className="flex text-[#999]"
                />
              </div>
            </div>

            <div className="min-h-[520px] overflow-hidden pb-[15px]">
              <div className="mb-[15px] ml-[15px] rounded-r-[5px] border-l-8 border-[rgba(102,128,153,0.075)] bg-[rgba(102,128,153,0.05)] p-2.5">
                {articleDetail.des}
              </div>
              <div className="px-[15px]">
                <MarkdownContent content={articleDetail.content} />
              </div>
            </div>

            <div className="flex justify-between overflow-hidden border-t border-[#ccc] px-[15px] py-3">
              <NeighborLink
                label="上一篇"
                neighbor={data?.prev}
                align="left"
                onOpen={open}
              />
              <NeighborLink
                label="下一篇"
                neighbor={data?.next}
                align="right"
                onOpen={open}
              />
            </div>

            <div className="mt-5 flex h-[200px] items-center justify-center">
              <p className="h-[200px] rounded-full bg-[#fd8c84] px-[30px] text-center text-base font-bold leading-[200px] text-white">
                评论点赞暂未开放, 敬请期待 ~~~
              </p>
            </div>
          </>
        ) : (
          <p className="p-8 text-center text-[#666]">文章不存在</p>
        )}
      </QueryStatus>
    </div>
  )
}
