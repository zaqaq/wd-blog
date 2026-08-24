import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { peekScrollPosition, restoreScrollY } from '@/lib/scroll.ts'

const isArticlePath = (pathname: string) => /^\/article\//.test(pathname)

export function useScrollRestoration() {
  const { pathname, search } = useLocation()

  useLayoutEffect(() => {
    if (isArticlePath(pathname)) {
      restoreScrollY(0)
      return
    }

    const saved = peekScrollPosition(`${pathname}${search}`)
    if (saved == null) {
      restoreScrollY(0)
    }
  }, [pathname, search])
}
