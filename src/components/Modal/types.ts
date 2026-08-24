import type { ReactNode } from 'react'

export type ModalType = 'info' | 'success' | 'error' | 'warning' | 'confirm'

/** 屏幕中心，或点击坐标 / 事件 / 元素中心 */
export type ModalOrigin =
  | 'center'
  | { x: number; y: number }
  | Pick<MouseEvent, 'clientX' | 'clientY'>
  | HTMLElement

export type ModalOriginPoint = {
  mode: 'center' | 'point'
  x: number
  y: number
}

export function resolveModalOrigin(
  origin: ModalOrigin = 'center',
): ModalOriginPoint {
  if (origin === 'center') {
    return { mode: 'center', x: 0, y: 0 }
  }
  if (typeof HTMLElement !== 'undefined' && origin instanceof HTMLElement) {
    const rect = origin.getBoundingClientRect()
    return {
      mode: 'point',
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    }
  }
  if ('clientX' in origin && 'clientY' in origin) {
    return { mode: 'point', x: origin.clientX, y: origin.clientY }
  }
  if ('x' in origin && 'y' in origin) {
    return { mode: 'point', x: origin.x, y: origin.y }
  }
  return { mode: 'center', x: 0, y: 0 }
}

export type ModalProps = {
  open: boolean
  type?: ModalType
  title?: string
  content?: ReactNode
  confirmText?: string
  cancelText?: string
  /** 是否显示取消按钮；confirm 默认 true，其余默认 false */
  showCancel?: boolean
  /** 点击遮罩是否关闭，默认 true；confirm 默认 false */
  maskClosable?: boolean
  /** 是否显示右上角关闭，默认 true */
  closable?: boolean
  /** 是否显示状态图标，默认 true */
  showIcon?: boolean
  confirmLoading?: boolean
  /** 动画起点：默认 center；传点击事件或坐标则从该点展开 */
  origin?: ModalOrigin
  onConfirm?: () => void | Promise<void>
  onCancel?: () => void
  onClose?: () => void
}

export type ModalOpenOptions = Omit<ModalProps, 'open' | 'onClose'> & {
  onClose?: () => void
}

export const modalDefaults: Record<
  ModalType,
  {
    title: string
    confirmText: string
    cancelText: string
    showCancel: boolean
    maskClosable: boolean
    iconClass: string
    iconBg: string
    confirmClass: string
  }
> = {
  info: {
    title: '提示',
    confirmText: '知道了',
    cancelText: '取消',
    showCancel: false,
    maskClosable: true,
    iconClass: 'text-white',
    iconBg: 'bg-[#1aa5ff]',
    confirmClass: 'bg-[#09f] hover:bg-[#0088e0]',
  },
  success: {
    title: '成功',
    confirmText: '知道了',
    cancelText: '取消',
    showCancel: false,
    maskClosable: true,
    iconClass: 'text-white',
    iconBg: 'bg-[#3fad5e]',
    confirmClass: 'bg-[#3fad5e] hover:bg-[#359a52]',
  },
  error: {
    title: '错误',
    confirmText: '知道了',
    cancelText: '取消',
    showCancel: false,
    maskClosable: true,
    iconClass: 'text-white',
    iconBg: 'bg-[#e5484d]',
    confirmClass: 'bg-[#e5484d] hover:bg-[#d43c41]',
  },
  warning: {
    title: '警告',
    confirmText: '知道了',
    cancelText: '取消',
    showCancel: false,
    maskClosable: true,
    iconClass: 'text-white',
    iconBg: 'bg-[#f90]',
    confirmClass: 'bg-[#f90] hover:bg-[#e68a00]',
  },
  confirm: {
    title: '确认',
    confirmText: '确定',
    cancelText: '取消',
    showCancel: true,
    maskClosable: false,
    iconClass: 'text-[#09f]',
    iconBg: 'border-2 border-[#09f] bg-transparent',
    confirmClass: 'bg-[#09f] hover:bg-[#0088e0]',
  },
}
