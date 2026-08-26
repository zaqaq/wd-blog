import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { splitTableActions } from '@/lib/tableActions.ts'

const CLOSE_DELAY_MS = 150

export type TableActionItem = {
  key: string
  label: string
  to?: string
  onClick?: (event: ReactMouseEvent<HTMLElement>) => void
}

function ActionNode({
  item,
  onPick,
}: {
  item: TableActionItem
  onPick?: () => void
}) {
  const handleClick = (event: ReactMouseEvent<HTMLElement>) => {
    onPick?.()
    item.onClick?.(event)
  }
  const className = 'cursor-pointer text-[#09f] hover:underline'

  if (item.to) {
    return (
      <Link to={item.to} className={className} onClick={handleClick}>
        {item.label}
      </Link>
    )
  }

  return (
    <button type="button" className={className} onClick={handleClick}>
      {item.label}
    </button>
  )
}

export function TableActions({
  items,
  maxInline = 3,
}: {
  items: readonly TableActionItem[]
  maxInline?: number
}) {
  const { inline, rest } = splitTableActions(items, maxInline)
  const autoId = useId()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const hideTimerRef = useRef(0)
  const [open, setOpen] = useState(false)
  const [panelStyle, setPanelStyle] = useState<CSSProperties>({})

  const showMenu = () => {
    window.clearTimeout(hideTimerRef.current)
    setOpen(true)
  }

  const hideMenuLater = () => {
    window.clearTimeout(hideTimerRef.current)
    hideTimerRef.current = window.setTimeout(() => {
      setOpen(false)
    }, CLOSE_DELAY_MS)
  }

  const hideMenu = () => {
    window.clearTimeout(hideTimerRef.current)
    setOpen(false)
  }

  useEffect(() => {
    return () => window.clearTimeout(hideTimerRef.current)
  }, [])

  const measure = () => {
    const trigger = triggerRef.current
    if (!trigger) {
      return
    }
    const rect = trigger.getBoundingClientRect()
    const gap = 4
    const menuWidth = 112
    const menuHeight = rest.length * 36 + 8
    const openUpward =
      window.innerHeight - rect.bottom - gap < menuHeight && rect.top > window.innerHeight - rect.bottom
    let left = rect.left
    if (left + menuWidth > window.innerWidth - 8) {
      left = Math.max(8, rect.right - menuWidth)
    }
    setPanelStyle({
      position: 'fixed',
      left,
      width: menuWidth,
      zIndex: 2200,
      ...(openUpward
        ? { bottom: window.innerHeight - rect.top + gap }
        : { top: rect.bottom + gap }),
    })
  }

  useLayoutEffect(() => {
    if (!open) {
      return
    }
    measure()
  }, [open, rest.length])

  useEffect(() => {
    if (!open) {
      return
    }
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (
        triggerRef.current?.contains(target) ||
        panelRef.current?.contains(target)
      ) {
        return
      }
      hideMenu()
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        hideMenu()
      }
    }
    const onScrollOrResize = () => measure()
    document.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('scroll', onScrollOrResize, true)
    window.addEventListener('resize', onScrollOrResize)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('scroll', onScrollOrResize, true)
      window.removeEventListener('resize', onScrollOrResize)
    }
  }, [open])

  const menuId = `${autoId}-menu`
  let moreMenu: ReactNode = null
  if (rest.length > 0 && typeof document !== 'undefined' && open) {
    moreMenu = createPortal(
      <div
        ref={panelRef}
        id={menuId}
        role="menu"
        style={panelStyle}
        className="flex flex-col items-start gap-3 rounded-md border border-[#efeff5] bg-white px-3 py-2.5 text-sm shadow-[0_8px_24px_rgba(16,24,40,0.12)]"
        onMouseEnter={showMenu}
        onMouseLeave={hideMenuLater}
      >
        {rest.map((item) => (
          <ActionNode key={item.key} item={item} onPick={hideMenu} />
        ))}
      </div>,
      document.body,
    )
  }

  return (
    <div className="flex flex-nowrap items-center gap-3">
      {inline.map((item) => (
        <ActionNode key={item.key} item={item} />
      ))}
      {rest.length > 0 ? (
        <button
          ref={triggerRef}
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={open ? menuId : undefined}
          className="inline-flex cursor-pointer items-center gap-0.5 text-[#09f] hover:underline"
          onMouseEnter={showMenu}
          onMouseLeave={hideMenuLater}
        >
          更多
          <svg
            viewBox="0 0 10 6"
            fill="none"
            aria-hidden
            className={`h-[5px] w-[8px] transition-transform duration-200 ${
              open ? 'rotate-180' : ''
            }`}
          >
            <path
              d="M1 1l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      ) : null}
      {moreMenu}
    </div>
  )
}
