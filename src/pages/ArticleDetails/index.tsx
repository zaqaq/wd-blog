import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { ArticleMeta } from '@/components/ArticleMeta.tsx'
import { CommentSection } from '@/components/CommentSection/index.tsx'
import { MarkdownContent } from '@/components/MarkdownContent.tsx'
import { PraiseBar } from '@/components/PraiseBar.tsx'
import { QueryStatus } from '@/components/QueryStatus.tsx'
import { ArticleDetailSkeleton } from '@/components/Skeleton/ArticleDetailSkeleton.tsx'
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
  const [commentCount, setCommentCount] = useState<number | null>(null)
  const [praiseCount, setPraiseCount] = useState<number | null>(null)
  const displayCommentCount = commentCount ?? articleDetail?.comment_count ?? 0
  const displayPraiseCount = praiseCount ?? articleDetail?.praise_count ?? 0

  useEffect(() => {
    setCommentCount(null)
    setPraiseCount(null)
  }, [articleDetail?.id])

  const goBack = () => {
    if (location.key !== 'default') {
      navigate(-1)
      return
    }
    navigate(paths.home)
  }

  return (
    <div className="overflow-hidden bg-white">
      <QueryStatus
        loading={loading}
        error={error}
        retry={retry}
        fallback={<ArticleDetailSkeleton />}
      >
        <div className="px-[15px] pt-3">
          <button
            type="button"
            onClick={goBack}
            className="inline-flex cursor-pointer items-center text-sm text-[#666] transition hover:text-[#09f]"
          >
            <i className="iconfont iconarrow-left mr-1 text-[16px]" />
            返回
          </button>
        </div>

        {articleDetail ? (
          <>
            <div className="px-[15px] pb-[15px]">
              <h1 className="pt-2 text-center text-[30px] font-bold">
                {articleDetail.title}
              </h1>
              <div className="flex justify-center overflow-hidden border-b border-[#F3F3F3] py-2.5">
                <ArticleMeta
                  article={{
                    ...articleDetail,
                    comment_count: displayCommentCount,
                    praise_count: displayPraiseCount,
                  }}
                  className="flex flex-nowrap items-center text-[#999]"
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

            <div className="flex min-h-[45px] items-center justify-between overflow-hidden border-t border-[#ccc] px-[15px] py-3">
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

            <PraiseBar
              articleId={articleDetail.id}
              initialPraised={data?.praise?.praised ?? false}
              initialCount={articleDetail.praise_count}
              onPraiseCountChange={setPraiseCount}
            />

            <CommentSection
              articleId={articleDetail.id}
              commentCount={displayCommentCount}
              onCommentCountChange={setCommentCount}
            />
          </>
        ) : (
          <p className="p-8 text-center text-[#666]">文章不存在</p>
        )}
      </QueryStatus>
    </div>
  )
}
