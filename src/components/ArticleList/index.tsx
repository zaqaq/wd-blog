import { ArticleMeta } from '@/components/ArticleMeta.tsx'
import { useOpenArticle } from '@/hooks/useOpenArticle.ts'
import type { Article } from '@/types/index.ts'
import articleThumb from '@/assets/images/article-placeholder.svg'

type ArticleListProps = {
  articleList: Article[]
}

export function ArticleList({ articleList }: ArticleListProps) {
  const { open } = useOpenArticle()

  const toArticleDetails = (id: number) => {
    open(id)
  }

  if (articleList.length === 0) {
    return (
      <div className="bg-white py-10 text-center text-base">暂无相关列表信息</div>
    )
  }

  return (
    <div className="border-b border-[#f5f7fa]">
      {articleList.map((item) => (
        <div key={item.id} className="mb-2.5 bg-white p-5 text-[#333]">
          <div className="flex">
            <div className="mr-[30px] shrink-0">
              <span
                className="block h-[155px] w-[230px] cursor-pointer overflow-hidden bg-[#eef1f6]"
                onClick={() => toArticleDetails(item.id)}
              >
                <img
                  src={item.img_href?.trim() || articleThumb}
                  alt=""
                  className="h-full w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.onerror = null
                    event.currentTarget.src = articleThumb
                  }}
                />
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-[15px]">
                <span className="relative top-[-2px] mr-2.5 inline-block bg-[#09f] px-1.5 py-0.5 text-[13px] whitespace-nowrap text-white after:absolute after:top-1.5 after:right-[-4px] after:border-y-4 after:border-l-4 after:border-y-transparent after:border-l-[#09f] after:content-['']">
                  {item.tag}
                </span>
                <h2
                  className="inline-block cursor-pointer text-lg font-bold hover:text-[#f90]"
                  onClick={() => toArticleDetails(item.id)}
                >
                  {item.title}
                </h2>
              </div>
              <p className="mb-2.5 line-clamp-4 h-[82px] overflow-hidden text-ellipsis text-[#666]">
                {item.des}
              </p>
              <ArticleMeta
                article={item}
                extra={
                  <p
                    className="cursor-pointer hover:text-[#f90]"
                    onClick={() => toArticleDetails(item.id)}
                  >
                    <i className="iconfont icon-yuedu mr-[3px] align-[-1px]" />
                    阅读全文
                  </p>
                }
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
