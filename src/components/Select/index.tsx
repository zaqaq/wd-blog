import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import { createPortal } from 'react-dom'

const CLOSE_DELAY_MS = 150
const CLOSE_ANIMATION_MS = 220

const PANEL_MAX_HEIGHT = 240

const sizeClass = {
  md: 'h-10 w-full rounded-md border border-[#dbe1ea] px-3 text-sm',
  sm: 'h-8 min-w-[52px] rounded-[3px] border border-[#ced3d9] px-2 text-sm',
} as const

export type SelectOption<T extends string | number = string> = {
  value: T
  label: string
  disabled?: boolean
}

export type SelectProps<T extends string | number = string> = {
  value: T
  options: readonly SelectOption<T>[]
  onChange: (value: T) => void
  placeholder?: string
  disabled?: boolean
  id?: string
  className?: string
  size?: keyof typeof sizeClass
}

function toOptionValue(value: string | number) {
  return String(value)
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 10 6"
      fill="none"
      aria-hidden
      className={`h-[6px] w-[10px] shrink-0 text-[#667085] transition-transform duration-200 ${
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
  )
}

export function Select<T extends string | number = string>({
  value,
  options,
  onChange,
  placeholder,
  disabled = false,
  id,
  className = '',
  size = 'md',
}: SelectProps<T>) {
  const autoId = useId()
  const selectId = id ?? autoId
  const listboxId = `${selectId}-listbox`
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const panelMountedRef = useRef(false)
  const [open, setOpen] = useState(false)
  const [panelMounted, setPanelMounted] = useState(false)
  const [panelActive, setPanelActive] = useState(false)
  const [placement, setPlacement] = useState<'bottom' | 'top'>('bottom')
  const [panelHeight, setPanelHeight] = useState(0)
  const [panelStyle, setPanelStyle] = useState<CSSProperties>({})

  panelMountedRef.current = panelMounted

  const selected = options.find(
    (item) => toOptionValue(item.value) === toOptionValue(value),
  )
  const displayLabel = selected?.label ?? placeholder ?? ''

  const measurePanel = () => {
    const trigger = triggerRef.current
    const content = contentRef.current
    if (!trigger || !content) {
      return
    }

    const rect = trigger.getBoundingClientRect()
    const gap = 4
    const spaceBelow = window.innerHeight - rect.bottom - gap
    const spaceAbove = rect.top - gap
    const openUpward = spaceBelow < 160 && spaceAbove > spaceBelow
    const available = openUpward
      ? Math.min(PANEL_MAX_HEIGHT, spaceAbove)
      : Math.min(PANEL_MAX_HEIGHT, spaceBelow)

    setPlacement(openUpward ? 'top' : 'bottom')
    setPanelHeight(Math.min(content.scrollHeight, available))
    setPanelStyle({
      position: 'fixed',
      left: rect.left,
      width: rect.width,
      zIndex: 2100,
      ...(openUpward
        ? { bottom: window.innerHeight - rect.top + gap }
        : { top: rect.bottom + gap }),
    })
  }

  useEffect(() => {
    if (open) {
      setPanelMounted(true)
      return
    }

    if (!panelMountedRef.current) {
      return
    }

    const collapseTimer = window.setTimeout(() => {
      setPanelActive(false)
    }, CLOSE_DELAY_MS)
    const unmountTimer = window.setTimeout(() => {
      setPanelMounted(false)
    }, CLOSE_DELAY_MS + CLOSE_ANIMATION_MS)

    return () => {
      window.clearTimeout(collapseTimer)
      window.clearTimeout(unmountTimer)
    }
  }, [open])

  useLayoutEffect(() => {
    if (!panelMounted) {
      return
    }
    measurePanel()
    if (!open || panelActive) {
      return
    }

    let raf1 = 0
    let raf2 = 0
    raf1 = window.requestAnimationFrame(() => {
      raf2 = window.requestAnimationFrame(() => {
        setPanelActive(true)
      })
    })
    return () => {
      window.cancelAnimationFrame(raf1)
      window.cancelAnimationFrame(raf2)
    }
  }, [panelMounted, open, panelActive, options.length, size])

  useEffect(() => {
    if (!open) {
      return
    }
    const onScrollOrResize = () => measurePanel()
    window.addEventListener('scroll', onScrollOrResize, true)
    window.addEventListener('resize', onScrollOrResize)
    return () => {
      window.removeEventListener('scroll', onScrollOrResize, true)
      window.removeEventListener('resize', onScrollOrResize)
    }
  }, [open, panelMounted])

  useEffect(() => {
    if (!open) {
      return
    }
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node
      if (
        triggerRef.current?.contains(target) ||
        panelRef.current?.contains(target)
      ) {
        return
      }
      setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const handleSelect = (item: SelectOption<T>) => {
    if (item.disabled) {
      return
    }
    onChange(item.value)
    setOpen(false)
  }

  const panel =
    panelMounted && typeof document !== 'undefined'
      ? createPortal(
          <div
            ref={panelRef}
            id={listboxId}
            role="listbox"
            style={{
              ...panelStyle,
              ['--select-panel-height' as string]: `${panelHeight}px`,
            }}
            className={`select-panel-shell ${
              placement === 'top' ? 'select-panel-shell-top' : ''
            } ${panelActive ? 'select-panel-shell-active' : ''} ${
              panelMounted && !open && !panelActive
                ? 'select-panel-shell-closing'
                : ''
            } ${open ? '' : 'pointer-events-none'}`}
          >
            <div ref={contentRef} className="py-1">
              {options.length === 0 ? (
                <p className="px-3 py-2 text-sm text-[#98a2b3]">暂无选项</p>
              ) : (
                options.map((item) => {
                  const isSelected =
                    toOptionValue(item.value) === toOptionValue(value)
                  return (
                    <button
                      key={toOptionValue(item.value)}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      disabled={item.disabled}
                      onClick={() => handleSelect(item)}
                      className={`flex w-full cursor-pointer items-center px-3 py-2 text-left text-sm transition ${
                        item.disabled
                          ? 'cursor-not-allowed text-[#98a2b3]'
                          : isSelected
                            ? 'bg-[#e5f2ff] text-[#09f]'
                            : 'text-[#1f2937] hover:bg-[#f5f7fa]'
                      }`}
                    >
                      {item.label}
                    </button>
                  )
                })
              )}
            </div>
          </div>,
          document.body,
        )
      : null

  return (
    <>
      <button
        ref={triggerRef}
        id={selectId}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={panelMounted ? listboxId : undefined}
        onClick={() => {
          if (disabled) {
            return
          }
          setOpen((current) => !current)
        }}
        className={`inline-flex items-center justify-between gap-2 bg-white text-left outline-none transition focus:border-[#09f] disabled:cursor-not-allowed disabled:opacity-60 ${
          open ? 'border-[#09f]' : 'hover:border-[#09f]'
        } ${sizeClass[size]} ${className}`}
      >
        <span
          className={`min-w-0 truncate ${
            selected ? 'text-[#1f2937]' : 'text-[#98a2b3]'
          }`}
        >
          {displayLabel}
        </span>
        <Chevron open={open} />
      </button>
      {panel}
    </>
  )
}
