import { useEffect } from 'react'
import { useArticlePraise } from '@/hooks/useArticlePraise.ts'

type PraiseBarProps = {
  articleId: number
  initialPraised: boolean
  initialCount: number
  onPraiseCountChange?: (count: number) => void
}

export function PraiseBar({
  articleId,
  initialPraised,
  initialCount,
  onPraiseCountChange,
}: PraiseBarProps) {
  const { praised, praiseCount, toggling, error, toggle } = useArticlePraise({
    articleId,
    initialPraised,
    initialCount,
  })

  useEffect(() => {
    onPraiseCountChange?.(praiseCount)
  }, [praiseCount, onPraiseCountChange])

  return (
    <div className="mt-5 flex flex-col items-center border-t border-[#e6ecf2] px-[15px] py-8">
      <button
        type="button"
        disabled={toggling}
        onClick={() => {
          void toggle()
        }}
        aria-pressed={praised}
        className={`inline-flex h-12 w-12 items-center justify-center rounded-full border text-[20px] transition cursor-pointer ${
          praised
            ? 'border-[#fd8c84] bg-[#fd8c84] text-white'
            : 'border-[#ced3d9] bg-white text-[#999] hover:border-[#fd8c84] hover:text-[#fd8c84]'
        } disabled:cursor-not-allowed disabled:opacity-70`}
      >
        <i className="iconfont icon-dianzan" />
      </button>
      <p className="mt-3 text-sm text-[#666]">
        {praised ? '已点赞' : '觉得不错就点个赞吧'}
        <span className="ml-2 text-[#999]">{praiseCount} 人觉得不错</span>
      </p>
      {error && <p className="mt-2 text-sm text-[#e74c3c]">{error}</p>}
    </div>
  )
}
