import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
} from 'react'
import { createPortal } from 'react-dom'
import {
  modalDefaults,
  resolveModalOrigin,
  type ModalProps,
  type ModalType,
} from '@/components/Modal/types.ts'

const ANIMATION_MS = 320

const iconSvgProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.25,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  className: 'h-5 w-5',
  'aria-hidden': true,
}

function StatusGlyph({ type }: { type: ModalType }) {
  switch (type) {
    case 'success':
      return (
        <svg {...iconSvgProps} className="h-4 w-4">
          <path d="M5 13l4 4L19 7" />
        </svg>
      )
    case 'error':
      return (
        <svg {...iconSvgProps} className="h-4 w-4">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      )
    case 'warning':
    case 'confirm':
      return (
        <svg {...iconSvgProps}>
          <path d="M12 6.5v7" />
          <circle cx="12" cy="17.5" r="1.35" fill="currentColor" stroke="none" />
        </svg>
      )
    default:
      return (
        <svg {...iconSvgProps}>
          <circle cx="12" cy="6.5" r="1.35" fill="currentColor" stroke="none" />
          <path d="M12 11v7" />
        </svg>
      )
  }
}

function StatusIcon({ type }: { type: ModalType }) {
  const preset = modalDefaults[type]

  return (
    <span
      className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${preset.iconBg} ${preset.iconClass}`}
      aria-hidden
    >
      <StatusGlyph type={type} />
    </span>
  )
}

function getOriginStyle(
  origin: ModalProps['origin'],
): CSSProperties {
  const point = resolveModalOrigin(origin)
  if (point.mode === 'center') {
    return {
      '--modal-ox': '0px',
      '--modal-oy': '12px',
      '--modal-scale': '0.96',
    } as CSSProperties
  }

  const dx = point.x - window.innerWidth / 2
  const dy = point.y - window.innerHeight / 2
  return {
    '--modal-ox': `${dx}px`,
    '--modal-oy': `${dy}px`,
    '--modal-scale': '0.2',
  } as CSSProperties
}

export function Modal({
  open,
  type = 'info',
  title,
  content,
  confirmText,
  cancelText,
  showCancel,
  maskClosable,
  closable = true,
  showIcon = true,
  confirmLoading = false,
  origin = 'center',
  onConfirm,
  onCancel,
  onClose,
}: ModalProps) {
  const preset = modalDefaults[type]
  const titleId = useId()
  const contentId = useId()
  const confirmRef = useRef<HTMLButtonElement>(null)
  const onCancelRef = useRef(onCancel)
  const onCloseRef = useRef(onClose)
  const originRef = useRef(origin)
  const mountedRef = useRef(open)
  const [mounted, setMounted] = useState(open)
  const [active, setActive] = useState(false)
  const [closing, setClosing] = useState(false)
  const [pending, setPending] = useState(false)
  /** 打开时冻结 origin，关闭动画期间不受外部 props 影响 */
  const [sessionOrigin, setSessionOrigin] = useState(origin)
  const busy = confirmLoading || pending || closing
  const originStyle = useMemo(
    () => getOriginStyle(sessionOrigin),
    [sessionOrigin],
  )

  onCancelRef.current = onCancel
  onCloseRef.current = onClose
  originRef.current = origin
  mountedRef.current = mounted

  const resolvedTitle = title ?? preset.title
  const resolvedConfirmText = confirmText ?? preset.confirmText
  const resolvedCancelText = cancelText ?? preset.cancelText
  const resolvedShowCancel = showCancel ?? preset.showCancel
  const resolvedMaskClosable = maskClosable ?? preset.maskClosable

  useEffect(() => {
    if (!open) {
      setActive(false)
      if (!mountedRef.current) {
        return
      }
      const timer = window.setTimeout(() => {
        setMounted(false)
        setClosing(false)
      }, ANIMATION_MS)
      return () => window.clearTimeout(timer)
    }

    setSessionOrigin(originRef.current)
    setClosing(false)
    setMounted(true)
    setActive(false)

    let raf1 = 0
    let raf2 = 0
    raf1 = window.requestAnimationFrame(() => {
      raf2 = window.requestAnimationFrame(() => {
        setActive(true)
      })
    })
    return () => {
      window.cancelAnimationFrame(raf1)
      window.cancelAnimationFrame(raf2)
    }
  }, [open])

  useEffect(() => {
    if (!mounted || !active) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    confirmRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [active, mounted])

  const beginClose = (reason: 'confirm' | 'cancel') => {
    if (closing) {
      return
    }
    if (reason === 'cancel' && (pending || confirmLoading)) {
      return
    }
    setClosing(true)
    if (reason === 'cancel') {
      onCancelRef.current?.()
    }
    setActive(false)
    window.setTimeout(() => {
      setMounted(false)
      setClosing(false)
      setPending(false)
      onCloseRef.current?.()
    }, ANIMATION_MS)
  }

  useEffect(() => {
    if (!mounted || !active) {
      return
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        beginClose('cancel')
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  const handleMaskClick = (event: MouseEvent<HTMLDivElement>) => {
    if (
      event.target !== event.currentTarget ||
      busy ||
      !resolvedMaskClosable
    ) {
      return
    }
    beginClose('cancel')
  }

  const handleCancel = () => {
    beginClose('cancel')
  }

  const handleConfirm = async () => {
    if (busy) {
      return
    }
    if (!onConfirm) {
      beginClose('confirm')
      return
    }
    try {
      setPending(true)
      await onConfirm()
      beginClose('confirm')
    } catch {
      setPending(false)
    }
  }

  if (!mounted || typeof document === 'undefined') {
    return null
  }

  return createPortal(
    <div
      className={`modal-mask fixed inset-0 z-[2000] flex items-center justify-center bg-[rgba(15,23,42,0.45)] px-4 ${
        active ? 'modal-mask-active' : ''
      }`}
      onClick={handleMaskClick}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={content ? contentId : undefined}
        style={originStyle}
        className={`modal-panel w-full max-w-[420px] overflow-hidden rounded-lg bg-white shadow-[0_12px_40px_rgba(16,24,40,0.18)] ${
          active ? 'modal-panel-active' : ''
        }`}
      >
        <div className="relative px-6 pt-6 pb-2">
          {closable && (
            <button
              type="button"
              aria-label="关闭"
              disabled={busy}
              onClick={handleCancel}
              className="absolute top-3 right-3 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded text-[#98a2b3] transition hover:bg-[#f5f7fa] hover:text-[#667085] disabled:cursor-not-allowed disabled:opacity-50"
            >
              ✕
            </button>
          )}

          <div className={showIcon ? 'pr-6' : ''}>
            <div className={`flex items-center gap-3 ${showIcon ? '' : 'pr-6'}`}>
              {showIcon ? <StatusIcon type={type} /> : null}
              <h2
                id={titleId}
                className="min-w-0 flex-1 text-base leading-6 font-semibold text-[#1f2937]"
              >
                {resolvedTitle}
              </h2>
            </div>
            {content != null && content !== '' && (
              <div
                id={contentId}
                className={`mt-2 text-sm leading-6 text-[#667085] ${
                  showIcon ? 'ml-9 whitespace-pre-wrap' : ''
                }`}
              >
                {content}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 pt-4 pb-5">
          {resolvedShowCancel && (
            <button
              type="button"
              disabled={busy}
              onClick={handleCancel}
              className="inline-flex h-9 min-w-[72px] cursor-pointer items-center justify-center rounded-md border border-[#dbe1ea] bg-white px-4 text-sm text-[#667085] transition hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {resolvedCancelText}
            </button>
          )}
          <button
            ref={confirmRef}
            type="button"
            disabled={busy}
            onClick={() => {
              void handleConfirm()
            }}
            className={`inline-flex h-9 min-w-[72px] cursor-pointer items-center justify-center rounded-md px-4 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${preset.confirmClass}`}
          >
            {pending || confirmLoading ? '处理中…' : resolvedConfirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
