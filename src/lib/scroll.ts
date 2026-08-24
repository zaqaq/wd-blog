const SCROLL_PREFIX = 'scroll:'

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual'
}

function storageKey(pathname: string) {
  return `${SCROLL_PREFIX}${pathname}`
}

function currentScrollY() {
  return document.scrollingElement?.scrollTop ?? window.scrollY
}

export function saveScrollPosition(pathname: string, scrollY = currentScrollY()) {
  sessionStorage.setItem(storageKey(pathname), String(scrollY))
}

export function peekScrollPosition(pathname: string) {
  const raw = sessionStorage.getItem(storageKey(pathname))
  if (!raw) {
    return null
  }
  const scrollY = Number(raw)
  return Number.isFinite(scrollY) ? scrollY : null
}

export function consumeScrollPosition(pathname: string) {
  const scrollY = peekScrollPosition(pathname)
  sessionStorage.removeItem(storageKey(pathname))
  return scrollY
}

export function restoreScrollY(scrollY: number) {
  const node = document.scrollingElement ?? document.documentElement
  node.scrollTop = scrollY
  window.scrollTo(0, scrollY)
}
