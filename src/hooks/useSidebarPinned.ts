import { useLayoutEffect, useRef, useState, type RefObject } from 'react'
import {
  isInsideScroller,
  normalizeWheelDeltaY,
  resolvePinnedSidebarScrollTop,
  shouldPinSidebar,
  splitSidebarWheel,
} from '@/lib/sidebar.ts'

export function useSidebarPinned(
  scrollerRef: RefObject<HTMLElement | null>,
  introRef: RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  const [pinned, setPinned] = useState(false)
  const [lockMinHeight, setLockMinHeight] = useState(0)
  const wasPinned = useRef(false)
  const interacting = useRef(false)
  const userMovedSidebar = useRef(false)

  useLayoutEffect(() => {
    if (!enabled) {
      setPinned(false)
      setLockMinHeight(0)
      wasPinned.current = false
      interacting.current = false
      userMovedSidebar.current = false
      return
    }

    const syncPin = () => {
      if (interacting.current) {
        return
      }
      const introHeight = introRef.current?.offsetHeight ?? 0
      setPinned(shouldPinSidebar(window.scrollY, introHeight))
    }

    const onPointerOrWheelOutside = (event: Event) => {
      if (isInsideScroller(event.target, scrollerRef.current)) {
        return
      }
      interacting.current = false
      syncPin()
    }

    syncPin()
    window.addEventListener('scroll', syncPin, { passive: true })
    window.addEventListener('resize', syncPin)
    window.addEventListener('wheel', onPointerOrWheelOutside, {
      passive: true,
      capture: true,
    })
    window.addEventListener('pointerdown', onPointerOrWheelOutside, {
      passive: true,
      capture: true,
    })
    return () => {
      window.removeEventListener('scroll', syncPin)
      window.removeEventListener('resize', syncPin)
      window.removeEventListener('wheel', onPointerOrWheelOutside, true)
      window.removeEventListener('pointerdown', onPointerOrWheelOutside, true)
    }
  }, [enabled, introRef, scrollerRef])

  useLayoutEffect(() => {
    const scroller = scrollerRef.current
    const introHeight = introRef.current?.offsetHeight ?? 0
    if (!scroller) {
      wasPinned.current = pinned
      return
    }

    if (pinned && !wasPinned.current) {
      setLockMinHeight(scroller.scrollHeight)
      scroller.scrollTop = resolvePinnedSidebarScrollTop(
        introHeight,
        scroller.scrollTop,
        userMovedSidebar.current,
      )
    } else if (!pinned && wasPinned.current) {
      scroller.scrollTop = 0
      userMovedSidebar.current = false
      setLockMinHeight(0)
    }

    wasPinned.current = pinned
  }, [introRef, pinned, scrollerRef])

  useLayoutEffect(() => {
    if (!pinned) {
      return
    }

    const scroller = scrollerRef.current
    if (!scroller) {
      return
    }

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey) {
        return
      }

      interacting.current = true
      const deltaY = normalizeWheelDeltaY(
        event.deltaY,
        event.deltaMode,
        16,
        window.innerHeight,
      )
      const { sidebar, page } = splitSidebarWheel(
        deltaY,
        scroller.scrollTop,
        scroller.scrollHeight,
        scroller.clientHeight,
      )
      if (sidebar === 0 && page === 0) {
        return
      }
      event.preventDefault()
      if (sidebar !== 0) {
        userMovedSidebar.current = true
        scroller.scrollTop += sidebar
      }
      if (page !== 0) {
        window.scrollBy(0, page)
      }
    }

    scroller.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      scroller.removeEventListener('wheel', onWheel)
    }
  }, [pinned, scrollerRef])

  return { pinned, lockMinHeight }
}
