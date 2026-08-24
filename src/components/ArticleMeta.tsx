import type { ReactNode } from 'react'
import type { Article } from '@/types/index.ts'

type ArticleMetaProps = {
  article: Pick<
    Article,
    'publish_date' | 'comment_count' | 'read_count' | 'praise_count'
  >
  extra?: ReactNode
  className?: string
}

export function ArticleMeta({
  article,
  extra,
  className = 'flex text-xs text-[#999]',
}: ArticleMetaProps) {
  const items = [
    { icon: 'icon-riqi', text: article.publish_date },
    { icon: 'icon-pinglun', text: `${article.comment_count}条评论` },
    { icon: 'icon-yueduliang', text: `${article.read_count}次阅读` },
    { icon: 'icon-dianzan', text: `${article.praise_count}人点赞` },
  ]

  return (
    <div className={className}>
      {items.map((item) => (
        <p
          key={item.icon}
          className="relative mr-5 after:absolute after:top-2 after:right-[-10px] after:h-2.5 after:w-px after:bg-[#e6ecf2] after:content-['']"
        >
          <i className={`iconfont ${item.icon} mr-[3px] align-[-1px]`} />
          {item.text}
        </p>
      ))}
      {extra}
    </div>
  )
}
