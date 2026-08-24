import { create } from 'zustand'
import type { ModalOpenOptions, ModalType } from '@/components/Modal/types.ts'

export type ModalQueueEntry = ModalOpenOptions & {
  id: number
  open: boolean
  resolve?: (confirmed: boolean) => void
}

type ModalStore = {
  queue: ModalQueueEntry[]
  open: (options: ModalOpenOptions) => Promise<boolean>
  close: (id: number, confirmed: boolean) => void
}

let nextId = 1

export const useModalStore = create<ModalStore>((set, get) => ({
  queue: [],
  open: (options) =>
    new Promise<boolean>((resolve) => {
      const id = nextId++
      set((state) => ({
        queue: [
          ...state.queue,
          {
            ...options,
            id,
            open: true,
            resolve,
          },
        ],
      }))
    }),
  close: (id, confirmed) => {
    const entry = get().queue.find((item) => item.id === id)
    entry?.resolve?.(confirmed)
    set((state) => ({
      queue: state.queue.filter((item) => item.id !== id),
    }))
  },
}))

export type ModalApi = {
  open: (options: ModalOpenOptions) => Promise<boolean>
  info: (options?: ModalOpenOptions) => Promise<boolean>
  success: (options?: ModalOpenOptions) => Promise<boolean>
  error: (options?: ModalOpenOptions) => Promise<boolean>
  warning: (options?: ModalOpenOptions) => Promise<boolean>
  confirm: (options?: ModalOpenOptions) => Promise<boolean>
}

export function createModalApi(
  open: (options: ModalOpenOptions) => Promise<boolean>,
): ModalApi {
  const openTyped = (type: ModalType, options: ModalOpenOptions = {}) =>
    open({ ...options, type })

  return {
    open,
    info: (options = {}) => openTyped('info', options),
    success: (options = {}) => openTyped('success', options),
    error: (options = {}) => openTyped('error', options),
    warning: (options = {}) => openTyped('warning', options),
    confirm: (options = {}) => openTyped('confirm', options),
  }
}

const globalModal = createModalApi((options) =>
  useModalStore.getState().open(options),
)

/** 全局命令式 API（依赖根节点 ModalHost） */
export const modal = globalModal
