import { message, type MessageApi } from '@/components/Message/store.ts'

export function useMessage(): MessageApi {
  return message
}
