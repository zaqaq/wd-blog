import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
} from 'react'
import { createPortal } from 'react-dom'
import { isSelectedValue, toggleSelectedValues, visibleTagSlice } from '@/lib/select.ts'

const CLOSE_DELAY_MS = 150
const CLOSE_ANIMATION_MS = 220

const PANEL_MAX_HEIGHT = 240

const sizeClass = {
  md: 'h-10 rounded-md border border-[#dbe1ea] px-3 text-sm',
  sm: 'h-8 min-w-[52px] rounded-[3px] border border-[#ced3d9] px-2 text-sm',
} as const

const tagsTriggerClass =
  'h-10 rounded-md border border-[#dbe1ea] px-3 text-sm'

export type SelectOption<T extends string | number = string> = {
  value: T
  label: string
  disabled?: boolean
}

type SelectBaseProps<T extends string | number> = {
  options: readonly SelectOption<T>[]
  placeholder?: string
  disabled?: boolean
  id?: string
  className?: string
  size?: keyof typeof sizeClass
}

export type SelectProps<T extends string | number = string> =
  | (SelectBaseProps<T> & {
      mode?: 'single'
      value: T
      onChange: (value: T) => void
      max?: never
    })
  | (SelectBaseProps<T> & {
      mode: 'tags'
      value: readonly T[]
      onChange: (value: T[]) => void
      max?: number
      maxTagCount?: number
    })

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

