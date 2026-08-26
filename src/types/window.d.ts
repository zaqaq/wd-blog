import type { MessageApi } from '@/components/Message/store.ts'

declare global {
  interface Window {
    $message: MessageApi
  }
}

export {}
