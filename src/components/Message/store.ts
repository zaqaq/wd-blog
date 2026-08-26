import { create } from 'zustand'
import {
  buildMessagePayload,
  removeMessageById,
  upsertMessageList,
  type MessageItem,
  type MessageOpenOptions,
  type MessageType,
} from '@/lib/message.ts'

type MessageStore = {
  list: MessageItem[]
  open: (type: MessageType, content: string | MessageOpenOptions) => number
  close: (id: number) => void
  destroy: (key?: string) => void
}

let nextId = 1

export const useMessageStore = create<MessageStore>((set, get) => ({
  list: [],
  open: (type, content) => {
    const id = nextId++
    const next: MessageItem = { id, ...buildMessagePayload(type, content) }
    set({ list: upsertMessageList(get().list, next) })
    return id
  },
  close: (id) => {
    set({ list: removeMessageById(get().list, id) })
  },
  destroy: (key) => {
    if (key == null) {
      set({ list: [] })
      return
    }
    set({ list: get().list.filter((item) => item.key !== key) })
  },
}))

export type MessageApi = {
  open: (options: MessageOpenOptions) => number
  info: (content: string | MessageOpenOptions) => number
  success: (content: string | MessageOpenOptions) => number
  error: (content: string | MessageOpenOptions) => number
  warning: (content: string | MessageOpenOptions) => number
  destroy: (key?: string) => void
}

export function createMessageApi(
  open: (type: MessageType, content: string | MessageOpenOptions) => number,
  destroy: (key?: string) => void,
): MessageApi {
  return {
    open: (options) => open(options.type ?? 'info', options),
    info: (content) => open('info', content),
    success: (content) => open('success', content),
    error: (content) => open('error', content),
    warning: (content) => open('warning', content),
    destroy,
  }
}

export const message = createMessageApi(
  (type, content) => useMessageStore.getState().open(type, content),
  (key) => useMessageStore.getState().destroy(key),
)
