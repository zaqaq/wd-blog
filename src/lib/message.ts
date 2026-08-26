export type MessageType = 'info' | 'success' | 'error' | 'warning'

export const DEFAULT_MESSAGE_DURATION_MS = 3000
export const MAX_MESSAGES = 5

export type MessageOpenOptions = {
  type?: MessageType
  content: string
  duration?: number
  closable?: boolean
  key?: string
}

export type MessageItem = {
  id: number
  type: MessageType
  content: string
  duration: number
  closable: boolean
  key?: string
}

export function resolveMessageDuration(duration?: number) {
  if (duration == null) {
    return DEFAULT_MESSAGE_DURATION_MS
  }
  if (duration <= 0) {
    return 0
  }
  return duration
}

export function buildMessagePayload(
  type: MessageType,
  content: string | MessageOpenOptions,
): Omit<MessageItem, 'id'> {
  if (typeof content === 'string') {
    return {
      type,
      content,
      duration: DEFAULT_MESSAGE_DURATION_MS,
      closable: true,
    }
  }
  return {
    type: content.type ?? type,
    content: content.content,
    duration: resolveMessageDuration(content.duration),
    closable: content.closable ?? true,
    key: content.key,
  }
}

export function upsertMessageList(
  current: readonly MessageItem[],
  next: MessageItem,
  max = MAX_MESSAGES,
) {
  const withoutDup = next.key
    ? current.filter((item) => item.key !== next.key)
    : [...current]
  const merged = [...withoutDup, next]
  if (merged.length <= max) {
    return merged
  }
  return merged.slice(merged.length - max)
}

export function removeMessageById(
  current: readonly MessageItem[],
  id: number,
) {
  return current.filter((item) => item.id !== id)
}
