export const SIDEBAR_STICKY_OFFSET_PX = 74

export function shouldPinSidebar(pageScrollY: number, introHeight: number) {
  return introHeight > 0 && pageScrollY >= introHeight
}

export function pinnedSidebarMaxHeight(stickyTop: number) {
  return `calc(100svh - ${stickyTop}px)`
}

export function splitSidebarWheel(
  deltaY: number,
  scrollTop: number,
  scrollHeight: number,
  clientHeight: number,
) {
  if (deltaY === 0) {
    return { sidebar: 0, page: 0 }
  }

  const maxScroll = Math.max(0, scrollHeight - clientHeight)
  const top = Math.min(Math.max(0, scrollTop), maxScroll)

  if (deltaY > 0) {
    const sidebar = Math.min(deltaY, maxScroll - top)
    return { sidebar, page: deltaY - sidebar }
  }

  const sidebar = Math.max(deltaY, -top)
  return { sidebar: sidebar || 0, page: deltaY - sidebar || 0 }
}

export function resolvePinnedSidebarScrollTop(
  introHeight: number,
  currentScrollTop: number,
  userMovedSidebar: boolean,
) {
  if (userMovedSidebar) {
    return currentScrollTop
  }
  return introHeight
}

export function normalizeWheelDeltaY(
  deltaY: number,
  deltaMode: number,
  lineHeight = 16,
  pageHeight = 800,
) {
  if (deltaMode === 1) {
    return deltaY * lineHeight
  }
  if (deltaMode === 2) {
    return deltaY * pageHeight
  }
  return deltaY
}

export function isInsideScroller(
  target: EventTarget | null,
  scroller: HTMLElement | null,
) {
  return Boolean(scroller && target instanceof Node && scroller.contains(target))
}