export function Select<T extends string | number = string>(
  props: SelectProps<T>,
) {
  const {
    options,
    placeholder,
    disabled = false,
    id,
    className = '',
    size = 'md',
  } = props
  const isTags = props.mode === 'tags'
  const value = props.value
  const max = isTags ? props.max : undefined
  const maxTagCount = isTags ? props.maxTagCount : undefined
  const autoId = useId()
  const selectId = id ?? autoId
  const listboxId = `${selectId}-listbox`
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const panelMountedRef = useRef(false)
  const [open, setOpen] = useState(false)
  const [tagPreview, setTagPreview] = useState(false)
  const hidePreviewTimerRef = useRef(0)
  const [panelMounted, setPanelMounted] = useState(false)
  const [panelActive, setPanelActive] = useState(false)
  const [placement, setPlacement] = useState<'bottom' | 'top'>('bottom')
  const [panelHeight, setPanelHeight] = useState(0)
  const [panelStyle, setPanelStyle] = useState<CSSProperties>({})

  panelMountedRef.current = panelMounted

  const selectedCount = isTags ? props.value.length : 0
  const tagSlice = isTags
    ? visibleTagSlice(props.value, maxTagCount)
    : { visible: [] as T[], overflow: 0, rest: [] as T[] }
  const selected = isTags
    ? undefined
    : options.find((item) => isSelectedValue(value, item.value))
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
  }, [panelMounted, open, panelActive, options.length, size, selectedCount])

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
  }, [open, panelMounted, selectedCount])

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
    if (props.mode === 'tags') {
      const atMax =
        max != null &&
        props.value.length >= max &&
        !isSelectedValue(props.value, item.value)
      if (atMax || item.disabled) {
        return
      }
      props.onChange(toggleSelectedValues(props.value, item.value, max))
      return
    }
    props.onChange(item.value)
    setOpen(false)
  }

  const handleRemoveTag = (event: ReactMouseEvent, option: T) => {
    event.stopPropagation()
    event.preventDefault()
    if (props.mode !== 'tags' || disabled) {
      return
    }
    props.onChange(props.value.filter((item) => String(item) !== String(option)))
  }

  const showTagPreview = () => {
    window.clearTimeout(hidePreviewTimerRef.current)
    setTagPreview(true)
  }

  const hideTagPreviewLater = () => {
    window.clearTimeout(hidePreviewTimerRef.current)
    hidePreviewTimerRef.current = window.setTimeout(() => {
      setTagPreview(false)
    }, CLOSE_DELAY_MS)
  }

  useEffect(() => {
    return () => window.clearTimeout(hidePreviewTimerRef.current)
  }, [])

  const panel =
    panelMounted && typeof document !== 'undefined'
      ? createPortal(
          <div
            ref={panelRef}
            id={listboxId}
            role="listbox"
            aria-multiselectable={isTags || undefined}
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
                  const isSelected = isSelectedValue(value, item.value)
                  const atMax =
                    isTags &&
                    max != null &&
                    selectedCount >= max &&
                    !isSelected
                  const optionDisabled = Boolean(item.disabled || atMax)
                  return (
                    <button
                      key={toOptionValue(item.value)}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      disabled={optionDisabled}
                      onClick={() => handleSelect(item)}
                      className={`flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm transition ${
                        optionDisabled
                          ? 'cursor-not-allowed text-[#98a2b3]'
                          : isSelected
                            ? 'bg-[#e5f2ff] text-[#09f]'
                            : 'text-[#1f2937] hover:bg-[#f5f7fa]'
                      }`}
                    >
                      {isTags ? (
                        <span
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] border ${
                            isSelected
                              ? 'border-[#09f] bg-[#09f] text-white'
                              : 'border-[#d0d5dd] bg-white'
                          }`}
                        >
                          {isSelected ? (
                            <svg
                              viewBox="0 0 12 12"
                              className="h-3 w-3"
                              fill="none"
                              aria-hidden
                            >
                              <path
                                d="M2.5 6.2l2.3 2.3 4.7-5"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          ) : null}
                        </span>
                      ) : null}
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
      <div
        className={`relative ${
          className || (isTags || size === 'md' ? 'w-full' : 'inline-flex')
        }`}
      >
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
          className={`inline-flex w-full items-center justify-between gap-2 bg-white text-left outline-none transition focus:border-[#09f] disabled:cursor-not-allowed disabled:opacity-60 ${
            open ? 'border-[#09f]' : 'hover:border-[#09f]'
          } ${isTags ? tagsTriggerClass : sizeClass[size]}`}
        >
          {isTags ? (
            <span className="flex min-w-0 flex-1 flex-nowrap items-center gap-1.5 overflow-hidden">
              {props.value.length === 0 ? (
                <span className="truncate text-[#98a2b3]">
                  {placeholder ?? ''}
                </span>
              ) : (
                <>
                  {tagSlice.visible.map((item) => {
                    const label =
                      options.find(
                        (option) => String(option.value) === String(item),
                      )?.label ?? String(item)
                    return (
                      <span
                        key={String(item)}
                        className="inline-flex max-w-[8rem] shrink-0 items-center gap-1 rounded-full bg-[#e5f2ff] px-2 py-0.5 text-xs text-[#09f]"
                      >
                        <span className="truncate">{label}</span>
                        <span
                          aria-label={`移除 ${label}`}
                          onClick={(event) => handleRemoveTag(event, item)}
                          className="cursor-pointer leading-none hover:text-[#e5484d]"
                        >
                          ×
                        </span>
                      </span>
                    )
                  })}
                  {tagSlice.overflow > 0 ? (
                    <span
                      className="inline-flex shrink-0 cursor-pointer items-center rounded-full bg-[#eef2f6] px-2 py-0.5 text-xs text-[#667085]"
                      onMouseEnter={showTagPreview}
                      onMouseLeave={hideTagPreviewLater}
                    >
                      +{tagSlice.overflow}
                    </span>
                  ) : null}
                </>
              )}
            </span>
          ) : (
            <span
              className={`min-w-0 truncate ${
                selected ? 'text-[#1f2937]' : 'text-[#98a2b3]'
              }`}
            >
              {displayLabel}
            </span>
          )}
          <Chevron open={open} />
        </button>
        {isTags && tagSlice.overflow > 0 ? (
          <div
            className={`absolute bottom-full left-0 z-[2200] w-full pb-1.5 ${
              tagPreview && !open
                ? 'pointer-events-auto'
                : 'pointer-events-none'
            }`}
            onMouseEnter={showTagPreview}
            onMouseLeave={hideTagPreviewLater}
          >
            <div
              className={`select-tag-preview ${
                tagPreview && !open ? 'select-tag-preview-active' : ''
              }`}
            >
              <div className="flex flex-wrap gap-1.5 p-2">
                {props.value.map((item) => {
                  const label =
                    options.find(
                      (option) => String(option.value) === String(item),
                    )?.label ?? String(item)
                  return (
                    <span
                      key={String(item)}
                      className="inline-flex max-w-full items-center gap-1 rounded-full bg-[#e5f2ff] px-2 py-0.5 text-xs text-[#09f]"
                    >
                      <span className="truncate">{label}</span>
                      <span
                        aria-label={`移除 ${label}`}
                        onClick={(event) => handleRemoveTag(event, item)}
                        className="cursor-pointer leading-none hover:text-[#e5484d]"
                      >
                        ×
                      </span>
                    </span>
                  )
                })}
              </div>
            </div>
          </div>
        ) : null}
      </div>
      {panel}
    </>
  )
}
