import { useCallback, useEffect, useState } from 'react'
import { toggleArticlePraise } from '@/api/article.ts'
import { getErrorMessage } from '@/lib/error.ts'
import { getVisitorId } from '@/lib/visitor.ts'

type UseArticlePraiseOptions = {
  articleId: number
  initialPraised: boolean
  initialCount: number
}

export function useArticlePraise({
  articleId,
  initialPraised,
  initialCount,
}: UseArticlePraiseOptions) {
  const [praised, setPraised] = useState(initialPraised)
  const [praiseCount, setPraiseCount] = useState(initialCount)
  const [toggling, setToggling] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setPraised(initialPraised)
    setPraiseCount(initialCount)
    setError(null)
  }, [articleId, initialPraised, initialCount])

  const toggle = useCallback(async () => {
    if (toggling) {
      return
    }

    const prevPraised = praised
    const prevCount = praiseCount
    const nextPraised = !praised

    setPraised(nextPraised)
    setPraiseCount((count) => Math.max(0, count + (nextPraised ? 1 : -1)))
    setError(null)
    setToggling(true)

    try {
      const result = await toggleArticlePraise(articleId, getVisitorId())
      setPraised(result.praised)
      setPraiseCount(result.praise_count)
    } catch (err: unknown) {
      setPraised(prevPraised)
      setPraiseCount(prevCount)
      setError(getErrorMessage(err))
    } finally {
      setToggling(false)
    }
  }, [articleId, praised, praiseCount, toggling])

  return { praised, praiseCount, toggling, error, toggle }
}
