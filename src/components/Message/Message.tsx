import { useEffect, useRef, useState } from 'react'
import type { MessageItem, MessageType } from '@/lib/message.ts'

const ANIMATION_MS = 200

const iconColor: Record<MessageType, string> = {
  info: 'text-[#2080f0]',
  success: 'text-[#18a058]',
  warning: 'text-[#f0a020]',
  error: 'text-[#d03050]',
}

function StatusGlyph({ type }: { type: MessageType }) {
  const shared = {
    className: 'h-5 w-5',
    fill: 'currentColor',
    fillRule: 'evenodd' as const,
    'aria-hidden': true,
  } as const

  switch (type) {
    case 'success':
      return (
        <svg {...shared} viewBox="0 0 48 48">
          <path d="M24 4c11.046 0 20 8.954 20 20s-8.954 20-20 20S4 35.046 4 24 12.954 4 24 4Zm8.634 13.59c.545-.553.545-1.427 0-1.98-.545-.552-1.42-.552-1.964 0L20.5 25.78l-3.17-3.17c-.545-.552-1.42-.552-1.964 0-.545.553-.545 1.427 0 1.98l4.17 4.17c.545.544 1.42.544 1.964 0l11.134-11.17Z" />
        </svg>
      )
    case 'error':
      return (
        <svg {...shared} viewBox="0 0 48 48">
          <path d="M24 4c11.046 0 20 8.954 20 20s-8.954 20-20 20S4 35.046 4 24 12.954 4 24 4ZM17.884 16.116l-.102-.091c-.456-.367-1.11-.367-1.565 0l-.102.091-.091.102c-.367.456-.367 1.109 0 1.565l.091.102L22.233 24l-6.117 6.116-.091.102c-.367.456-.367 1.109 0 1.565l.091.102.102.091c.456.367 1.109.367 1.565 0l.102-.091L24 25.767l6.116 6.117.102.091c.456.367 1.109.367 1.565 0l.102-.091.091-.102c.367-.456.367-1.109 0-1.565l-.091-.102L25.767 24l6.117-6.116.091-.102c.367-.456.367-1.109 0-1.565l-.091-.102-.102-.091c-.456-.367-1.109-.367-1.565 0l-.102.091L24 22.233l-6.116-6.117Z" />
        </svg>
      )
    case 'warning':
      return (
        <svg {...shared} viewBox="0 0 24 24">
          <path d="M12.866 3.5a1 1 0 0 0-1.732 0L1.634 20.25A1 1 0 0 0 2.5 21.75h19a1 1 0 0 0 .866-1.5L12.866 3.5ZM12 9.25a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0V10a.75.75 0 0 1 .75-.75Zm0 10.25a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
        </svg>
      )
    default:
      return (
        <svg {...shared} viewBox="0 0 28 28">
          <path d="M14 2c6.627 0 12 5.373 12 12s-5.373 12-12 12S2 20.627 2 14 7.373 2 14 2Zm0 9c-.552 0-1 .448-1 1v8c0 .552.448 1 1 1s1-.448 1-1v-8c0-.552-.448-1-1-1Zm0-4.25A1.25 1.25 0 1 0 14 9.25 1.25 1.25 0 0 0 14 6.75Z" />
        </svg>
      )
  }
}

export function Message({
  item,
  onClose,
}: {
  item: MessageItem
  onClose: (id: number) => void
}) {
  const [active, setActive] = useState(false)
  const closingRef = useRef(false)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  const beginClose = () => {
    if (closingRef.current) {
      return
    }
    closingRef.current = true
    setActive(false)
    window.setTimeout(() => {
      onCloseRef.current(item.id)
    }, ANIMATION_MS)
  }

  useEffect(() => {
    const enter = window.requestAnimationFrame(() => setActive(true))
    return () => window.cancelAnimationFrame(enter)
  }, [])

  useEffect(() => {
    if (item.duration <= 0) {
      return
    }
    const timer = window.setTimeout(beginClose, item.duration)
    return () => window.clearTimeout(timer)
  }, [item.duration, item.id])

  return (
    <div
      role="status"
      className={`message-item flex min-w-[min(92vw,420px)] max-w-[min(92vw,720px)] items-center overflow-hidden rounded-[3px] bg-white px-5 py-2.5 text-[14px] leading-[1.6] text-[rgb(51,54,57)] shadow-[0_3px_6px_-4px_rgba(0,0,0,.12),0_6px_16px_0_rgba(0,0,0,.08),0_9px_28px_8px_rgba(0,0,0,.05)] ${
        active ? 'message-item-active' : ''
      }`}
    >
      <span
        className={`mr-2.5 inline-flex h-5 w-5 shrink-0 items-center justify-center ${iconColor[item.type]}`}
      >
        <StatusGlyph type={item.type} />
      </span>
      <p className="min-w-0 flex-1">{item.content}</p>
      {item.closable ? (
        <button
          type="button"
          aria-label="关闭"
          className="ml-2.5 inline-flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded text-[#98a2b3] transition hover:bg-[#f5f7fa] hover:text-[#667085]"
          onClick={beginClose}
        >
          ✕
        </button>
      ) : null}
    </div>
  )
}
