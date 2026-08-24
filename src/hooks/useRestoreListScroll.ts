import { useLayoutEffect, type RefObject } from 'react'
import { useLocation } from 'react-router-dom'
import {
  consumeScrollPosition,
  peekScrollPosition,
  restoreScrollY,
} from '@/lib/scroll.ts'

export function useRestoreListScroll(
  ready: boolean,
  scrollerRef?: RefObject<HTMLElement | null>,
) {
  const { pathname, search } = useLocation()

  useLayoutEffect(() => {
    if (!ready) {
      return
    }

    const key = `${pathname}${search}`
    const saved = peekScrollPosition(key)
    if (saved == null || saved <= 0) {
      return
    }

    let cancelled = false
    let attempts = 0

    const apply = () => {
      if (cancelled) {
        return true
      }
      const scroller = scrollerRef?.current
      if (scroller) {
        scroller.scrollTop = saved
        const maxScroll = Math.max(0, scroller.scrollHeight - scroller.clientHeight)
        return maxScroll >= saved - 1
      }
      restoreScrollY(saved)
      const scrolling = document.scrollingElement ?? document.documentElement
      const maxScroll = Math.max(0, scrolling.scrollHeight - window.innerHeight)
      return maxScroll >= saved - 1
    }

    const finish = () => {
      if (!cancelled) {
        consumeScrollPosition(key)
      }
    }

    if (apply()) {
      const timer = window.setTimeout(finish, 0)
      return () => {
        cancelled = true
        window.clearTimeout(timer)
      }
    }

    let raf = requestAnimationFrame(function tick() {
      attempts += 1
      if (apply() || attempts > 60) {
        finish()
        return
      }
      raf = requestAnimationFrame(tick)
    })

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
    }
  }, [ready, pathname, search, scrollerRef])
}
